#!/usr/bin/env node
// verify-pipeline.mjs — Health checks for the Academic-Ops pipeline

import { readFileSync, existsSync, readdirSync } from 'fs';
import YAML from 'yaml';

const issues = [];
const warnings = [];

function issue(msg) { issues.push(msg); }
function warn(msg) { warnings.push(msg); }

// 1. Check tracker exists and is valid
if (!existsSync('data/applications.md')) {
  issue('data/applications.md not found');
} else {
  const tracker = readFileSync('data/applications.md', 'utf-8');
  const lines = tracker.split('\n').filter(l => l.startsWith('|') && !l.includes('---') && !l.includes('Lab/PI'));

  // Load valid states
  let validStates = [];
  if (existsSync('templates/states.yml')) {
    const states = YAML.parse(readFileSync('templates/states.yml', 'utf-8'));
    validStates = states.states.map(s => s.name);
  }

  for (const line of lines) {
    const cols = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cols.length < 8) {
      issue(`Row has ${cols.length} columns (expected ≥8): ${line.slice(0, 80)}`);
      continue;
    }

    // Check status is valid
    const status = cols[6]; // status column
    if (validStates.length > 0 && !validStates.includes(status)) {
      issue(`Invalid status "${status}" in row ${cols[0]}. Valid: ${validStates.join(', ')}`);
    }

    // Check for bold in status
    if (status.includes('**')) {
      issue(`Status has markdown bold in row ${cols[0]}: "${status}"`);
    }

    // Check score format
    const score = cols[5];
    if (score && !score.match(/^\d\.\d\/5$/)) {
      warn(`Unusual score format in row ${cols[0]}: "${score}" (expected X.X/5)`);
    }

    // Check report link
    const report = cols[8];
    if (report && report.includes('reports/')) {
      const match = report.match(/reports\/[^\)]+/);
      if (match && !existsSync(match[0])) {
        warn(`Report file not found for row ${cols[0]}: ${match[0]}`);
      }
    }
  }

  console.log(`📊 Tracker: ${lines.length} entries`);
}

// 2. Check reports have required fields
if (existsSync('reports')) {
  const reports = readdirSync('reports').filter(f => f.endsWith('.md'));
  for (const report of reports) {
    const content = readFileSync(`reports/${report}`, 'utf-8');
    if (!content.includes('**URL:**')) {
      warn(`Report ${report} missing **URL:** field`);
    }
    if (!content.includes('**Score:**')) {
      warn(`Report ${report} missing **Score:** field`);
    }
  }
  console.log(`📝 Reports: ${reports.length} files`);
}

// 3. Check for orphaned files
if (existsSync('batch/tracker-additions')) {
  const pending = readdirSync('batch/tracker-additions').filter(f => f.endsWith('.tsv'));
  if (pending.length > 0) {
    warn(`${pending.length} unmerged TSV files in batch/tracker-additions/. Run: node merge-tracker.mjs`);
  }
}

// Print results
console.log('\n🔬 Pipeline Verification\n');
console.log('─'.repeat(60));

if (issues.length === 0 && warnings.length === 0) {
  console.log('✅ All checks passed!');
} else {
  for (const i of issues) {
    console.log(`❌ ${i}`);
  }
  for (const w of warnings) {
    console.log(`⚠️  ${w}`);
  }
}

console.log('─'.repeat(60));
console.log(`\n${issues.length} issues, ${warnings.length} warnings\n`);

process.exit(issues.length > 0 ? 1 : 0);
