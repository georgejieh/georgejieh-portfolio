import { expect, test } from '@playwright/test';

test.describe('portfolio site', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page has correct title and meta', async ({ page }) => {
    await expect(page).toHaveTitle('George Jieh | AI/ML Engineer & LLM Evaluation Specialist');
    const metaDescription = page.locator("meta[name='description']");
    await expect(metaDescription).toHaveAttribute(
      'content',
      'AI/ML engineer and LLM evaluation specialist. Former Scale AI Oracle Tier trainer. RLHF training for frontier models, production AI pipelines, and multi-agent orchestration.'
    );
  });

  test('all main sections are visible', async ({ page }) => {
    await expect(page.getByTestId('hero')).toBeVisible();
    await expect(page.getByTestId('about')).toBeVisible();
    await expect(page.getByTestId('focus')).toBeVisible();
    await expect(page.getByTestId('projects')).toBeVisible();
    await expect(page.getByTestId('contact')).toBeVisible();
    await expect(page.getByTestId('footer')).toBeVisible();
  });

  test('navbar links work on desktop', async ({ page, isMobile }) => {
    const header = page.getByTestId('header');
    if (!isMobile) {
      await expect(header).toBeVisible();
      await header.getByRole('link', { name: 'About' }).first().click();
      await expect(page).toHaveURL(/#about/);
      await header.getByRole('link', { name: 'Projects' }).first().click();
      await expect(page).toHaveURL(/#projects/);
      await header.getByRole('link', { name: 'Contact' }).first().click();
      await expect(page).toHaveURL(/#contact/);
    }
  });

  test('project cards are rendered', async ({ page }) => {
    const cards = page.getByTestId('card');
    await expect(cards).toHaveCount(3);
  });

  test('responsive navigation and project disclosures expose usable states', async ({ page, isMobile }) => {
    if (isMobile) {
      const mobileMenu = page.locator('.home-nav__mobile');
      await mobileMenu.locator('summary').click();
      await expect(mobileMenu).toHaveAttribute('open', '');
      await expect(mobileMenu.getByRole('link', { name: 'Projects' })).toBeVisible();
    }

    const secondProject = page.getByTestId('project-disclosure').nth(1);
    await expect(secondProject).not.toHaveAttribute('open', '');
    await secondProject.locator('summary').click();
    await expect(secondProject).toHaveAttribute('open', '');
    await expect(secondProject.getByText('Visit project')).toBeVisible();
  });

  test('homepage uses the broadcast portfolio surface without terminal motifs', async ({ page }) => {
    await expect(page.locator('body')).toHaveAttribute('data-surface', 'portfolio-home');
    await expect(page.locator('.grid-bg')).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('George Jieh');
    await expect(page.getByRole('link', { name: 'Explore selected work' })).toBeVisible();
    await expect(page.getByTestId('project-disclosure')).toHaveCount(3);
  });

  test('homepage reflows at 320px without page-level overflow', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await expect(page.getByTestId('hero')).toBeVisible();

    const hasPageOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );

    expect(hasPageOverflow).toBe(false);
  });

  test('reduced motion disables decorative homepage animation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();

    const animatedElementCount = await page.locator('[data-home-motion]').evaluateAll((elements) =>
      elements.filter((element) => getComputedStyle(element).animationName !== 'none').length
    );

    expect(animatedElementCount).toBe(0);
  });

  test('contact email is correct', async ({ page }) => {
    const contactLink = page.getByTestId('contact').locator('a[href="mailto:contact@georgejieh.dev"]');
    await expect(contactLink).toBeVisible();
  });
});