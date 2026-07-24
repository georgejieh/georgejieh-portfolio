/**
 * REED reader support module for the static Astro page.
 *
 * The JSON contract is defined in two canonical sources, kept in lockstep:
 *   - backend/app/digests/models.py (Pydantic Digest)
 *   - dashboard/src/lib/types.ts (TypeScript mirror of the same shape)
 *
 * The types below are a third copy. validateDigestShape() enforces the
 * shape at runtime so a contract break fails into the error state
 * instead of rendering garbage.
 *
 * The dataset base URL is the single build-time seam between this page
 * and the dataset. See the constant below.
 */

// Dataset base URL. Change this constant and redeploy to point at a different source.
export const DATASET_BASE: string =
  "https://huggingface.co/datasets/PLACEHOLDER_OWNER/PLACEHOLDER_REPO/resolve/main";

/** Regex guard for the ?d=<id> query parameter. The store's _make_id
 *  produces YYYY-MM-DD-<session> where session is the normalized
 *  SessionName. */
export const ID_REGEX: RegExp =
  /^\d{4}-\d{2}-\d{2}-(pre_market|early_market|midday|close|weekend_recap)$/;

export type Sentiment = "bullish" | "bearish" | "neutral";

export type SessionName =
  | "pre_market"
  | "early_market"
  | "midday"
  | "close"
  | "weekend_recap";

export interface Source {
  id: number;
  name: string;
  url: string;
}

export interface Story {
  tickers: string[];
  headline: string;
  summary: string;
  sentiment: Sentiment;
  source_name: string;
  source_url: string;
}

export interface MarketSnapshotValue {
  value: string;
  change_pct?: string | null;
  as_of?: string | null;
  delayed: boolean;
}

export interface MarketSnapshotMeta {
  source: string;
  fetched_at: string;
  values_raw: Record<string, MarketSnapshotValue>;
  delayed: boolean;
}

export interface Generation {
  provider: string;
  model: string;
  agent_turns: number;
  tool_calls: number;
  scraped_urls: number;
  fallback_used: boolean;
  duration_ms: number;
}

export interface Digest {
  id?: string | null;
  session: SessionName;
  as_of: string;
  headline: string;
  executive_summary: string;
  market_snapshot: Record<string, string>;
  market_snapshot_meta: MarketSnapshotMeta;
  stories: Story[];
  themes: string[];
  watch_next_session: string[];
  sources: Source[];
  generation: Generation;
}

export interface IndexEntry {
  id: string;
  as_of: string;
}

/** HTML-escape helper. Copied from the structural reference page
 *  (machineread.astro). Same behavior. */
export function esc(s: string): string {
  return String(s ?? "").replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function isObject(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

/** Parses the defensive shape of _index.json. Accepts an array of
 *  {id, as_of} objects (current store shape) or an array of strings
 *  (the dashboard's mistaken cast). Objects are preferred. */
export function parseIndexEntries(raw: unknown): IndexEntry[] {
  if (!Array.isArray(raw)) return [];
  const out: IndexEntry[] = [];
  for (const entry of raw) {
    if (isString(entry)) {
      out.push({ id: entry, as_of: "" });
      continue;
    }
    if (isObject(entry) && isString(entry.id)) {
      out.push({
        id: entry.id,
        as_of: isString(entry.as_of) ? entry.as_of : "",
      });
    }
  }
  return out;
}

/** Throws on hard mismatch with the Digest shape. The reader catches
 *  and transitions to the error state. */
export function validateDigestShape(raw: unknown): Digest {
  if (!isObject(raw)) {
    throw new Error("digest is not an object");
  }

  if (!isString(raw.session)) {
    throw new Error("digest.session missing or not a string");
  }
  if (!isString(raw.as_of)) {
    throw new Error("digest.as_of missing or not a string");
  }
  if (!isString(raw.headline)) {
    throw new Error("digest.headline missing or not a string");
  }
  if (!isString(raw.executive_summary)) {
    throw new Error("digest.executive_summary missing or not a string");
  }

  if (!isObject(raw.market_snapshot_meta)) {
    throw new Error("digest.market_snapshot_meta missing");
  }
  const meta = raw.market_snapshot_meta;
  if (!isString(meta.source) || !isString(meta.fetched_at)) {
    throw new Error("market_snapshot_meta.source/fetched_at missing");
  }
  if (!isObject(meta.values_raw)) {
    throw new Error("market_snapshot_meta.values_raw missing");
  }

  if (!Array.isArray(raw.stories)) {
    throw new Error("digest.stories is not an array");
  }
  for (let i = 0; i < raw.stories.length; i += 1) {
    const s = raw.stories[i];
    if (!isObject(s)) {
      throw new Error(`stories[${i}] is not an object`);
    }
    if (!isString(s.headline) || !isString(s.summary) || !isString(s.sentiment)) {
      throw new Error(`stories[${i}] missing headline/summary/sentiment`);
    }
    if (!Array.isArray(s.tickers)) {
      throw new Error(`stories[${i}].tickers is not an array`);
    }
  }

  if (!Array.isArray(raw.watch_next_session)) {
    throw new Error("digest.watch_next_session is not an array");
  }
  if (!Array.isArray(raw.sources)) {
    throw new Error("digest.sources is not an array");
  }
  if (!isObject(raw.generation)) {
    throw new Error("digest.generation is not an object");
  }

  // At this point the shape is structurally valid. Cast through unknown
  // so downstream consumers can rely on it.
  return raw as unknown as Digest;
}
