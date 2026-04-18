# Mode: Evaluate — Single Position Evaluation

**Trigger:** User pastes a position URL, job description, or says "evaluate this position"

## Workflow

1. **Read context files** (silently):
   - `cv.md` — user's academic CV
   - `config/profile.yml` — target fields, level, preferences
   - `publications.md` — publication list (if exists)
   - `research-statement.md` — research interests (if exists)
   - `modes/_shared.md` — scoring dimensions and archetypes

2. **Get the position details:**
   - If URL: use Playwright to navigate and snapshot the page
   - If pasted text: parse the description directly
   - Extract: PI name, institution, department, position type, requirements, research description, deadline

3. **Research the lab** (use WebSearch):
   - PI's Google Scholar profile — recent papers, h-index, citation trends
   - Lab group page — current members, recent alumni, projects
   - Recent news or grants

4. **Classify archetype** from `_shared.md`

5. **Score all 10 dimensions** per the scoring guide

6. **Generate 6-Block Report** and save to `reports/{num}-{lab-slug}-{YYYY-MM-DD}.md`

7. **Generate verdict:**
   - Score ≥ 4.0 → "**Strong fit — apply.** [specific reason]"
   - Score 3.0–3.9 → "**Moderate fit — apply if [condition].** [gap to address]"
   - Score < 3.0 → "**Weak fit — skip unless [rare exception].**"

8. **Add to tracker** via TSV file in `batch/tracker-additions/`

9. **Ask user:** "Want me to generate a tailored CV and cover letter for this position?"

## Report Format

```markdown
# Position Evaluation: {Position Title}
## {Institution} — {Department}

**PI:** {PI Name}
**URL:** {url}
**Date:** {YYYY-MM-DD}
**Score:** {X.X}/5 ({Grade})
**Archetype:** {archetype}
**Position Type:** {internship / RA / postdoc}

---

### Block 1: Position Summary
[...]

### Block 2: Research Alignment Analysis
[...]

### Block 3: PI & Group Assessment
[...]

### Block 4: Application Strategy
[...]

### Block 5: Career Impact Assessment
[...]

### Block 6: Interview Preparation
[...]

---

### Dimension Scores

| Dimension | Score | Notes |
|-----------|-------|-------|
| Research Alignment | X.X | ... |
| Methods & Skills Match | X.X | ... |
| PI & Group Fit | X.X | ... |
| Career Impact | X.X | ... |
| Publication Opportunity | X.X | ... |
| Funding & Compensation | X.X | ... |
| Institution Prestige | X.X | ... |
| Location & Logistics | X.X | ... |
| Duration & Timeline | X.X | ... |
| Growth Environment | X.X | ... |
| **Weighted Average** | **X.X** | **Grade: {A-F}** |
```
