import { expect, test } from '@playwright/test';
import { REED_API_ORIGIN, createReedApi, parseDigest, parseDigestList } from '../src/lib/reed';

const latestDigest = {
	id: 'digest-2026-07-28-close',
	source_run_id: 'run-2026-07-28-close',
	market_window: 'US close',
	title: 'Megacap earnings lead the close',
	summary: 'Market coverage centered on earnings and policy headlines.',
	published_at: '2026-07-28T21:15:00Z',
	items: [
		{
			headline: 'Earnings reports shape the afternoon',
			summary: 'Large technology companies led the final hours of trading coverage.',
			source_name: 'Reuters',
			source_url: 'https://www.reuters.com/markets/example',
			published_at: '2026-07-28T20:45:00Z',
			market_sentiment: 'bullish',
			market_relevance: 'Points to stronger earnings support for large technology shares.',
			tickers: ['MSFT'],
		},
	],
};

const historicDigest = {
	id: 'digest-2026-07-28-open',
	source_run_id: 'run-2026-07-28-open',
	market_window: 'US open',
	title: 'Policy headlines set the opening tone',
	summary: 'The morning brief tracks public market-news reporting.',
	published_at: '2026-07-28T14:30:00Z',
	items: [
		{
			headline: 'Investors review the latest policy remarks',
			summary: 'News coverage focused on the policy outlook at the open.',
			source_name: 'Associated Press',
			source_url: 'https://apnews.com/article/example',
			published_at: '2026-07-28T14:10:00Z',
			market_sentiment: 'neutral',
			market_relevance: 'May shape expectations for policy-sensitive sectors.',
			tickers: [],
		},
	],
};

test.describe('REED Route-B adapter', () => {
	test('parses the exact public digest contract', () => {
		expect(parseDigest(latestDigest)).toEqual(latestDigest);
		expect(parseDigestList([latestDigest, historicDigest])).toEqual([latestDigest, historicDigest]);
	});

	test('rejects legacy market fields and incomplete source items', () => {
		expect(() =>
			parseDigest({
				session: 'close',
				headline: 'Legacy digest',
				executive_summary: 'Legacy summary',
				market_snapshot: { SPX: 'invented' },
				stories: [],
			})
		).toThrow(/digest/);

		expect(() =>
			parseDigest({
				...latestDigest,
				items: [{ ...latestDigest.items[0], source_url: undefined }],
			})
		).toThrow(/source_url/);
	});

	test('uses only anonymous GET requests on the production origin', async () => {
		const requests: Array<{ url: string; init?: RequestInit }> = [];
		const fetchStub: typeof fetch = async (input, init) => {
			requests.push({ url: String(input), init });
			const body = String(input).endsWith('/api/digests')
				? [latestDigest]
				: String(input).includes('/api/digests/')
					? latestDigest
					: { status: 'ok' };
			return new Response(JSON.stringify(body), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		};

		const api = createReedApi(fetchStub);
		await api.listDigests();
		await api.getDigest('digest/with spaces');

		expect(requests.map(({ url }) => url)).toEqual([
			`${REED_API_ORIGIN}/api/digests`,
			`${REED_API_ORIGIN}/api/digests/digest%2Fwith%20spaces`,
		]);
		for (const request of requests) {
			expect(request.url.startsWith(REED_API_ORIGIN)).toBe(true);
			expect(request.init?.method).toBe('GET');
			expect(request.init?.credentials).toBe('omit');
			expect(request.init?.body).toBeUndefined();
			expect(new Headers(request.init?.headers).get('Authorization')).toBeNull();
			expect(new Headers(request.init?.headers).get('Accept')).toBe('application/json');
		}
	});
});

test.describe('REED reader page', () => {
	test('shows loading, then the latest published digest and historic digests', async ({ page }) => {
		let releaseResponse: (() => void) | undefined;
		const responseGate = new Promise<void>((resolve) => {
			releaseResponse = resolve;
		});
		const requests: string[] = [];

		await page.route(`${REED_API_ORIGIN}/api/**`, async (route) => {
			requests.push(`${route.request().method()} ${route.request().url()}`);
			await responseGate;
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				headers: { 'Access-Control-Allow-Origin': '*' },
				body: JSON.stringify([latestDigest, historicDigest]),
			});
		});

		await page.goto('/reed');
		const reader = page.getByLabel('Brief reader');
		await expect(reader.getByRole('status')).toContainText('Loading');
		releaseResponse?.();

		await expect(reader).toHaveAttribute('aria-busy', 'false');
		await expect(reader.getByRole('heading', { name: latestDigest.title })).toBeVisible();
		await expect(reader).toContainText('Latest successful published digest');
		await expect(
			reader.getByRole('link', { name: latestDigest.items[0].source_name })
		).toHaveAttribute('href', latestDigest.items[0].source_url);
		await expect(reader).toContainText('bullish implication');
		await expect(reader).toContainText('MSFT');
		await expect(reader).toContainText(latestDigest.items[0].market_relevance);
		await expect(page.getByText(historicDigest.title)).toBeVisible();
		await page.getByRole('button', { name: new RegExp(historicDigest.title) }).click();
		await expect(reader.getByRole('heading', { name: historicDigest.title })).toBeVisible();
		await expect(reader).toContainText('Historic digest');

		expect(requests).toEqual([`GET ${REED_API_ORIGIN}/api/digests`]);
		await expect(reader).toContainText('neutral implication');
		await expect(reader).toContainText(historicDigest.items[0].market_relevance);
	});

	test('shows the honest empty state when no brief has been published', async ({ page }) => {
		await page.route(`${REED_API_ORIGIN}/api/digests`, (route) =>
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				headers: { 'Access-Control-Allow-Origin': '*' },
				body: '[]',
			})
		);

		await page.goto('/reed');
		await expect(page.getByRole('status')).toHaveText('No published brief yet.');
		await expect(page.getByLabel('Brief reader')).toHaveAttribute('aria-busy', 'false');
	});

	test('shows unavailable with a working retry', async ({ page }) => {
		let attempts = 0;
		await page.route(`${REED_API_ORIGIN}/api/digests`, (route) => {
			attempts += 1;
			return route.fulfill({
				status: attempts === 1 ? 503 : 200,
				contentType: 'application/json',
				headers: { 'Access-Control-Allow-Origin': '*' },
				body: attempts === 1 ? '{}' : JSON.stringify([latestDigest]),
			});
		});

		await page.goto('/reed');
		const alert = page.getByRole('alert');
		await expect(alert).toContainText('REED is unavailable.');
		await page.getByRole('button', { name: 'Retry' }).click();
		await expect(page.getByRole('heading', { name: latestDigest.title })).toBeVisible();
		expect(attempts).toBe(2);
	});
});
