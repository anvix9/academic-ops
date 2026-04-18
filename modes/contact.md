# Mode: Contact — Draft Email to PI

**Trigger:** User says "draft email to PI", "contact professor", "write to lab", or `/academic-ops contact`

## Workflow

0. **CHECK OUTREACH LOG FIRST** (silent):
   - Read `data/outreach-log.md`
   - If this PI was already emailed < 30 days ago → WARN user: "You emailed Prof. X on [date]. No response yet. Want me to draft a follow-up instead?"
   - If this PI has 2 follow-ups and no response → WARN: "You've already sent 2 follow-ups to Prof. X with no response. I'd recommend moving on."
   - If this PI responded → WARN: "Prof. X already responded on [date]. Check your tracker."

1. **Read context:**
   - `cv.md` — user's academic CV
   - `config/profile.yml` — user's level, field
   - `research-statement.md` — research interests (if exists)
   - The evaluation report (if this position was already evaluated)

2. **Research the PI** (use WebSearch):
   - Find 2-3 recent papers by the PI (last 2 years)
   - Read the lab's research page
   - Check if the PI has publicly stated openings

3. **Draft the email** following these principles:
   - **Subject line:** Reference a specific paper or project, NOT "Inquiry about positions"
   - **Opening (1-2 sentences):** Show you've read their work — cite a specific paper with a genuine observation
   - **Your fit (2-3 sentences):** Connect YOUR specific experience to THEIR specific research. Name a method, dataset, or result from your work that's relevant.
   - **The ask (1 sentence):** Clear and specific — "I'd welcome the chance to discuss whether there might be a fit in your group for [position type]"
   - **Close:** Professional, brief. Mention attached CV.

4. **What to AVOID:**
   - ❌ "I am writing to express my interest in..." (generic)
   - ❌ "Your research is very interesting" without specifics
   - ❌ Listing your entire CV in the email body
   - ❌ Name-dropping without substance
   - ❌ More than 200 words total
   - ❌ Asking for funding when the posting says "self-funded"

5. **Present to user** with explanations:
   > "Here's a draft email. I referenced their 2025 paper on [X] because it connects directly to your [Y] experience. The ask is specific — I suggested a 15-minute call since PIs are more likely to respond to a concrete, low-commitment request."

6. **Offer variants:**
   - Variant A: Direct application (if there's a posted position)
   - Variant B: Exploratory inquiry (no posted position, cold outreach)
   - Variant C: Conference follow-up (if user met the PI at a conference)

## Email Template Structure

```
Subject: [Specific paper/project reference] — [Position type] inquiry

Dear Professor [Last Name],

[1-2 sentences showing genuine engagement with their recent work — cite a specific paper, result, or method]

[2-3 sentences connecting your experience to their research — name specific methods, tools, or results from YOUR work]

[1 sentence: the ask — clear, specific, low-commitment]

I've attached my CV for your reference. [Optional: "My recent work on [X] is available at [link]."]

Best regards,
[Your name]
[Your institution]
[Your email]
```

## Follow-up Rules

- Wait 7-10 business days before following up
- Follow-up should add new information or context, not just restate interest
- Maximum 2 follow-ups total — if no response after 2, move on
- Track ALL emails in `data/outreach-log.md`:
  - When user approves initial email → add new row, status `Emailed`, follow-ups `0`
  - When user approves follow-up → update row, status `Follow-up 1` or `Follow-up 2`, increment count
  - When PI responds → update status to `Responded`
- Also track in `data/applications.md` for the pipeline view
