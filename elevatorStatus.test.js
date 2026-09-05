import { jest } from '@jest/globals';
import {
  parseFirestoreDoc,
  isOutOfService,
  outagesForStop,
  outageWarning,
  fetchElevatorStatus,
} from './elevatorStatus.js';

describe('parseFirestoreDoc', () => {
  it('extracts plain fields from a Firestore REST document', () => {
    const doc = {
      fields: {
        line: { stringValue: 'Amarela' },
        station: { stringValue: 'Campo Grande' },
        equipment: { stringValue: 'Elevador' },
        number: { stringValue: '1' },
        location: { stringValue: 'Cais' },
        status: { stringValue: 'Fora de serviço' },
        lastChecked: { timestampValue: '2026-09-05T10:00:00Z' },
      },
    };
    expect(parseFirestoreDoc(doc)).toEqual({
      line: 'Amarela',
      station: 'Campo Grande',
      equipment: 'Elevador',
      number: '1',
      location: 'Cais',
      status: 'Fora de serviço',
      lastChecked: '2026-09-05T10:00:00Z',
    });
  });

  it('handles a document with no fields', () => {
    expect(parseFirestoreDoc({})).toEqual({
      line: undefined,
      station: undefined,
      equipment: undefined,
      number: undefined,
      location: undefined,
      status: undefined,
      lastChecked: undefined,
    });
  });
});

describe('isOutOfService', () => {
  it('matches the exact live status string', () => {
    expect(isOutOfService({ status: 'Fora de serviço' })).toBe(true);
  });

  it('does not match Operacional', () => {
    expect(isOutOfService({ status: 'Operacional' })).toBe(false);
  });

  it('does not match an unrecognized status', () => {
    expect(isOutOfService({ status: 'Manutenção' })).toBe(false);
  });
});

describe('outagesForStop', () => {
  const rows = [
    { station: 'Campo Grande', status: 'Fora de serviço' },
    { station: 'Campo Grande', status: 'Operacional' },
    { station: 'Rato', status: 'Fora de serviço' },
  ];

  it('matches a stop name with the (Metro) suffix against bare live station names', () => {
    const stop = { name: 'Campo Grande (Metro)' };
    expect(outagesForStop(stop, rows)).toEqual([
      { station: 'Campo Grande', status: 'Fora de serviço' },
    ]);
  });

  it('returns an empty array when the stop has no outage rows', () => {
    const stop = { name: 'Alameda (Metro)' };
    expect(outagesForStop(stop, rows)).toEqual([]);
  });

  it('returns an empty array for a non-metro stop with no matching feed data', () => {
    const stop = { name: 'Some Bus Stop' };
    expect(outagesForStop(stop, rows)).toEqual([]);
  });

  it('returns an empty array when elevatorRows is not an array', () => {
    expect(outagesForStop({ name: 'Rato (Metro)' }, null)).toEqual([]);
  });

  it('returns an empty array when the stop has no name', () => {
    expect(outagesForStop({}, rows)).toEqual([]);
  });
});

describe('outageWarning', () => {
  it('returns null for no outages', () => {
    expect(outageWarning([])).toBeNull();
    expect(outageWarning(null)).toBeNull();
  });

  it('singular phrasing for one outage', () => {
    expect(outageWarning([{}])).toBe('Elevator reported out of service right now');
  });

  it('plural phrasing for multiple outages', () => {
    expect(outageWarning([{}, {}])).toBe('2 elevators reported out of service right now');
  });
});

describe('fetchElevatorStatus', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('parses documents from a successful response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        documents: [
          { fields: { station: { stringValue: 'Rato' }, status: { stringValue: 'Operacional' } } },
        ],
      }),
    });

    const rows = await fetchElevatorStatus();
    expect(rows).toEqual([
      {
        line: undefined,
        station: 'Rato',
        equipment: undefined,
        number: undefined,
        location: undefined,
        status: 'Operacional',
        lastChecked: undefined,
      },
    ]);
  });

  it('follows nextPageToken across multiple pages', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: [{ fields: { station: { stringValue: 'A' } } }],
          nextPageToken: 'page2',
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          documents: [{ fields: { station: { stringValue: 'B' } } }],
        }),
      });

    const rows = await fetchElevatorStatus();
    expect(rows).toHaveLength(2);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('throws when the response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 503 });
    await expect(fetchElevatorStatus()).rejects.toThrow('503');
  });
});
