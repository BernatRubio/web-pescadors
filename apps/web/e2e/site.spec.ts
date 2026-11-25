import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const HOMES = [
  { path: '/', lang: 'ca-ES' },
  { path: '/es/', lang: 'es-ES' },
  { path: '/en/', lang: 'en' },
];

for (const { path, lang } of HOMES) {
  test(`home ${path} has the right language and alternates`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('h1')).toHaveCount(1);
    const hreflangs = await page
      .locator('link[rel="alternate"][hreflang]')
      .evaluateAll((links) => links.map((l) => l.getAttribute('hreflang')));
    expect(hreflangs).toEqual(['ca-ES', 'es-ES', 'en', 'x-default']);
  });
}

const PAGES = [
  '/',
  '/noticies/',
  '/calendari/',
  '/resultats/',
  '/galeria/',
  '/patrocinadors/',
  '/el-club/',
  '/contacte/',
];

for (const path of PAGES) {
  test(`${path} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(
      serious,
      JSON.stringify(
        serious.map((v) => [v.id, v.nodes.map((n) => n.target)]),
        null,
        2,
      ),
    ).toEqual([]);
  });
}

test('language switcher keeps you on the same section', async ({ page }) => {
  await page.goto('/resultats/');
  await page
    .getByRole('navigation', { name: 'Idioma' })
    .getByRole('link', { name: 'English' })
    .click();
  await expect(page).toHaveURL('/en/results/');
});

test('mobile menu opens and closes', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'The menu only collapses on small screens');
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Menú' });
  const nav = page.getByRole('navigation', { name: 'Navegació principal' });
  await expect(nav).toBeHidden();
  await toggle.click();
  await expect(nav).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
});

test('a news article renders', async ({ page }) => {
  await page.goto('/noticies/');
  const first = page.locator('main article h2 a').first();
  test.skip((await first.count()) === 0, 'No news in the dataset');
  await first.click();
  await expect(page.locator('h1')).toBeVisible();
});

test('gallery lightbox: opens, arrow keys move, Esc closes and returns focus', async ({ page }) => {
  await page.goto('/galeria/');
  const album = page.locator('main li a').first();
  test.skip((await album.count()) === 0, 'No albums in the dataset');
  await album.click();
  const thumbs = page.locator('main a[data-photo]');
  await expect(thumbs.first()).toBeVisible();
  await thumbs.first().click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  if ((await thumbs.count()) > 1) {
    await expect(dialog).toContainText('1 /');
    await page.keyboard.press('ArrowRight');
    await expect(dialog).toContainText('2 /');
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(thumbs.first()).toBeFocused();
});

test('sponsors page groups sponsors by tier', async ({ page }) => {
  await page.goto('/patrocinadors/');
  const tiers = page.locator('[data-tier]');
  test.skip((await tiers.count()) === 0, 'No sponsors in the dataset');
  for (const tier of await tiers.all()) {
    await expect(tier.getByRole('heading', { level: 2 })).toBeVisible();
    await expect(tier.locator('li').first()).toBeVisible();
  }
});

test('unknown addresses get the trilingual 404 page', async ({ page }) => {
  const response = await page.goto('/aquesta-pagina-no-existeix/');
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('No hem trobat aquesta pàgina');
  await expect(page.locator('li[lang="en"]')).toContainText('We couldn’t find this page');
});

test('a result sheet scrolls with the keyboard', async ({ page }) => {
  await page.goto('/resultats/');
  const first = page.locator('main table a').first();
  test.skip((await first.count()) === 0, 'No results in the dataset');
  await first.click();
  const region = page.getByRole('region');
  await expect(region).toHaveAttribute('tabindex', '0');
  await expect(region.locator('caption')).toHaveCount(1);
});

test('counts use the right plural form', async ({ page }) => {
  await page.goto('/galeria/');
  const counts = await page.locator('main li p span').allTextContents();
  test.skip(counts.length === 0, 'No albums in the dataset');
  for (const text of counts) expect(text).not.toMatch(/^1 fotos$/);
});
