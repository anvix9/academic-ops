# Mode: Letter — Cover Letter & Research Statement Generation

**Trigger:** User says "write cover letter", "research statement", "application letter", or `/academic-ops letter`

## Cover Letter Workflow

1. **Read context:**
   - `cv.md` — user's CV
   - `config/profile.yml` — user info
   - `research-statement.md` — research interests (if exists)
   - Evaluation report for the target position
   - `templates/cover-letter-template.html` — template

2. **Structure (1 page max):**

   **Paragraph 1 — Why This Lab (3-4 sentences)**
   - Reference a specific recent paper or project from the PI
   - Connect it to the broader research question that excites you
   - Make clear you've done your homework — NOT generic

   **Paragraph 2 — Your Relevant Experience (4-5 sentences)**
   - Pick 2-3 experiences from your CV that directly relate to the position
   - Mention specific methods, tools, or results
   - Include a brief mention of a key publication if relevant
   - Use the evaluation report's Block 4 (Application Strategy) as guidance

   **Paragraph 3 — What You Bring & What You'll Gain (3-4 sentences)**
   - Skills and perspectives you add to the group
   - What you hope to learn or develop
   - How this fits your long-term research trajectory

   **Paragraph 4 — Logistics & Close (2-3 sentences)**
   - Availability and start date
   - Visa status (if relevant and positive; omit if complicated)
   - Mention enclosed CV and references
   - Clear closing

3. **Generate PDF:**
   ```bash
   node generate-pdf.mjs --input output/{num}-cover-{institution-slug}.html --output output/{num}-cover-{institution-slug}.pdf
   ```

## Research Statement Workflow

When the user needs a research statement (common for postdoc and faculty applications):

1. **Structure (2 pages max for postdoc, 3-5 for faculty):**

   **Section 1: Research Vision (1 paragraph)**
   - Big-picture question driving your work
   - Why it matters

   **Section 2: Past Research (3-4 paragraphs)**
   - Major projects with results
   - Link projects to the big-picture question
   - Technical contributions and impact

   **Section 3: Proposed Research (3-4 paragraphs)**
   - 2-3 concrete project ideas for the new position
   - At least 1 should connect directly to the target lab's strengths
   - Include preliminary ideas, not just vague directions
   - Mention potential collaborations within the department

   **Section 4: Broader Impact (1 paragraph)**
   - Teaching, mentoring, outreach, diversity contributions

2. **Tailoring:**
   - If writing for a specific lab: emphasize projects that leverage their infrastructure, datasets, or expertise
   - If writing a general statement: keep project ideas broad enough to fit multiple labs but specific enough to be credible

## What to AVOID in Cover Letters

- ❌ "I am writing to apply for the position of..." (waste of a first sentence)
- ❌ "I have always been passionate about..." (show, don't tell)
- ❌ Listing every publication or every course
- ❌ Repeating the CV in paragraph form
- ❌ Generic praise of the institution
- ❌ More than 1 page
- ❌ Apologizing for any gaps or weaknesses (address them positively or not at all)
