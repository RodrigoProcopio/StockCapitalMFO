import { chromium } from "@playwright/test";
import fs from "node:fs";

const outPath = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:5183/fundo-de-investimento", { waitUntil: "networkidle" });
await page.waitForSelector("#visao-geral", { timeout: 10000 }).catch(() => {});
await page.waitForTimeout(800);
await page.screenshot({ path: outPath, fullPage: false });
await browser.close();
console.log("saved:", outPath, fs.statSync(outPath).size, "bytes");
