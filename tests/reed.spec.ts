import { expect, test } from '@playwright/test';
import {
  ID_REGEX,
  parseIndexEntries,
  validateDigestShape,
} from '../src/lib/reed';

test.describe('reed reader pure helpers', () => {
  test('ID_REGEX accepts the five valid session names', () => {
    expect(ID_REGEX.test('2026-07-21-pre_market')).toBe(true);
    expect(ID_REGEX.test('2026-07-21-early_market')).toBe(true);
    expect(ID_REGEX.test('2026-07-21-midday')).toBe(true);
    expect(ID_REGEX.test('2026-07-21-close')).toBe(true);
    expect(ID_REGEX.test('2026-07-26-weekend_recap')).toBe(true);
  });

  test('ID_REGEX rejects traversal, wrong shape, and empty ids', () => {
    expect(ID_REGEX.test('')).toBe(false);
    expect(ID_REGEX.test('../etc/passwd')).toBe(false);
    expect(ID_REGEX.test('2026-07-21-Pre-Market')).toBe(false);
    expect(ID_REGEX.test('2026-7-21-pre_market')).toBe(false);
    expect(ID_REGEX.test('pre_market')).toBe(false);
    expect(ID_REGEX.test('2026-07-21-pre_market;')).toBe(false);
    expect(ID_REGEX.test('javascript:alert(1)')).toBe(false);
  });

  test('parseIndexEntries accepts the object array shape from the store', () => {
    const raw = [
      { id: '2026-07-21-pre_market', as_of: '2026-07-21T08:00:00-04:00' },
      { id: '2026-07-21-early_market', as_of: '2026-07-21T09:45:00-04:00' },
    ];
    const out = parseIndexEntries(raw);
    expect(out).toEqual([
      { id: '2026-07-21-pre_market', as_of: '2026-07-21T08:00:00-04:00' },
      { id: '2026-07-21-early_market', as_of: '2026-07-21T09:45:00-04:00' },
    ]);
  });

  test('parseIndexEntries accepts the string array shape (defensive)', () => {
    const raw = [
      '2026-07-21-pre_market',
      '2026-07-21-early_market',
    ];
    const out = parseIndexEntries(raw);
    expect(out).toEqual([
      { id: '2026-07-21-pre_market', as_of: '' },
      { id: '2026-07-21-early_market', as_of: '' },
    ]);
  });

  test('parseIndexEntries drops entries with invalid ids', () => {
    const raw = [
      { id: '2026-07-21-pre_market', as_of: '2026-07-21T08:00:00-04:00' },
      { id: '../etc/passwd', as_of: '2026-07-21T09:45:00-04:00' },
      '2026-07-21-midday',
      '',
      null,
      { id: 42, as_of: '2026-07-21T12:30:00-04:00' },
    ];
    const out = parseIndexEntries(raw as unknown[]);
    expect(out.map((e) => e.id)).toEqual([
      '2026-07-21-pre_market',
      '2026-07-21-midday',
    ]);
  });

  test('parseIndexEntries returns [] for non-array input', () => {
    expect(parseIndexEntries(null)).toEqual([]);
    expect(parseIndexEntries({})).toEqual([]);
    expect(parseIndexEntries('not an array')).toEqual([]);
  });

  test('validateDigestShape accepts a complete valid digest', () => {
    const sample = {
      session: 'pre_market',
      as_of: '2026-07-21T08:00:00-04:00',
      headline: 'Futures steady ahead of CPI',
      executive_summary: 'S&P 500 futures are flat to slightly higher.',
      market_snapshot: { 'S&P 500 futures': '+0.1%' },
      market_snapshot_meta: {
        source: 'stooq',
        fetched_at: '2026-07-21T08:00:00-04:00',
        values_raw: {
          '^SPX': { value: '5287.40', change_pct: '+0.12', delayed: true },
        },
        delayed: true,
      },
      stories: [
        {
          tickers: ['NVDA'],
          headline: 'NVDA up 2%',
          summary: 'Nvidia gained on AI capex commentary.',
          sentiment: 'bullish',
          source_name: 'Bloomberg',
          source_url: 'https://www.bloomberg.com/example',
        },
      ],
      themes: ['AI capex'],
      watch_next_session: ['8:30 ET CPI release'],
      sources: [{ id: 1, name: 'Bloomberg', url: 'https://www.bloomberg.com/example' }],
      generation: {
        provider: 'openrouter',
        model: 'google/gemini-2.5-flash-lite',
        agent_turns: 4,
        tool_calls: 9,
        scraped_urls: 8,
        fallback_used: false,
        duration_ms: 21430,
      },
    };
    expect(() => validateDigestShape(sample)).not.toThrow();
  });

  test('validateDigestShape throws when stories are missing source_name or source_url', () => {
    const base = {
      session: 'pre_market',
      as_of: '2026-07-21T08:00:00-04:00',
      headline: 'Futures steady ahead of CPI',
      executive_summary: 'S&P 500 futures are flat to slightly higher.',
      market_snapshot: { 'S&P 500 futures': '+0.1%' },
      market_snapshot_meta: {
        source: 'stooq',
        fetched_at: '2026-07-21T08:00:00-04:00',
        values_raw: {},
        delayed: true,
      },
      watch_next_session: [],
      sources: [],
      generation: {
        provider: 'openrouter',
        model: 'm',
        agent_turns: 0,
        tool_calls: 0,
        scraped_urls: 0,
        fallback_used: false,
        duration_ms: 0,
      },
    };
    const missingSourceName = {
      ...base,
      stories: [
        {
          tickers: ['NVDA'],
          headline: 'NVDA up 2%',
          summary: 'Nvidia gained on AI capex commentary.',
          sentiment: 'bullish',
          source_url: 'https://www.bloomberg.com/example',
        },
      ],
    };
    expect(() => validateDigestShape(missingSourceName)).toThrow(/source_name/);

    const missingSourceUrl = {
      ...base,
      stories: [
        {
          tickers: ['NVDA'],
          headline: 'NVDA up 2%',
          summary: 'Nvidia gained on AI capex commentary.',
          sentiment: 'bullish',
          source_name: 'Bloomberg',
        },
      ],
    };
    expect(() => validateDigestShape(missingSourceUrl)).toThrow(/source_url/);
  });

  test('validateDigestShape throws when market_snapshot_meta.values_raw is missing', () => {
    const sample = {
      session: 'pre_market',
      as_of: '2026-07-21T08:00:00-04:00',
      headline: 'Futures steady ahead of CPI',
      executive_summary: 'S&P 500 futures are flat to slightly higher.',
      market_snapshot: {},
      market_snapshot_meta: {
        source: 'stooq',
        fetched_at: '2026-07-21T08:00:00-04:00',
        delayed: true,
      },
      stories: [],
      watch_next_session: [],
      sources: [],
      generation: {
        provider: 'p',
        model: 'm',
        agent_turns: 0,
        tool_calls: 0,
        scraped_urls: 0,
        fallback_used: false,
        duration_ms: 0,
      },
    };
    expect(() => validateDigestShape(sample)).toThrow(/values_raw/);
  });
});

test.describe('reed reader page', () => {
  test('loads and clears aria-busy after the first data fetch resolves', async ({
    page,
  }) => {
    // The page is built with a placeholder DATASET_BASE; the fetch
    // resolves to a 404 (or network error) and the reader transitions
    // to the error state. Once the operator sets a real dataset URL,
    // this same test still passes because the success state also
    // clears aria-busy.
    await page.goto('/reed');
    const reader = page.getByLabel('Brief reader');
    await expect(reader).toBeVisible();
    await expect(reader).not.toBeEmpty();
    await expect(reader).toHaveAttribute('aria-busy', 'false', { timeout: 30000 });
  });
});
