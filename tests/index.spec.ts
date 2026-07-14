import { expect, test } from '@playwright/test';

test.describe('portfolio site', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page has correct title and meta', async ({ page }) => {
    await expect(page).toHaveTitle('George Jieh | AI/ML Developer & Researcher');
    const metaDescription = page.locator("meta[name='description']");
    await expect(metaDescription).toHaveAttribute(
      'content',
      'AI/ML developer building production AI systems. AI agent visibility auditing, meaning-grounded language models, and agentic orchestration frameworks.'
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
      await header.getByText('About').click();
      await expect(page).toHaveURL(/#about/);
      await header.getByText('Projects').click();
      await expect(page).toHaveURL(/#projects/);
      await header.getByText('Contact').click();
      await expect(page).toHaveURL(/#contact/);
    }
  });

  test('project cards are rendered', async ({ page }) => {
    const cards = page.getByTestId('card');
    await expect(cards).toHaveCount(2);
  });

  test('contact email is correct', async ({ page }) => {
    const contactLink = page.getByTestId('contact').locator('a[href="mailto:contact@georgejieh.dev"]');
    await expect(contactLink).toBeVisible();
  });
});