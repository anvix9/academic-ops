# Mode: Auto — Full Automated Pipeline (Scan → Filter → Evaluate → Rank)

**Trigger:** User says "run auto", "find positions for me", "auto search", "scan and evaluate", or `/academic-ops auto`

## What This Does

Runs the ENTIRE pipeline hands-free:
1. Merges **base portals** (`portals.yml`) + **your personal sources** (`my-sources.yml`)
2. Scans everything
3. Pre-filters positions against your CV
4. Evaluates top matches in batch
5. Ranks results and presents a shortlist

**No manual steps.** Paste nothing. Just run it.

---

## Source Merging: Base + User

Auto mode always scans TWO source lists:

| File | What it contains | Who manages it |
|------|------------------|----------------|
| `portals.yml` | Base portals — aggregators, fellowships, university pages | Ships with the project, updated by maintainer |
| `my-sources.yml` | YOUR personal sources — labs, departments, niche boards, social, custom URLs | You add sources here (or ask Claude to) |

**Merge rules:**
- Both files are loaded and combined. Dedup by URL.
- If a source appears in both, `my-sources.yml` wins (user overrides base).
- If `my-sources.yml` doesn't exist, auto runs with base portals only.

**Adding sources is easy:**
- "Add Dr. Smith's lab to my sources" → Claude edits `my-sources.yml`
- "Watch the MPI jobs page" → Claude adds it to `my-sources.yml` departments
- "Track @ProfNLP on Twitter for openings" → Claude adds to social_accounts
- "Add this Google Sheet of postdoc listings" → Claude adds to custom

The user NEVER needs to edit YAML manually — just tell Claude what to add.

---

## Workflow

### Step 1: Load Your Profile (silent)

Read these files to build a candidate fingerprint:
- `cv.md` — extract: research topics, methods, tools, publication venues, degree level
- `config/profile.yml` — extract: target position types, geographic preferences, field, subfields
- `publications.md` (if exists) — extract: co-authors, venues, keywords
- `research-statement.md` (if exists) — extract: future directions, target problems

Build a **match vector** from these:
```
{
  field: "computer science",
  subfields: ["NLP", "efficient transformers", "long-context models"],
  methods: ["attention mechanisms", "distillation", "PyTorch", "HPC"],
  level: "PhD candidate",
  target_positions: ["postdoc", "research internship"],
  regions: ["USA", "Europe"],
  min_score_threshold: 3.0,
  publications_venues: ["ACL", "EMNLP", "ICLR"],
  keywords_from_papers: ["sparse attention", "document understanding", "cross-lingual"]
}
```

### Step 2: Merge & Scan All Sources

**2a. Load source lists:**
- Read `data/pi-directory.yml` → base PI directory (~50 professors with topics)
- Read `portals.yml` → base portals (community sheets, aggregators, fellowships, universities, AI labs)
- Read `my-sources.yml` → user sources (labs, departments, niche boards, social, custom)
- Read `data/outreach-log.md` → which professors have already been contacted (DEDUP)
- Merge into a single scan queue, deduplicated by URL

**2b. Prioritize scan order — PROFESSORS FIRST:**

```
PRIORITY 1 — PROFESSOR LISTS (highest signal, self-posted openings)
  ├── 1a. Community spreadsheets (PhD/RA/Interns Opening 2026, etc.)
  ├── 1b. PI directory matches (data/pi-directory.yml matched to your topics)
  └── 1c. User's watched labs (my-sources.yml → labs with priority: high)

PRIORITY 2 — PORTALS (aggregated listings)
  ├── 2a. AI-specific boards (NeurIPS, ICML, ACL job boards, AI Jobs)
  ├── 2b. Academic aggregators (EURAXESS, AcademicJobsOnline, Nature Careers)
  └── 2c. Fellowship portals (DAAD, Fulbright, Marie Curie)

PRIORITY 3 — UNIVERSITY POSTINGS (institutional career pages)
  ├── 3a. AI institutes (Mila, Vector, ELLIS, Stanford HAI, BAIR)
  ├── 3b. University career pages (MIT, Stanford, ETH, Oxford, etc.)
  └── 3c. Department-specific pages (from my-sources.yml)

PRIORITY 4 — SUPPLEMENTARY
  ├── 4a. User's niche boards and custom URLs
  ├── 4b. Social accounts (WebSearch)
  └── 4c. Seasonal sources (only if active month)
```

