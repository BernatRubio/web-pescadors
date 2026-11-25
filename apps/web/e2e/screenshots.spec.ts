/**
 * Design review screenshots (DESIGN.md → self-critique). Opt-in:
 *   SCREENSHOTS=1 pnpm test:e2e screenshots
 * Images are written to test-results/screenshots/ (gitignored).
 */
import { test } from '@playwright/test';

const PAGES = [
  '/',
  '/noticies/',
  '/calendari/',
  '/resultats/',
  '/galeria/',
  '/patrocinadors/',
  '/contacte/',
];

test.skip(!process.env.SCREENSHOTS, 'Set SCREENSHOTS=1 to capture design review screenshots');

for (const path of PAGES) {
  test(`screenshot ${path}`, async ({ page }, info) => {
    await page.goto(path);
    await page.waitForTimeout(700); // let the hull-band wipe finish
    const name = path === '/' ? 'home' : path.replaceAll('/', '');
    await page.screenshot({
      path: `test-results/screenshots/${info.project.name}-${name}.png`,
      fullPage: true,
    });
  });
}
