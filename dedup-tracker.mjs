#!/usr/bin/env node
// dedup-tracker.mjs — Removes duplicate entries from applications.md

import { readFileSync, writeFileSync } from 'fs';

const TRACKER_PATH = 'data/applications.md';
const content = readFileSync(TRACKER_PATH, 'utf-8');
const lines = content.split('\n');

const header = [];
const dataRows = [];
const seen = new Set();
let dupes = 0;

for (const line of lines) {
  // Keep header lines (title, column headers, separator)
  if (!line.startsWith('|') || line.includes('---') || line.includes('Lab/PI') || line.includes('# ')) {
    header.push(line);
    continue;
  }

  const cols = line.split('|').map(c => c.trim()).filter(Boolean);
  if (cols.length < 5) {
    header.push(line);
    continue;
  }

  // Key: PI + institution + position
  const key = `${cols[2]}_${cols[3]}_${cols[4]}`.toLowerCase().replace(/\s+/g, '_');

  if (seen.has(key)) {
    dupes++;
    console.log(`🗑️  Removing duplicate: ${cols[2]} @ ${cols[3]} — ${cols[4]}`);
    continue;
  }

  seen.add(key);
  dataRows.push(line);
}

const output = [...header, ...dataRows].join('\n');
writeFileSync(TRACKER_PATH, output);

console.log(`\n📊 Dedup complete: ${dupes} duplicates removed, ${dataRows.length} entries remain.`);
