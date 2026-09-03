#!/usr/bin/env node
// Polls the undocumented Metro Lisboa AJAX status endpoint and writes
// normalized per-equipment rows to Firestore. Run by
// .github/workflows/poll-elevator-status.yml on a schedule (no Firebase
// Cloud Functions / Blaze plan required). See WORK_PLAN_MOBILE.md Phase 5.3.

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { load } = require('cheerio');

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

async function main() {
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

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountJson) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT env var not set');
  }
  const serviceAccount = JSON.parse(serviceAccountJson);

  initializeApp({ credential: cert(serviceAccount) });
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
  console.log(`Updated ${rows.length} equipment rows`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
