# Academic-Ops — AI Academic Position Search Pipeline

## Origin

Adapted from [career-ops](https://github.com/santifer/career-ops) by santifer. Career-ops was built for industry job search; **Academic-Ops repurposes the same multi-agent pipeline for academic positions**: lab internships (master's/PhD level), research assistantships, postdoctoral fellowships, and junior faculty positions.

**It works out of the box, but it's designed to be made yours.** If the archetypes don't match your field, the scoring doesn't fit your priorities, or the portals aren't right — just ask. You (Claude) can edit any file in this system.

## What is Academic-Ops

AI-powered academic position search automation built on Claude Code: pipeline tracking, position evaluation, CV/cover letter generation, lab portal scanning, batch processing.

### Main Files

| File | Function |
|------|----------|
| `data/applications.md` | Application tracker |
| `data/pipeline.md` | Inbox of pending URLs |
| `data/scan-history.tsv` | Scanner dedup history |
| `portals.yml` | University & lab portal config (base list) |
| `my-sources.yml` | YOUR personal sources — labs, departments, niche boards, social (user list) |
| `templates/cv-template.html` | HTML template for academic CVs |
| `templates/cover-letter-template.html` | Cover letter template |
| `generate-pdf.mjs` | Puppeteer: HTML to PDF |
| `research-statement.md` | Your research interests & statement (optional) |
| `publications.md` | Your publication list (optional) |
| `data/pi-directory.yml` | Base directory of ~50 NLP/NLU PIs organized by research topic |
| `data/outreach-log.md` | **Anti-spam log** — tracks every professor contacted, prevents double-emailing |
| `reports/` | Evaluation reports (format: `{###}-{lab-slug}-{YYYY-MM-DD}.md`) |

### Scan Priority Order — PROFESSORS FIRST

All scan/auto/outreach operations follow this priority:

```
PRIORITY 1 — PROFESSOR LISTS (highest signal)
  1a. Community spreadsheets (professors self-post openings)
  1b. PI directory matches (topic-matched from data/pi-directory.yml)
  1c. User's watched labs (my-sources.yml)

PRIORITY 2 — PORTALS (aggregated listings)
  2a. AI-specific boards (NeurIPS, ICML, ACL, AI Jobs)
  2b. Academic aggregators (EURAXESS, AcademicJobsOnline)
  2c. Fellowship portals (DAAD, Fulbright, Marie Curie)

PRIORITY 3 — UNIVERSITY POSTINGS
  3a. AI institutes (Mila, Vector, ELLIS, Stanford HAI)
  3b. University career pages
  3c. Department pages
```

### Outreach Dedup — CRITICAL

`data/outreach-log.md` is checked by ALL modes before suggesting or drafting an email:
- **NEVER email a professor already in the log** (unless follow-up is due)
- **Max 2 follow-ups**, then mark `No Response` and stop
- **All modes update the log** when an email is approved by the user

### First Run — Onboarding (IMPORTANT)

**Before doing ANYTHING else, check if the system is set up.** Run these checks silently every time a session starts:

1. Does `cv.md` exist?
2. Does `config/profile.yml` exist (not just profile.example.yml)?
3. Does `portals.yml` exist (not just templates/portals.example.yml)?

**If ANY of these is missing, enter onboarding mode.** Do NOT proceed with evaluations, scans, or any other mode until the basics are in place. Guide the user step by step:

#### Step 1: Academic CV (required)

If `cv.md` is missing, ask:

> "I don't have your academic CV yet. You can either:
> 1. Paste your CV here and I'll convert it to markdown
> 2. Paste your Google Scholar / ORCID / university profile URL
> 3. Tell me about your research experience and I'll draft a CV for you
>
> Which do you prefer?"

Create `cv.md` from whatever they provide. Use standard academic sections: Education, Research Experience, Publications, Teaching, Skills, Awards/Fellowships, References.

#### Step 2: Profile (required)

If `config/profile.yml` is missing, copy from `config/profile.example.yml` and then ask:

> "I need a few details to personalize the system:
> - Your full name and email
> - Your current institution and department
> - Your academic level (Master's student / PhD student / PhD candidate / Postdoc)
> - Your research field and subfields (e.g., 'computational neuroscience, fMRI analysis, brain-computer interfaces')
> - Target position types (lab internship / research assistant / postdoc / visiting researcher)
> - Geographic preferences (countries, regions, or 'anywhere')
> - Preferred start date or timeline
>
> I'll set everything up for you."

Fill in `config/profile.yml` with their answers. Map target fields to archetypes and update `modes/_shared.md` if needed.

#### Step 3: Portals (recommended)

If `portals.yml` is missing:

> "I'll set up the position scanner with pre-configured academic portals. Want me to customize the search for your field?"

Copy `templates/portals.example.yml` → `portals.yml`. If they gave target fields in Step 2, update keywords to match.

Also copy `my-sources.example.yml` → `my-sources.yml` and ask:

> "Do you have any specific labs, PIs, or department pages you'd like me to watch? I can add them to your personal source list. You can always add more later by saying 'add this lab to my sources'."

If they provide labs/URLs, add them to `my-sources.yml`.

#### Step 4: Tracker

If `data/applications.md` doesn't exist, create it:

```
# Applications Tracker

| # | Date | Lab/PI | Institution | Position | Score | Status | PDF | Report | Notes |
|---|------|--------|-------------|----------|-------|--------|-----|--------|-------|
```

#### Step 5: Ready

Once all files exist, confirm:

> "You're all set! There are two ways to use Academic-Ops:
>
> **Option 1 — Auto (hands-free):**
> Run `/academic-ops auto` and I'll scan all portals + your personal sources, filter against your CV, evaluate the best matches, and give you a ranked shortlist. No input needed.
>
> **Option 2 — Manual (one position at a time):**
> Paste a position URL or job description and I'll evaluate it, generate a report, and add it to your tracker.
>
> You can mix both — use auto to discover positions, then paste specific URLs you find on your own.
>
> **Adding sources:** Say 'add [lab/URL] to my sources' anytime to grow your personal watchlist.
>
> **Weekend autopilot:** Say 'schedule auto every Saturday' and I'll scan for you every weekend automatically.
>
> Run `/academic-ops` to see all commands. Everything is customizable — just ask me to change anything."

### Personalization

This system is designed to be customized by YOU (Claude). When the user asks you to change archetypes, translate modes, adjust scoring, add institutions, or modify email templates — do it directly.

**Common customization requests:**
- "Change the archetypes to [biology/CS/physics/humanities] roles" → edit `modes/_shared.md`
- "Translate the modes to [language]" → edit all files in `modes/`
- "Add these universities to my portals" → edit `portals.yml`
- "Add this lab to my sources" → edit `my-sources.yml`
- "Watch this department page" → edit `my-sources.yml`
- "Update my profile" → edit `config/profile.yml`
- "Change the CV template design" → edit `templates/cv-template.html`
- "Adjust the scoring weights" → edit `modes/_shared.md`
- "Schedule auto every Saturday" → set up weekend scheduling (see `modes/auto.md`)

### Skill Modes

| If the user... | Mode |
|----------------|------|
| Says "find positions for me" or "run auto" | `auto` (scan → filter → evaluate → rank — fully hands-free) |
| Pastes position URL or description | auto-pipeline (evaluate + report + PDF + tracker) |
| Says "add [lab/URL] to my sources" | edit `my-sources.yml` directly (no mode file needed) |
| Says "find PIs for my topic" or "who should I email" | `outreach` (match topics → research PIs → draft emails) |
| Says "schedule auto every [day]" | `auto` → scheduling setup |
| Asks to evaluate a position | `evaluate` |
| Asks to compare positions | `compare` |
| Wants to draft a contact email to PI | `contact` |
| Asks for lab/group research | `deep` |
| Wants to generate academic CV PDF | `cv` |
| Wants a cover letter / research statement | `letter` |
| Asks about application status | `tracker` |
| Searches for new positions | `scan` |
| Processes pending URLs | `pipeline` |
| Batch processes positions | `batch` |
| Evaluates a summer school / workshop | `training` |
| Prepares for an interview / lab visit | `interview` |

### CV Source of Truth

- `cv.md` in project root is the canonical academic CV
- `publications.md` has detailed publication list (optional)
- `research-statement.md` has research interests (optional)
- **NEVER hardcode metrics** — read them from these files at evaluation time

---

## Ethical Use — CRITICAL

**This system is designed for quality, not quantity.** The goal is to help the user find positions where there is genuine research alignment — not to spam PIs with mass emails.

- **NEVER submit an application without the user reviewing it first.** Draft emails, generate PDFs, fill forms — but always STOP before clicking Submit/Send. The user makes the final call.
- **Discourage low-fit applications.** If research alignment is below 2.5/5, explicitly tell the user this is a weak match and recommend skipping unless they have a specific reason.
- **Quality over speed.** A well-targeted email to 5 PIs beats a generic blast to 50. Guide the user toward fewer, better applications.
- **Respect PIs' time.** Every email a PI reads costs their attention. Only send what's worth reading.
- **Be honest about fit.** If the user lacks key prerequisites (methods, publications, specific skills), flag it clearly. Better to know now than get rejected.

---

## Position Verification — MANDATORY

**NEVER trust WebSearch/WebFetch to verify if a position is still active.** ALWAYS use Playwright:

1. `browser_navigate` to the URL
2. `browser_snapshot` to read content
3. Check for: closing date passed, "position filled" text, 404 error. Active = description + apply instructions present.

---

## Stack and Conventions

- Node.js (mjs modules), Playwright (PDF + scraping), YAML (config), HTML/CSS (template), Markdown (data)
- Scripts in `.mjs`, configuration in YAML
- Output in `output/` (gitignored), Reports in `reports/`
- Report numbering: sequential 3-digit zero-padded, max existing + 1
- **RULE: After each batch of evaluations, run `node merge-tracker.mjs`** to merge tracker additions and avoid duplications.
- **RULE: NEVER create new entries in applications.md if lab+position already exists.** Update the existing entry.

### TSV Format for Tracker Additions

Write one TSV file per evaluation to `batch/tracker-additions/{num}-{lab-slug}.tsv`. Single line, 10 tab-separated columns:

```
{num}\t{date}\t{PI}\t{institution}\t{position}\t{status}\t{score}/5\t{pdf_emoji}\t[{num}](reports/{num}-{slug}-{date}.md)\t{note}
```

### Canonical States (applications.md)

| State | When to use |
|-------|-------------|
| `Evaluated` | Report completed, pending decision |
| `Emailed` | Contact email sent to PI |
| `Applied` | Formal application submitted |
| `Responded` | PI or admin responded |
| `Interview` | Interview / lab visit scheduled |
| `Offered` | Position offered |
| `Rejected` | Rejected by lab/committee |
| `Discarded` | Discarded by candidate or position closed |
| `SKIP` | Doesn't fit, don't apply |

**RULES:**
- No markdown bold (`**`) in status field
- No dates in status field (use the date column)
- No extra text (use the notes column)
