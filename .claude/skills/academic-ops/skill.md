# Academic-Ops Skill

## Description
AI-powered academic position search: lab internships, research assistantships, postdocs. Evaluate positions, scan portals, generate CVs, research PIs, and track applications.

## Commands

### /academic-ops
Show all available commands.

### /academic-ops auto
**Full hands-free pipeline.** Scans all portals, pre-filters against your CV, batch-evaluates top matches, ranks results, and presents a shortlist. No manual input needed — just run it.

### /academic-ops [URL or job description]
Full auto-pipeline: evaluate the position, generate report, add to tracker.

### /academic-ops scan
Scan configured academic portals for new positions matching your profile.

### /academic-ops cv [position-num]
Generate a tailored academic CV PDF. If position number provided, tailors to that position.

### /academic-ops letter [position-num]
Generate a cover letter for the specified position.

### /academic-ops contact [position-num]
Draft a cold email to the PI for the specified position.

### /academic-ops deep [PI name or lab URL]
Deep research on a PI or lab: publications, mentoring signals, alumni tracking.

### /academic-ops compare [num1] [num2] ...
Side-by-side comparison of 2-5 evaluated positions.

### /academic-ops batch
Batch evaluate all pending positions in data/pipeline.md.

### /academic-ops tracker
Show current application tracker with status overview.

### /academic-ops interview [position-num]
Generate interview prep kit for a specific position.

### /academic-ops training [URL]
Evaluate a summer school, workshop, or course for career value.

## Routing

Two primary paths:

**Path A — Auto (hands-free):** User says "find positions", "run auto", `/academic-ops auto`
→ Load `modes/auto.md` → scans portals → filters against CV → batch evaluates → ranks

**Path B — Manual (single position):** User pastes a URL or job description
→ Load `modes/evaluate.md` → evaluates that position → report + tracker

For any `/academic-ops` invocation:
1. Read `CLAUDE.md` for system instructions
2. Read `modes/_shared.md` for scoring and archetypes
3. Read the specific mode file from `modes/`
4. Read `cv.md` and `config/profile.yml` for user context
5. Execute the mode workflow
