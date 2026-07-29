export const REED_API_ORIGIN = 'https://reed-portfolio-backend.onrender.com';

export interface ReedDigestItem {
	headline: string;
	summary: string;
	source_name: string;
	source_url: string;
	published_at: string;
	market_sentiment: 'bullish' | 'bearish' | 'mixed' | 'neutral';
	market_relevance: string;
	tickers: string[];
}

export interface ReedDigest {
	id: string;
	source_run_id: string;
	market_window: string;
	title: string;
	summary: string;
	published_at: string;
	items: ReedDigestItem[];
}

export interface ReedApi {
	listDigests(): Promise<ReedDigest[]>;
	getDigest(id: string): Promise<ReedDigest>;
}

export function esc(value: unknown): string {
	return String(value ?? '').replace(/[&<>"']/g, (character) => `&#${character.charCodeAt(0)};`);
}

function isObject(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requiredString(object: Record<string, unknown>, field: string, context: string): string {
	const value = object[field];
	if (typeof value !== 'string') {
		throw new Error(`${context}.${field} missing or not a string`);
	}
	return value;
}

function marketSentiment(object: Record<string, unknown>, context: string): ReedDigestItem['market_sentiment'] {
	const value = requiredString(object, 'market_sentiment', context);
	if (value === 'bullish' || value === 'bearish' || value === 'mixed' || value === 'neutral') return value;
	throw new Error(`${context}.market_sentiment is invalid`);
}

function tickerList(object: Record<string, unknown>, context: string): string[] {
	const value = object.tickers;
	if (!Array.isArray(value) || value.some((ticker) => typeof ticker !== 'string')) {
		throw new Error(`${context}.tickers missing or not a string array`);
	}
	return value;
}

function parseDigestItem(raw: unknown, index: number): ReedDigestItem {
	if (!isObject(raw)) {
		throw new Error(`digest.items[${index}] is not an object`);
	}

	const context = `digest.items[${index}]`;
	return {
		headline: requiredString(raw, 'headline', context),
		summary: requiredString(raw, 'summary', context),
		source_name: requiredString(raw, 'source_name', context),
		source_url: requiredString(raw, 'source_url', context),
		published_at: requiredString(raw, 'published_at', context),
		market_sentiment: marketSentiment(raw, context),
		market_relevance: requiredString(raw, 'market_relevance', context),
		tickers: tickerList(raw, context),
	};
}

export function parseDigest(raw: unknown): ReedDigest {
	if (!isObject(raw)) {
		throw new Error('digest is not an object');
	}
	if (!Array.isArray(raw.items)) {
		throw new Error('digest.items is not an array');
	}

	return {
		id: requiredString(raw, 'id', 'digest'),
		source_run_id: requiredString(raw, 'source_run_id', 'digest'),
		market_window: requiredString(raw, 'market_window', 'digest'),
		title: requiredString(raw, 'title', 'digest'),
		summary: requiredString(raw, 'summary', 'digest'),
		published_at: requiredString(raw, 'published_at', 'digest'),
		items: raw.items.map(parseDigestItem),
	};
}

export function parseDigestList(raw: unknown): ReedDigest[] {
	if (!Array.isArray(raw)) {
		throw new Error('digest list is not an array');
	}
	return raw.map(parseDigest);
}

export function createReedApi(fetcher: typeof fetch = fetch): ReedApi {
	async function getJson(path: string): Promise<unknown> {
		const response = await fetcher(`${REED_API_ORIGIN}${path}`, {
			method: 'GET',
			headers: { Accept: 'application/json' },
			credentials: 'omit',
			mode: 'cors',
			cache: 'no-store',
		});
		if (!response.ok) {
			throw new Error(`REED request failed with status ${response.status}`);
		}
		return response.json();
	}

	return {
		async listDigests(): Promise<ReedDigest[]> {
			return parseDigestList(await getJson('/api/digests'));
		},

		async getDigest(id: string): Promise<ReedDigest> {
			return parseDigest(await getJson(`/api/digests/${encodeURIComponent(id)}`));
		},
	};
}
