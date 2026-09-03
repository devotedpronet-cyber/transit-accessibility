const { onSchedule } = require('firebase-functions/v2/scheduler');
const { onRequest } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { load } = require('cheerio');

initializeApp();

const STATUS_URL =
  'https://www.metrolisboa.pt/wp-admin/admin-ajax.php?action=estado_linha_ajax_2022_nova_action';

const LINE_ID_PREFIX = 'resultados';

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Parses the undocumented Metro Lisboa AJAX fragment into per-equipment
// status rows. Markup is unversioned and can change without notice — see
// WORK_PLAN_MOBILE.md Phase 5.3.
function parseElevatorStatus(html) {
  const $ = load(html);
  const rows = [];

  $(`[id^="${LINE_ID_PREFIX}"]`).each((_, lineEl) => {
    const line = $(lineEl).attr('id').slice(LINE_ID_PREFIX.length);

    $(lineEl)
      .find('.accordionElev')
      .each((__, stationEl) => {
        const station = $(stationEl)
          .find('.accordionElev__title')
          .first()
          .contents()
          .first()
          .text()
          .trim();
        if (!station) return;

        $(stationEl)
          .find('table tbody tr')
          .each((___, rowEl) => {
            const cells = $(rowEl).find('td');
            const equipment = $(cells[0]).text().trim();
            const number = $(cells[1]).text().trim();
            const location = $(cells[2]).text().trim();
            const status = $(cells[3]).text().trim();
            if (!equipment || !number) return;

            rows.push({ line, station, equipment, number, location, status });
          });
      });
  });

  return rows;
}

async function pollAndStore() {
  const response = await fetch(STATUS_URL);
  if (!response.ok) {
    throw new Error(`Metro Lisboa status endpoint returned ${response.status}`);
  }
  const html = await response.text();
  const rows = parseElevatorStatus(html);

  if (rows.length === 0) {
    // Empty parse likely means the source markup changed shape, not that
    // every elevator vanished. Never overwrite good data with a bad parse.
    throw new Error('Parsed zero equipment rows — source markup may have changed');
  }

  const db = getFirestore();
  const batch = db.batch();
  const checkedAt = FieldValue.serverTimestamp();

  for (const row of rows) {
    const docId = `${slugify(row.line)}_${slugify(row.station)}_${slugify(row.equipment)}-${row.number}`;
    const ref = db.collection('elevatorStatus').doc(docId);
    batch.set(ref, {
      line: row.line,
      station: row.station,
      equipment: row.equipment,
      number: row.number,
      location: row.location,
      status: row.status,
      lastChecked: checkedAt,
    });
  }

  await batch.commit();
  return rows.length;
}

exports.pollElevatorStatus = onSchedule(
  { schedule: 'every 10 minutes', region: 'europe-west1', timeoutSeconds: 60 },
  async () => {
    const count = await pollAndStore();
    console.log(`Updated ${count} equipment rows`);
  }
);

// Manual trigger for testing / on-demand refresh.
exports.pollElevatorStatusNow = onRequest(
  { region: 'europe-west1' },
  async (req, res) => {
    try {
      const count = await pollAndStore();
      res.status(200).json({ ok: true, updated: count });
    } catch (err) {
      console.error(err);
      res.status(500).json({ ok: false, error: err.message });
    }
  }
);
