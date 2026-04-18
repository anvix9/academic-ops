#!/usr/bin/env node
// generate-pdf.mjs — Converts HTML to PDF using Playwright (Chromium)

import { chromium } from 'playwright';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, basename } from 'path';

const args = process.argv.slice(2);

function usage() {
  console.log(`
Usage: node generate-pdf.mjs --input <html-file> --output <pdf-file>

Options:
  --input   Path to HTML file
  --output  Path to output PDF (default: same name with .pdf extension)
  --format  Page format: Letter or A4 (default: Letter)
`);
  process.exit(1);
}

let inputPath = '';
let outputPath = '';
let format = 'Letter';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--input' && args[i + 1]) inputPath = args[++i];
  else if (args[i] === '--output' && args[i + 1]) outputPath = args[++i];
  else if (args[i] === '--format' && args[i + 1]) format = args[++i];
}

if (!inputPath) usage();
if (!outputPath) outputPath = inputPath.replace(/\.html?$/, '.pdf');

if (!existsSync(inputPath)) {
  console.error(`❌ Input file not found: ${inputPath}`);
  process.exit(1);
}

const html = readFileSync(resolve(inputPath), 'utf-8');

async function generatePDF() {
  console.log(`📄 Generating PDF from ${basename(inputPath)}...`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: 'networkidle' });

  // Wait for fonts to load
  await page.waitForTimeout(1000);

  await page.pdf({
    path: resolve(outputPath),
    format,
    margin: {
      top: '0.75in',
      right: '0.75in',
      bottom: '0.75in',
      left: '0.75in'
    },
    printBackground: true,
    displayHeaderFooter: false
  });

  await browser.close();
  console.log(`✅ PDF saved to ${outputPath}`);
}

generatePDF().catch(err => {
  console.error('❌ PDF generation failed:', err.message);
  process.exit(1);
});
