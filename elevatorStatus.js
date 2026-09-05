// Phase 5.4: outage-aware trip warnings.
// Reads the live elevator-status rows written by scripts/poll-elevator-status.js
// (Metro Lisboa's own feed, polled on a schedule via GitHub Actions — see that
// script's header) and turns them into a per-stop warning so a "known-accessible"
// metro station can honestly say "the elevator is down right now" instead of
// just showing a static green checkmark. Never fabricates: a fetch failure or a
// status value we don't recognize means "no warning shown", not "assume broken".
//
// Confirmed live vocabulary from Metro Lisboa's own feed (checked 2026-09-05):
// only two status strings exist, 'Operacional' and 'Fora de serviço'. If a third
// value ever shows up, treat it as unknown/no-warning rather than guessing.
const OUT_OF_SERVICE_STATUS = 'Fora de serviço';

const FIRESTORE_PROJECT_ID = 'lisbon-transit-accessibility';
const ELEVATOR_STATUS_URL = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/(default)/documents/elevatorStatus`;

function fieldValue(fields, key) {
  const field = fields?.[key];
  if (!field) return undefined;
  return field.stringValue ?? field.timestampValue;
}

// Converts one Firestore REST API document into a plain row matching the
// shape scripts/poll-elevator-status.js writes (line, station, equipment,
// number, location, status, lastChecked).
export function parseFirestoreDoc(doc) {
  const fields = doc.fields || {};
  return {
    line: fieldValue(fields, 'line'),
    station: fieldValue(fields, 'station'),
    equipment: fieldValue(fields, 'equipment'),
    number: fieldValue(fields, 'number'),
    location: fieldValue(fields, 'location'),
    status: fieldValue(fields, 'status'),
    lastChecked: fieldValue(fields, 'lastChecked'),
  };
}

export function isOutOfService(row) {
  return row.status === OUT_OF_SERVICE_STATUS;
}

// Metro stop names in stops.js carry a " (Metro)" suffix the live feed's
// station names don't; strip it before comparing.
function normalizeStationName(name) {
  return name
    .replace(/\s*\(metro\)\s*$/i, '')
    .trim()
    .toLowerCase();
}

// Returns the out-of-service elevator rows (if any) for one stop. Only
// meaningful for known-accessible metro stops — the live feed has no data
// for bus/tram/ferry, so this always returns [] for those and that's honest,
// not a false negative.
export function outagesForStop(stop, elevatorRows) {
  if (!stop?.name || !Array.isArray(elevatorRows)) return [];
  const target = normalizeStationName(stop.name);
  return elevatorRows.filter(
    (row) => row.station && normalizeStationName(row.station) === target && isOutOfService(row)
  );
}

export function outageWarning(outages) {
  if (!outages || outages.length === 0) return null;
  const count = outages.length;
  return count === 1
    ? 'Elevator reported out of service right now'
    : `${count} elevators reported out of service right now`;
}

// Fetches all current elevator-status rows. Firestore rules allow public,
// unauthenticated read access to this collection (see firestore.rules) so no
// API key or client SDK is needed — a plain REST call is enough.
export async function fetchElevatorStatus() {
  const rows = [];
  let pageToken;

  do {
    const url = new URL(ELEVATOR_STATUS_URL);
    url.searchParams.set('pageSize', '300');
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Elevator status endpoint returned ${response.status}`);
    }
    const body = await response.json();
    for (const entry of body.documents || []) {
      rows.push(parseFirestoreDoc(entry));
    }
    pageToken = body.nextPageToken;
  } while (pageToken);

  return rows;
}
