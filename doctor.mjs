#!/usr/bin/env node
// doctor.mjs — Validates all prerequisites for Academic-Ops

import { existsSync } from 'fs';
import { execSync } from 'child_process';

const checks = [];

function check(name, fn) {
  try {
    const result = fn();
    checks.push({ name, ok: result.ok, detail: result.detail });
  } catch (e) {
    checks.push({ name, ok: false, detail: e.message });
  }
}

// Node.js version
check('Node.js ≥ 18', () => {
  const version = process.version;
  const major = parseInt(version.slice(1).split('.')[0]);
  return { ok: major >= 18, detail: version };
});

// Playwright
check('Playwright installed', () => {
  try {
    execSync('npx playwright --version', { stdio: 'pipe' });
    return { ok: true, detail: 'installed' };
  } catch {
    return { ok: false, detail: 'Run: npx playwright install chromium' };
  }
});

// CV file
check('cv.md exists', () => {
  const exists = existsSync('cv.md');
  return { ok: exists, detail: exists ? 'found' : 'Create your academic CV in cv.md' };
});

// Profile
check('config/profile.yml exists', () => {
  const exists = existsSync('config/profile.yml');
  return { ok: exists, detail: exists ? 'found' : 'Copy config/profile.example.yml → config/profile.yml' };
});

// Portals
check('portals.yml exists', () => {
  const exists = existsSync('portals.yml');
  return { ok: exists, detail: exists ? 'found' : 'Copy templates/portals.example.yml → portals.yml' };
});

// Data directory
check('data/ directory exists', () => {
  const exists = existsSync('data');
  return { ok: exists, detail: exists ? 'found' : 'Create data/ directory' };
});

// Tracker
check('data/applications.md exists', () => {
  const exists = existsSync('data/applications.md');
  return { ok: exists, detail: exists ? 'found' : 'Will be created on first evaluation' };
});

// Reports directory
check('reports/ directory exists', () => {
  const exists = existsSync('reports');
  return { ok: exists, detail: exists ? 'found' : 'Create reports/ directory' };
});

// Output directory
check('output/ directory exists', () => {
  const exists = existsSync('output');
  return { ok: exists, detail: exists ? 'found' : 'Create output/ directory' };
});

// Optional files
check('publications.md (optional)', () => {
  const exists = existsSync('publications.md');
  return { ok: true, detail: exists ? 'found' : 'optional — add your publication list for richer evaluations' };
});

check('research-statement.md (optional)', () => {
  const exists = existsSync('research-statement.md');
  return { ok: true, detail: exists ? 'found' : 'optional — add your research interests for better matching' };
});

// Print results
console.log('\n🔬 Academic-Ops Doctor\n');
console.log('─'.repeat(60));

let allOk = true;
for (const c of checks) {
  const icon = c.ok ? '✅' : '❌';
  console.log(`${icon}  ${c.name.padEnd(35)} ${c.detail}`);
  if (!c.ok) allOk = false;
}

console.log('─'.repeat(60));

if (allOk) {
  console.log('\n🎉 All checks passed! You\'re ready to go.\n');
  console.log('   Run `claude` and paste a position URL to start.\n');
} else {
  console.log('\n⚠️  Some checks failed. Fix the issues above and run again.\n');
  console.log('   Run `claude` to start the onboarding wizard.\n');
}

process.exit(allOk ? 0 : 1);
