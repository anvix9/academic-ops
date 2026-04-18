# Academic-Ops

**AI-powered academic position search system built on Claude Code.**

*Adapted from [career-ops](https://github.com/santifer/career-ops) for the academic world.*

> Researchers deserve AI to **find the right labs and opportunities.**

---

## What Is This

Academic-Ops turns Claude Code into a full academic position search command center. Instead of manually browsing 20 university job boards and keeping a messy spreadsheet, you get an AI-powered pipeline that:

- **Evaluates positions** with a structured 10-dimension scoring system (research alignment, PI reputation, career impact, etc.)
- **Generates tailored academic CVs and cover letters** customised per position
- **Scans portals** automatically (EURAXESS, AcademicJobsOnline, university career pages, lab websites)
- **Researches PIs and labs** — publication analysis, alumni tracking, mentoring signals
- **Processes in batch** — evaluate 10+ positions in parallel with sub-agents
- **Tracks everything** in a single source of truth

### Who It's For

- **Master's students** looking for lab internships or research assistantships
- **PhD students** seeking visiting researcher positions or summer internships
- **PhD candidates** searching for postdoc positions
- **Early postdocs** looking for their next position

> Academic-Ops is a filter that helps you find the few positions worth your time out of hundreds. The system recommends against applying to anything with weak research alignment. Your time is valuable, and so is the PI's.

## Features

| Feature | Description |
|---------|-------------|
| **Auto-Pipeline** | Paste a URL → full evaluation + PDF + tracker entry |
| **Full Auto Mode** | `/academic-ops auto` — scans ALL sources, filters vs CV, evaluates, ranks. Hands-free. |
| **Personal Watchlist** | `my-sources.yml` — add labs, PIs, departments, niche boards. Just say "add this lab to my sources" |
| **Weekend Autopilot** | Schedule auto to run every Saturday/Sunday. Get a diff report with new positions on Monday |
| **10-Dimension Evaluation** | Research alignment, methods match, PI assessment, career impact, publication opportunity, funding, prestige, location, timeline, growth |
| **PI Deep Dive** | Publication analysis, h-index trends, alumni tracking, mentoring signals, red/green flags |
| **Academic CV Generation** | Position-tailored CVs with proper academic formatting |
| **Cover Letter Drafting** | Specific, not generic — references the PI's actual papers |
| **PI Directory** | Base list of ~40 NLP/NLU professors organized by 25+ research topics (argument mining, sentiment, RAG, agents, low-resource NLP, etc.) |
| **Smart Outreach** | `/academic-ops outreach` — matches your topics to PIs, researches their papers, drafts 10 personalized emails |
| **Cold Email to PI** | Templates that actually get responses (reference specific papers, clear ask) |
| **Portal Scanner** | EURAXESS, AcademicJobsOnline, Nature Careers, discipline-specific boards + university pages |
| **Batch Processing** | Parallel evaluation with `claude -p` workers |
| **Interview Prep** | Papers to read, questions to prepare, technical brush-up list |
| **Pipeline Integrity** | Automated merge, dedup, status tracking |

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/anvix9/academic-ops.git
cd academic-ops && npm install
npx playwright install chromium

# 2. Check setup
npm run doctor

# 3. Open Claude Code and let it onboard you
claude

# Claude will guide you through:
# - Creating your academic CV (cv.md)
# - Setting up your profile (research field, target positions)
# - Configuring portals for your discipline
```

## Usage

### Two ways to use it

**🤖 Auto mode — hands-free discovery**
```
/academic-ops auto
```
Scans all portals, filters against your CV, batch-evaluates top matches, and presents a ranked shortlist. One command, zero manual input.

**🔗 Manual mode — evaluate a specific position**
```
Paste any position URL or job description directly
```
Evaluates that single position, generates a report, and adds it to your tracker. Use when you find something on your own.

You can mix both — auto to discover, manual to evaluate positions you find yourself.

### All commands

```
/academic-ops                    → Show all available commands
/academic-ops auto               → FULL AUTO: scan → filter → evaluate → rank (hands-free)
/academic-ops {paste a URL}      → Evaluate a single position (manual)
/academic-ops outreach           → Find PIs matching your topics, draft personalized emails
/academic-ops schedule           → Set up weekend autopilot (runs auto every Sat/Sun)
/academic-ops scan               → Scan portals for new positions
/academic-ops cv                 → Generate academic CV PDF
/academic-ops letter             → Generate cover letter
/academic-ops contact            → Draft email to a specific PI
/academic-ops deep               → Deep dive on a lab/PI
/academic-ops batch              → Batch evaluate pending positions
/academic-ops tracker            → View application status
/academic-ops compare            → Compare 2-5 positions side by side
/academic-ops interview          → Prepare for lab visit / interview
/academic-ops training           → Evaluate a summer school or workshop
```

## How It Works

```
┌─────────────────────────────────────────────────────┐
│                  Two entry points                    │
├──────────────────────┬──────────────────────────────┤
│  🤖 AUTO MODE        │  🔗 MANUAL MODE              │
│  /academic-ops auto  │  Paste a URL or description  │
│         │            │         │                     │
│         ▼            │         ▼                     │
│  Scan all portals    │  (skip to evaluation)         │
│         │            │         │                     │
│         ▼            │         │                     │
│  Pre-filter vs CV    │         │                     │
│  (quick 0-10 score)  │         │                     │
│         │            │         │                     │
│         ▼            │         │                     │
│  Batch evaluate      │         │                     │
│  top matches         │         │                     │
│         │            │         │                     │
└─────────┼────────────┴─────────┼─────────────────────┘
          │                      │
          ▼                      ▼
   ┌──────────────────────────────────┐
   │  10-Dimension Evaluation         │
   │  (reads cv.md + profile.yml)     │
   │  Research alignment, PI, career  │
   └──────────────┬───────────────────┘
                  │
             ┌────┼────┐
             ▼    ▼    ▼
          Report  PDF  Tracker
           .md   .pdf   .md
```

## Pre-configured Portals

**Global Aggregators:** EURAXESS, AcademicJobsOnline, jobs.ac.uk, AcademicTransfer, HigherEdJobs, Nature Careers, Science Careers

**Discipline-Specific:** mathjobs.org, PhysicsToday Jobs, CRA

**Fellowships:** DAAD, Fulbright, Marie Skłodowska-Curie, JSPS, Swiss Government

**Universities:** MIT, Stanford, ETH Zürich, Oxford, Cambridge, Max Planck, EPFL, Caltech, UC Berkeley

### AI / ML Research (40+ sources pre-configured)

**Community Spreadsheets:** [PhD/RA/Interns Opening 2026](https://docs.google.com/spreadsheets/d/1vcEUT_5bXYFQgIzVKpsMQlYmV2xv15VtLXq2rvXZqRk/) — professors self-list their openings here. Scanned FIRST in auto mode.

**Conference Job Boards:** NeurIPS, ICML, ACL Rolling Review, AAAI

**Industry Research Labs:** Google DeepMind, Meta FAIR, Microsoft Research, Apple ML Research, NVIDIA Research, Amazon Science, IBM Research, Anthropic, OpenAI, Cohere, Hugging Face, AI2, EleutherAI

**AI Institutes:** Mila (Montréal), Vector Institute (Toronto), CIFAR AI Chairs, ELLIS Network (Europe), Max Planck Intelligent Systems, INRIA (France), RIKEN AIP (Japan), KAIST AI, Stanford HAI, MIT CSAIL, Berkeley BAIR, CMU ML Department

**AI-Specific Boards:** AI Jobs Board, MLOps Community, Robotics Worldwide

> These are all in `portals.yml`. You can add your own labs and sources to `my-sources.yml` on top.

---

### What's preserved from Career-Ops

The core architecture is the same — the parts that make career-ops powerful also power academic-ops:

- **Multi-agent pipeline** — Claude Code with custom skill modes for each task
- **6-Block evaluation reports** — structured analysis, not just a score
- **Batch processing** — parallel evaluation with `claude -p` sub-agents
- **Pipeline integrity** — merge, dedup, status normalization, health checks
- **Human-in-the-loop** — AI evaluates and recommends, you decide and act
- **Self-customizing** — Claude reads and edits its own config files

### What's new in Academic-Ops

Features that don't exist in career-ops:

- **Auto mode** — hands-free scan + evaluate + rank in one command
- **Personal watchlist** (`my-sources.yml`) — separate from base portals, tracks specific labs and PIs
- **Weekend scheduling** — automated cron runs with diff reports
- **PI deep dive** — publication analysis, alumni tracking, mentoring signals
- **AI research lab directory** — 40+ industry labs, institutes, and conference boards pre-configured
- **AI sub-archetypes** — NLP, CV, RL, AI Safety, Generative AI, Robotics, ML Systems, AI for Science, etc.
- **Venue tier scoring** — evaluates PI quality based on where they publish (NeurIPS/ICML/ACL tier vs. workshops)

---

## Project Structure

```
academic-ops/
├── CLAUDE.md                        # Agent instructions
├── README.md                        # This file
├── cv.md                            # Your academic CV (create this)
├── publications.md                  # Your publication list (optional)
├── research-statement.md            # Your research interests (optional)
├── my-sources.yml                   # YOUR personal watchlist (create from example)
├── portals.yml                      # Base portal config (create from example)
├── config/
│   └── profile.example.yml          # Template for your profile
├── modes/                           # Skill modes (14 modes)
│   ├── _shared.md                   # Scoring dimensions, archetypes
│   ├── auto.md                      # Full auto pipeline + weekend scheduling
│   ├── evaluate.md                  # Single position evaluation
│   ├── scan.md                      # Portal scanner
│   ├── cv.md                        # CV generation
│   ├── contact.md                   # PI email drafting
│   ├── deep.md                      # Lab/PI deep research
│   ├── compare.md                   # Side-by-side comparison
│   ├── interview.md                 # Interview preparation
│   ├── letter.md                    # Cover letter / research statement
│   ├── pipeline.md                  # Process pending URLs
│   ├── tracker.md                   # Application status overview
│   ├── batch.md                     # Batch processing
│   └── training.md                  # Summer school evaluation
├── templates/
│   ├── cv-template.html             # Academic CV HTML template
│   ├── cover-letter-template.html   # Cover letter template
│   ├── portals.example.yml          # Base scanner config template
│   └── states.yml                   # Canonical statuses
├── my-sources.example.yml           # Template for personal watchlist
├── batch/                           # Batch processing
├── data/                            # Tracking data (gitignored)
│   ├── applications.md              # Application tracker
│   ├── pipeline.md                  # Pending positions
│   └── auto-runs/                   # Scheduled run logs & diffs
├── reports/                         # Evaluation reports (gitignored)
├── output/                          # Generated PDFs (gitignored)
├── examples/                        # Sample CV and report
└── docs/                            # Setup guide
```

## Adapting to Your Field

The system ships with generic defaults. To customize:

```
# In Claude Code, just ask:
"Change the archetypes to biology wet-lab roles"
"Add EMBO and Howard Hughes fellowship portals"
"Add Dr. Smith's lab at MIT to my sources"
"Watch the MPI Intelligent Systems jobs page"
"Schedule auto every Saturday morning"
"Translate all modes to Spanish"
"Weight publication opportunity at 20% instead of 10%"
"Add these 10 labs to my sources"
```

Claude reads the same files it uses, so it knows exactly what to edit.

## Credits

Adapted from [career-ops](https://github.com/santifer/career-ops) by [santifer](https://santifer.io), originally built for industry job search. The pipeline architecture, batch processing, and tracker system are directly derived from that project.

## License

MIT
