import { expect, test } from '@playwright/test';
import { REED_API_ORIGIN } from '../src/lib/reed';


test.describe('portfolio demo surfaces', () => {
  test('oversized demo headings keep optical space inside split panels', async ({ page }) => {
    for (const demo of [
      {
        route: '/machineread',
        heading: '.command-copy h1',
        panel: '.command-copy',
        widths: [981, 1264, 1440],
      },
      {
        route: '/reed',
        heading: '.reed-intro__copy h1',
        panel: '.reed-intro__copy',
        widths: [861, 1264, 1440],
      },
    ]) {
      for (const width of demo.widths) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(demo.route);

        const spacing = await page.locator(demo.heading).evaluate((heading, panelSelector) => {
          const panel = document.querySelector(panelSelector);
          if (!(panel instanceof HTMLElement)) throw new Error(`Missing panel: ${panelSelector}`);

          const range = document.createRange();
          range.selectNodeContents(heading);

          const panelStyles = getComputedStyle(panel);
          const contentRight = panel.getBoundingClientRect().right - parseFloat(panelStyles.paddingRight);
          const lineRight = Math.max(...Array.from(range.getClientRects(), (rect) => rect.right));
          const fontSize = parseFloat(getComputedStyle(heading).fontSize);

          return { available: contentRight - lineRight, minimum: fontSize * 0.8 };
        }, demo.panel);

        expect(
          spacing.available,
          `${demo.route} heading needs a full-glyph gutter at ${width}px`
        ).toBeGreaterThanOrEqual(spacing.minimum);
      }
    }
  });

  test('MachineRead keeps the live audit inside the broadcast portfolio world', async ({ page }) => {
    await page.goto('/machineread');

    await expect(page.locator('body')).toHaveAttribute('data-surface', 'portfolio-demo');
    await expect(page.locator('[data-program="machineread"]')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /Audit any public site the way machines read it/i })
    ).toBeVisible();
    await expect(page.getByRole('form')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Run Audit' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'machineread.ai' })).toHaveAttribute(
      'href',
      'https://machineread.ai'
    );
  });

  test('REED keeps published market briefs inside the broadcast portfolio world', async ({ page }) => {
    await page.route(`${REED_API_ORIGIN}/api/digests`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify([
          {
            id: 'digest-2026-08-15-close',
            source_run_id: 'run-2026-08-15-close',
            market_window: 'US close',
            title: 'The closing market brief',
            summary: 'A sourced summary of the completed market window.',
            published_at: '2026-08-15T21:15:00Z',
            items: [
              {
                headline: 'Markets complete the session',
                summary: 'Public reporting described the final trading hour.',
                source_name: 'Example source',
                source_url: 'https://example.com/market',
                published_at: '2026-08-15T21:00:00Z',
                market_sentiment: 'neutral',
                market_relevance: 'The close establishes the next session reference point.',
                tickers: [],
              },
            ],
          },
        ]),
      })
    );

    await page.goto('/reed');

    await expect(page.locator('body')).toHaveAttribute('data-surface', 'portfolio-demo');
    await expect(page.locator('[data-program="reed"]')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'REED market briefs' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'The closing market brief' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Portfolio \/ Selected work/i })).toBeVisible();
  });
});