**Why professors first?**
- Community sheets: professors SELF-POST → confirmed open, highest signal
- PI directory: topic-matched → saves time evaluating irrelevant positions
- Watched labs: user specifically asked to track these → high intent

**2b-special. Community spreadsheet parsing:**
For Google Sheets sources (type: `community_sheet`):
1. Download as CSV via the `csv_url` (append `/export?format=csv&gid=0` to sheet URL)
2. Parse columns: professor name, institution, research area, position type, link, deadline
3. Match against user's research topics and target position types
4. These are SELF-POSTED by professors → very high signal, treat as priority leads
5. Cross-reference with PI directory — if a matched PI is already in `data/pi-directory.yml`, enrich with that data
6. **DEDUP against outreach log** — skip professors already contacted

### Step 2c: Outreach Dedup Check

Before evaluating or suggesting ANY professor, check `data/outreach-log.md`:
- If professor was emailed < 30 days ago → SKIP (already contacted)
- If professor was emailed > 30 days ago AND no response → flag for follow-up, don't re-send initial email
- If professor responded (any status: Responded/Interview/Rejected) → SKIP entirely
- NEVER suggest emailing the same professor twice in the same run

**2c. For each source:**

| Source type | Scan method |
|-------------|-------------|
| Community spreadsheets | Download CSV export → parse rows → match topics (HIGHEST priority) |
| Aggregator portals | Playwright → apply keyword filters → extract listings |
| University career pages | Playwright → search by field → extract listings |
| Lab openings pages | Playwright → snapshot → check for new postings |
| Department pages | Playwright → search → extract listings |
| Niche boards | Playwright → browse → extract listings |
| Social accounts | WebSearch: `"@handle" postdoc OR "research assistant" OR hiring site:twitter.com` |
| Custom URLs | Playwright → snapshot → extract any position-like content |

**2d. Deduplicate** against `data/scan-history.tsv`

**2e. Alert keywords:** Also run WebSearch for each keyword in `my-sources.yml` → `alert_keywords` to catch positions on non-configured sites.

### Step 3: Pre-Filter (fast, no deep research)

For each new position found, run a **quick relevance score** (0-10) based on text matching only — no web research yet. This is cheap and fast.

**Quick relevance scoring:**
| Signal | Points |
|--------|--------|
| Title contains target position type | +2 |
| Description mentions user's subfield keywords | +2 per match (max 4) |
| Description mentions user's methods/tools | +1 per match (max 3) |
| Institution is in preferred region | +1 |
| Level requirement matches user's level | +1 |
| Deadline is ≥ 14 days away | +1 |
| Source is user's `my-sources.yml` (they specifically asked to watch this) | +1 bonus |
| **Disqualifiers** | |
| Level mismatch (e.g., faculty when seeking postdoc) | → SKIP |
| Wrong field entirely | → SKIP |
| Deadline passed | → SKIP |
| Region excluded in profile | → SKIP |

