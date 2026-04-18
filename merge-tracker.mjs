#!/usr/bin/env node
// merge-tracker.mjs — Merges TSV additions into applications.md
// Reads batch/tracker-additions/*.tsv and appends new entries to data/applications.md

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, renameSync } from 'fs';
import { join } from 'path';

const TRACKER_PATH = 'data/applications.md';
const ADDITIONS_DIR = 'batch/tracker-additions';
const ARCHIVE_DIR = 'batch/tracker-additions/merged';

if (!existsSync(ADDITIONS_DIR)) {
  console.log('No tracker-additions directory found. Nothing to merge.');
  process.exit(0);
}

const tsvFiles = readdirSync(ADDITIONS_DIR).filter(f => f.endsWith('.tsv'));
if (tsvFiles.length === 0) {
  console.log('No TSV files to merge.');
  process.exit(0);
}

// Read current tracker
let tracker = readFileSync(TRACKER_PATH, 'utf-8');

// Parse existing entries to check for duplicates
const existingEntries = new Set();
const lines = tracker.split('\n');
for (const line of lines) {
  if (line.startsWith('|') && !line.includes('---') && !line.includes('Lab/PI')) {
    const cols = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cols.length >= 4) {
      // Key: lab + institution + position (normalized)
      const key = `${cols[2]}_${cols[3]}_${cols[4]}`.toLowerCase().replace(/\s+/g, '_');
      existingEntries.add(key);
    }
  }
}

let added = 0;
let skipped = 0;

for (const file of tsvFiles.sort()) {
  const content = readFileSync(join(ADDITIONS_DIR, file), 'utf-8').trim();
  if (!content) continue;

  const cols = content.split('\t');
  if (cols.length < 9) {
    console.warn(`⚠️  Skipping ${file}: expected ≥9 columns, got ${cols.length}`);
    skipped++;
    continue;
  }

  // TSV order: num, date, PI, institution, position, status, score, pdf, report, notes
  // Tracker order: #, Date, Lab/PI, Institution, Position, Score, Status, PDF, Report, Notes
  const [num, date, pi, institution, position, status, score, pdf, report, ...notesParts] = cols;
  const notes = notesParts.join(' ');

  // Check for duplicate
  const key = `${pi}_${institution}_${position}`.toLowerCase().replace(/\s+/g, '_');
  if (existingEntries.has(key)) {
    console.log(`⏭️  Skipping duplicate: ${pi} @ ${institution} — ${position}`);
    skipped++;
    continue;
  }

  // Note: In applications.md, score comes BEFORE status
  const row = `| ${num} | ${date} | ${pi} | ${institution} | ${position} | ${score} | ${status} | ${pdf} | ${report} | ${notes} |`;
  tracker = tracker.trimEnd() + '\n' + row;
  existingEntries.add(key);
  added++;
}

writeFileSync(TRACKER_PATH, tracker + '\n');

// Archive merged files
if (!existsSync(ARCHIVE_DIR)) {
  mkdirSync(ARCHIVE_DIR, { recursive: true });
}
for (const file of tsvFiles) {
  renameSync(join(ADDITIONS_DIR, file), join(ARCHIVE_DIR, file));
}

console.log(`\n📊 Merge complete: ${added} added, ${skipped} skipped.`);
if (added > 0) {
  console.log(`   TSV files archived to ${ARCHIVE_DIR}`);
}
