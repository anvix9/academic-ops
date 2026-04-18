# Academic-Ops Setup Guide

## Prerequisites

- **Node.js ≥ 18** — [nodejs.org](https://nodejs.org)
- **Claude Code** — [claude.ai/code](https://claude.ai/code)
- **Git** — for cloning and version control

## Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/academic-ops.git
cd academic-ops

# Install dependencies
npm install

# Install Playwright browser (for PDF generation and portal scanning)
npx playwright install chromium

# Run health check
npm run doctor
```

## Configuration

### 1. Create Your Academic CV

Create `cv.md` in the project root. See `examples/example-cv.md` for the expected format.

**Recommended sections:**
- Education (degrees, institutions, dates, advisors)
- Research Experience (positions, labs, key contributions)
- Publications (full citations, bold your name)
- Presentations & Talks
- Teaching Experience
- Awards & Fellowships
- Skills & Techniques (programming, lab methods, tools)
- Languages

**Tip:** If you have a LaTeX CV, paste it into Claude and ask it to convert to markdown.

### 2. Set Up Your Profile

```bash
cp config/profile.example.yml config/profile.yml
```

Edit `config/profile.yml` with your details. The most important fields:
- `academic.level` — determines which position types to prioritize
- `research.field` and `research.subfields` — used for matching and scanning
- `targets.position_types` — what you're looking for
- `targets.geographic_preferences` — where you want to work

### 3. Configure Portals

```bash
cp templates/portals.example.yml portals.yml
```

The default config includes 20+ portals. Customize by:
- Adding specific university career pages
- Adding lab group pages you're interested in
- Adjusting keyword filters for your field
- Removing portals that aren't relevant to your region/field

### 4. Optional Files

**`publications.md`** — Detailed publication list with abstracts and links. Helps the evaluator understand your work more deeply.

**`research-statement.md`** — Your research interests and future directions. Used for tailoring cover letters and assessing fit.

### 5. Verify Setup

```bash
npm run doctor
```

All checks should pass. If not, the doctor will tell you what's missing.

## First Use

```bash
# Open Claude Code in the project directory
claude

# Then try:
# 1. Paste a position URL
# 2. Or type: /academic-ops scan
# 3. Or type: /academic-ops
```

## Customization

The entire system is designed to be customized by Claude itself. Just ask:

| You say... | Claude does... |
|------------|----------------|
| "Change archetypes to biology" | Edits `modes/_shared.md` |
| "Add EMBO fellowship portal" | Edits `portals.yml` |
| "Translate modes to Spanish" | Edits all files in `modes/` |
| "Weight publications at 20%" | Edits scoring in `modes/_shared.md` |
| "Add these 5 labs to scan" | Edits `portals.yml` labs section |
| "My field is physics, not CS" | Updates profile and all related configs |

## Workflow Tips

1. **Start by scanning** — `/academic-ops scan` to discover positions
2. **Evaluate promising ones** — paste URLs or run `/academic-ops batch`
3. **Compare top picks** — `/academic-ops compare 1 2 3`
4. **Apply strategically** — generate tailored CV + cover letter for top matches
5. **Track everything** — `/academic-ops tracker` for overview and action items
6. **Prepare for interviews** — `/academic-ops interview [num]` before lab visits

## Data Privacy

All your data stays local:
- Your CV, profile, and applications are stored in your project directory
- Data is sent only to the AI provider (Anthropic) during evaluation
- Nothing is uploaded to any server
- The `.gitignore` excludes all personal data from version control