**Thresholds:**
- Score ≥ 6 → **Queue for full evaluation**
- Score 4-5 → **Add to pipeline as "Review"** (user can decide)
- Score < 4 → **Skip** (log in scan history, don't evaluate)

### Step 4: Batch Evaluate Top Matches

Take all positions with quick-score ≥ 6 and run full evaluation (`modes/evaluate.md`) on each:

- If ≤ 5 positions: evaluate sequentially in this session
- If 6-15 positions: use batch mode with `claude -p` sub-agents
- If > 15 positions: evaluate top 15 by quick-score, add rest to pipeline

Each evaluation:
1. Verify position is still active (Playwright)
2. Research the PI (WebSearch — Google Scholar, lab page)
3. Score all 10 dimensions
4. Generate 6-Block report
5. Save report to `reports/`
6. Write TSV to `batch/tracker-additions/`

After all evaluations: `node merge-tracker.mjs`

### Step 5: Rank and Present

Sort evaluated positions by weighted score (descending). Present:

```
🔬 Academic-Ops Auto-Pipeline Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📡 Sources scanned:
   Base portals:    12 (from portals.yml)
   Your sources:     8 (from my-sources.yml)
   Total:           20

📋 Found: 47 new positions
🔍 Pre-filtered: 18 relevant (29 skipped)
📊 Evaluated: 11 positions
⏳ Added to pipeline: 7 (for your review)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟢 TOP MATCHES (score ≥ 4.0)

  1. Dr. Manning's lab — Stanford — Postdoc in Efficient NLP
     Score: 4.3/5 (B+) | Deadline: May 15
     Source: 📌 my-sources.yml (lab you're watching)
     Why: Core thesis alignment, top venue, strong alumni network
     → Report: reports/012-stanford-nlp-2026-04-13.md

  2. Dr. Chen — Oxford — Research Associate in Long-Context Models
     Score: 4.1/5 (B) | Deadline: Jun 1
     Source: EURAXESS (base portal)
     Why: Methods match, growing group, funded position
     → Report: reports/013-oxford-cs-2026-04-13.md

🟡 WORTH CONSIDERING (score 3.0–3.9)

  3. Dr. Müller — ETH Zürich — Postdoc in Multilingual NLP
     Score: 3.7/5 (B-) | Deadline: May 30
     → Report: reports/014-eth-nlp-2026-04-13.md

  [... more ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📬 RECOMMENDED NEXT STEPS:
  1. Apply to Stanford (#1) — deadline in 32 days
  2. Email Dr. Chen at Oxford (#2) — cold outreach recommended
  3. Review 7 pipeline positions: /academic-ops tracker

Want me to generate CVs and cover letters for the top 2?
```

---

## Weekend Scheduling

### Setup: `/academic-ops schedule`

When the user says "run auto every weekend", "schedule weekly scan", or `/academic-ops schedule`:

**Ask for preferences:**
> "I'll set up automatic scanning. A few options:
> 1. **Every Saturday morning** (most common — new week starts with fresh results)
> 2. **Every Sunday evening** (review results Monday morning)
> 3. **Custom** (pick day and time)
>
> Each run scans all your sources (base + personal), evaluates new matches, and saves a summary report.
> You'll see the results next time you open Claude Code."

**Generate the scheduler script** at `academic-ops-scheduled.sh`:

```bash
#!/bin/bash
# academic-ops-scheduled.sh — Automated weekend scan
# Generated by /academic-ops schedule

ACADEMIC_OPS_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="$ACADEMIC_OPS_DIR/data/auto-runs"
TIMESTAMP=$(date +%Y-%m-%d_%H%M)
LOG_FILE="$LOG_DIR/run-$TIMESTAMP.md"

mkdir -p "$LOG_DIR"

echo "# Auto-Run: $TIMESTAMP" > "$LOG_FILE"
echo "" >> "$LOG_FILE"
echo "Started: $(date)" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

cd "$ACADEMIC_OPS_DIR"

# Run the auto pipeline via Claude Code
claude -p "Run /academic-ops auto in scheduled mode. \
  Be thorough but don't ask questions — just scan, evaluate, and save results. \
  At the end, append a summary to $LOG_FILE with: \
  - Number of sources scanned (base + user) \
  - New positions found \
  - Positions evaluated \
  - Top 5 matches with scores \
  - Any new positions from my-sources.yml labs \
  - Diff vs last run"

echo "" >> "$LOG_FILE"
echo "Finished: $(date)" >> "$LOG_FILE"
```

**Install the schedule:**

Option A — cron (Linux/Mac):
```bash
# Every Saturday at 8:00 AM
0 8 * * 6 /path/to/academic-ops/academic-ops-scheduled.sh

# Every Sunday at 20:00
0 20 * * 0 /path/to/academic-ops/academic-ops-scheduled.sh
```

Option B — launchd (macOS):
```xml
<!-- ~/Library/LaunchAgents/com.academic-ops.weekly.plist -->
<plist version="1.0">
<dict>
  <key>Label</key><string>com.academic-ops.weekly</string>
  <key>ProgramArguments</key>
  <array>
    <string>/path/to/academic-ops/academic-ops-scheduled.sh</string>
  </array>
  <key>StartCalendarInterval</key>
  <dict>
    <key>Weekday</key><integer>6</integer>
    <key>Hour</key><integer>8</integer>
    <key>Minute</key><integer>0</integer>
  </dict>
</dict>
</plist>
```

Option C — Claude Code `/loop` (if available):
```
/loop every saturday at 8am: /academic-ops auto
```

### Run Logs

Every auto-run (manual or scheduled) creates a log in `data/auto-runs/`:

```
data/auto-runs/
├── run-2026-04-13_0800.md
├── run-2026-04-20_0800.md
├── run-2026-04-27_0800.md
└── ...
```

Each log contains:
- Timestamp, duration
- Sources scanned (base count + user count)
- Positions found, filtered, evaluated
- Top matches with scores
- **Diff vs. last run:** new positions, closed positions, score changes
- Errors or failed scans

### Weekly Diff Report

When the user opens Claude Code after a scheduled run, auto-detect pending logs and show:

```
📬 Weekend Scan Results (Saturday, April 13)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆕 NEW since last run:
  • Dr. Lee — MIT — Postdoc in Multimodal Learning (4.2/5) ← NEW
  • Dr. Patel — UCL — Research Associate in NLP (3.8/5) ← NEW

📌 FROM YOUR WATCHLIST (my-sources.yml):
  • Manning Lab (Stanford) — no new postings
  • Mila (Montréal) — 1 new PhD internship posted ← NEW

⏰ DEADLINES APPROACHING:
  • Dr. Chen — Oxford — 18 days left
  • ERC postdoc call — 12 days left

🚫 CLOSED SINCE LAST RUN:
  • Dr. Kim — KAIST — position filled

📊 Pipeline: 24 total | 3 applied | 2 interviews | 15 evaluated
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Want to review the new matches?
```

---

## Configuration

Users can tune the auto pipeline in `config/profile.yml`:

```yaml
auto:
  max_evaluations_per_run: 15      # cap on full evaluations per run
  min_quick_score: 6               # threshold for full evaluation
  min_final_score: 3.0             # don't bother reporting below this
  scan_sources: all                # "all" | "base_only" | "user_only" | [list of names]
  auto_generate_cv: false          # auto-generate tailored CVs for top 3?
  auto_draft_emails: false         # auto-draft PI emails for top 3?

schedule:
  enabled: false                   # set to true to activate
  day: "saturday"                  # monday | tuesday | ... | sunday
  time: "08:00"                    # 24h format, local time
  notify: true                     # show diff summary on next Claude Code session
  log_retention_days: 90           # auto-delete logs older than this
```

---

## Safety Guardrails

- **Never auto-apply.** Auto mode evaluates and recommends — it NEVER submits applications or sends emails without user confirmation.
- **Rate limiting.** Max 3 Playwright navigations per minute to avoid being blocked by university sites.
- **Dedup.** Positions already in the tracker are never re-evaluated.
- **Transparency.** Every step is logged. The user can see exactly what was scanned, filtered, and skipped.
- **User sources are sacred.** Auto mode never removes entries from `my-sources.yml`. It only adds (when the user asks) or reads.
