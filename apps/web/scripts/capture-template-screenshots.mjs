/**
 * Capture the screenshots /templates shows for one template: the first
 * screen and the whole page on a desktop, and the whole page on a phone, in
 * light and dark.
 *
 * Prerequisites:
 *   - The template's production build running, for example:
 *       cd templates/portfolio
 *       bun install && bun run build && bun run start -p 3007
 *   - Google Chrome installed, or CHROME_PATH pointing at a Chrome binary
 *
 * Usage:
 *   node apps/web/scripts/capture-template-screenshots.mjs portfolio
 *   TEMPLATE_URL=http://localhost:4000 node apps/web/scripts/capture-template-screenshots.mjs portfolio
 */

import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const slug = process.argv[2];
if (!slug) {
  console.error("Pass the template slug, for example: portfolio");
  process.exit(1);
}

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(packageRoot, "assets/templates", slug);
const url = process.env.TEMPLATE_URL ?? "http://localhost:3007/";

const chromePath = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].find((candidate) => candidate && existsSync(candidate));
if (!chromePath) {
  console.error("Chrome not found. Set CHROME_PATH to a Chrome binary.");
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function openPage(browser, theme, viewport) {
  const page = await browser.newPage();
  page.on("pageerror", (error) => console.error(`[${theme}]`, error.message));
  await page.setViewport(viewport);
  // Reduced motion holds the stickers and marquees still, so every capture
  // comes out the same.
  await page.emulateMediaFeatures([
    { name: "prefers-color-scheme", value: theme },
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await page.goto(url, { waitUntil: "networkidle0", timeout: 120_000 });
  await page.evaluate(() => document.fonts.ready);

  // Sections fade in as they scroll into view, so pass over all of them once.
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  for (let top = 0; top < height; top += 500) {
    await page.evaluate((y) => window.scrollTo(0, y), top);
    await sleep(250);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(1200);
  return page;
}

mkdirSync(outDir, { recursive: true });
const browser = await puppeteer.launch({ executablePath: chromePath });
try {
  for (const theme of ["light", "dark"]) {
    const desktop = await openPage(browser, theme, {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
    });
    await desktop.screenshot({
      path: join(outDir, `card-${theme}.webp`),
      type: "webp",
      quality: 85,
    });
    await desktop.screenshot({
      path: join(outDir, `desktop-${theme}.webp`),
      type: "webp",
      quality: 80,
      fullPage: true,
    });
    await desktop.close();

    // Up to 1.5x, scaled down further when a long page would pass WebP's
    // 16,383px height limit (an over-long capture comes out as an empty file).
    const phone = { width: 390, height: 844, isMobile: true, hasTouch: true };
    const mobile = await openPage(browser, theme, {
      ...phone,
      deviceScaleFactor: 1.5,
    });
    const phoneHeight = await mobile.evaluate(
      () => document.documentElement.scrollHeight,
    );
    const scale = Math.min(1.5, Math.floor((16_000 / phoneHeight) * 100) / 100);
    if (scale < 1.5) {
      await mobile.setViewport({ ...phone, deviceScaleFactor: scale });
      await sleep(500);
    }
    await mobile.screenshot({
      path: join(outDir, `mobile-${theme}.webp`),
      type: "webp",
      quality: 80,
      fullPage: true,
    });
    await mobile.close();
    console.log(`Captured ${slug} in ${theme}`);
  }
} finally {
  await browser.close();
}
