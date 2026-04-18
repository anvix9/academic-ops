# Mode: Outreach — Topic-Matched PI Discovery & Email Drafting

**Trigger:** User says "find PIs for my topic", "who should I email", "outreach", "find professors", or `/academic-ops outreach`

## What This Does

1. Matches user's research topics to PIs in the directory
2. Researches each matched PI (recent papers, openings)
3. Drafts personalized emails referencing specific papers
4. Presents a ranked outreach plan

This is DIFFERENT from `contact` mode (which drafts ONE email for a known PI).
`outreach` mode DISCOVERS which PIs to contact based on your topics.

---

## Workflow

### Step 1: Build Topic Profile

Read user's research topics from:
- `config/profile.yml` → `research.subfields` and `research.topics`
- `cv.md` → extract topics from publications and experience
- `research-statement.md` → extract future directions

Map to the topic taxonomy in `data/pi-directory.yml`:

```
User topics detected:
  ✓ argument_mining (from profile: "argument mining")
  ✓ sentiment_analysis (from profile: "opinion mining")
  ✓ low_resource_nlp (from CV: "cross-lingual transfer for low-resource languages")
  ✓ finetuning_and_quantization (from CV: "parameter-efficient fine-tuning")
  + User added: rag_and_retrieval, agents_and_tool_use
```

### Step 2: Match PIs from Directory

Load `data/pi-directory.yml` and score each PI:

**Topic match scoring:**
| Signal | Points |
|--------|--------|
| PI topic matches user's primary topic | +3 |
| PI topic matches user's secondary topic | +2 |
| PI topic matches user's tertiary topic | +1 |
| PI `takes` includes user's target position type | +2 (required — skip if not) |
| PI region matches user's geographic preference | +1 |
| PI has `priority: high` in my-sources.yml | +2 |

**Filter:**
- Only include PIs where `takes` includes user's target (intern/phd/postdoc)
- Minimum topic match score: 3
- Sort by score descending

### Step 3: Research Top Matches (WebSearch)

For each top-10 matched PI:
1. **Check for open positions:** search `"{PI name}" "{institution}" postdoc OR intern OR "PhD" openings 2026`
2. **Find recent paper:** search `"{PI name}" {matching topic} 2025 2026` on Google Scholar
3. **Check lab page:** if `lab_url` exists, check for "join us" / "openings" page
4. **Extract key info:**
   - Most recent relevant paper (title, venue, year)
   - Whether they have an open position posted
   - Recent grant or project (if findable)
   - Email address (from university page)

### Step 4: Draft Personalized Emails

For each PI, generate a personalized email following `modes/contact.md` rules, but with automatic topic matching:

**Email template logic:**

```
IF PI has open position posted:
  → Reference the position + their paper + your fit
  → Subject: "RE: [Position Title] — [your name], [your institution]"

ELSE IF PI has recent paper matching your topic:
  → Reference the paper + connect to your work + ask about openings
  → Subject: "RE: [Paper Title] — prospective [position type] inquiry"

ELSE:
  → Reference their lab's research direction + connect to your work
  → Subject: "[Topic] research — [position type] inquiry from [institution]"
```

**For each email, include:**
- Which specific paper of theirs to cite (title, venue, year)
- Which part of YOUR CV to emphasize
- Why the match works (1 sentence)
- What to attach (CV, research summary, specific paper)

### Step 5: Present Outreach Plan

```
🎯 Outreach Plan — Based on your topics
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your topics: argument mining, sentiment analysis, low-resource NLP, RAG

📬 TOP PI MATCHES (10 emails ready to send)

  🟢 OPEN POSITION FOUND:
  1. Prof. Iryna Gurevych — TU Darmstadt (UKP Lab)
     Match: argument mining + low-resource NLP (score: 8/10)
     Position: Postdoc in Argument Quality Assessment (posted 2 weeks ago)
     Reference: their EMNLP 2025 paper on cross-lingual argument mining
     📧 Email drafted ✓

  2. Prof. Henning Wachsmuth — Leibniz Hannover
     Match: argument mining + sentiment analysis (score: 7/10)
     Position: PhD position in Computational Argumentation (posted 1 month ago)
     Reference: their ACL 2025 paper on argument quality
     📧 Email drafted ✓

  🟡 NO POSITION POSTED (cold outreach):
  3. Prof. Claire Cardie — Cornell
     Match: argument mining + sentiment analysis (score: 7/10)
     Reference: their recent work on opinion mining with LLMs
     📧 Email drafted ✓

  4. Prof. Rodrigo Agerri — UPV/EHU (HiTZ)
     Match: low-resource NLP + argument mining (score: 6/10)
     Reference: their Basque LLM paper at RANLP 2025
     📧 Email drafted ✓

  [... 6 more ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 SUMMARY:
  • 3 PIs with open positions (apply now!)
  • 7 PIs for cold outreach (reference their papers)
  • All emails reference a specific recent paper
  • All emails connect YOUR work to THEIR research

What would you like to do?
  a) Review all 10 emails
  b) Send emails for PIs with open positions first
  c) Edit a specific email
  d) Add more topics to broaden the search
```

### Step 6: User Reviews & Sends

- Present each email one at a time for review
- User can edit, approve, or skip
- **NEVER send without user approval**
- When user approves an email → **immediately update `data/outreach-log.md`:**

```markdown
| 1 | 2026-04-14 | Prof. Iryna Gurevych | TU Darmstadt | Postdoc | ✅ | Emailed | 0 | PI Directory | Ref: their EMNLP 2025 paper |
```

- Also add to `data/applications.md` tracker (status: `Emailed`)

---

## Outreach Log — Anti-Spam System

The file `data/outreach-log.md` is the SINGLE SOURCE OF TRUTH for who has been contacted. Every mode that involves emailing a professor MUST check it.

### Columns

| Column | Description |
|--------|-------------|
| # | Sequential number |
| Date | Date email was sent (YYYY-MM-DD) |
| Professor | Full name |
| Institution | University or lab |
| Position | What was asked about (postdoc / intern / PhD) |
| Email Sent | ✅ sent, ❌ drafted but not sent, ⏳ scheduled |
| Status | `Emailed` → `Follow-up 1` → `Follow-up 2` → `Responded` / `No Response` / `Rejected` |
| Follow-ups | Count: 0, 1, or 2 (max) |
| Source | Where the PI was found: `PI Directory`, `Community Sheet`, `EURAXESS`, `Manual`, etc. |
| Notes | Paper referenced, position details |

### Dedup Rules (ENFORCED EVERYWHERE)

| Situation | Action |
|-----------|--------|
| Professor NOT in log | OK to email |
| Professor in log, status `Emailed`, < 7 days ago | ❌ SKIP — too soon |
| Professor in log, status `Emailed`, 7-14 days ago, 0 follow-ups | ⚠️ Suggest follow-up |
| Professor in log, status `Follow-up 1`, 7+ days ago | ⚠️ Suggest final follow-up |
| Professor in log, follow-ups = 2, no response | ❌ SKIP — max follow-ups reached |
| Professor in log, status `Responded` | ❌ SKIP — conversation ongoing |
| Professor in log, status `Interview` | ❌ SKIP — in process |
| Professor in log, status `Rejected` | ❌ SKIP — closed |
| Professor in log, status `No Response`, > 60 days | ⚠️ May re-contact IF new position posted |

### Which modes check the outreach log?

- `outreach` mode → filters out already-contacted PIs before matching
- `contact` mode → warns if PI already contacted, blocks if recent
- `auto` mode → skips already-contacted PIs in the scan results
- `scan` mode → flags already-contacted PIs in the scan output

### Follow-up Workflow

When suggesting a follow-up:
1. Draft a SHORT follow-up (2-3 sentences, not a re-send)
2. Add new information if possible ("Since my last email, I presented at [conference]...")
3. Update outreach-log.md: increment follow-up count, update status
4. If no response after Follow-up 2 → mark as `No Response`, move on

---

## Topic Expansion

When the user says "add more topics" or specifies new research areas:

1. Map to existing taxonomy if possible
2. If new topic, add to `config/profile.yml` → `research.topics`
3. Re-run matching against PI directory
4. Search for PIs NOT in the directory who work on this topic (WebSearch)
5. Suggest adding new PIs to `my-sources.yml`

**Base topics (built-in):**

| Category | Topics |
|----------|--------|
| **Core NLP** | general_nlp, information_extraction, question_answering, summarization, text_generation, dialogue_systems |
| **Argumentation** | argument_mining (quality, stance, structure, fallacy detection, persuasion) |
| **Sentiment & Opinion** | sentiment_analysis (aspect-based, multimodal, cross-lingual, stance detection) |
| **LLM Techniques** | pretraining, post_training (RLHF, DPO, constitutional AI), finetuning_and_quantization (LoRA, QLoRA, adapters, pruning) |
| **Retrieval & Knowledge** | rag_and_retrieval (dense retrieval, knowledge editing, fact verification), knowledge_graphs |
| **Agents** | agents_and_tool_use (ReAct, tool calling, code generation, planning) |
| **Efficiency** | optimization_and_efficiency (distillation, pruning, efficient attention, inference) |
| **Multilingual** | multilingual_nlp, low_resource_nlp, machine_translation |
| **Applied** | nlp_for_health, nlp_for_education, computational_social_science |
| **Modalities** | multimodal_nlp, speech_and_nlp |
| **Meta** | interpretability_and_analysis, evaluation_and_benchmarking |

Users add their own topics freely — Claude maps them to the taxonomy or creates new entries.

---

## Updating the PI Directory

The base `data/pi-directory.yml` ships with ~40 PIs. To grow it:

- **User says "add Prof. X to the directory"** → Claude researches and adds to `my-sources.yml` (not the base file)
- **Auto mode finds a new PI** during scanning → suggests adding to `my-sources.yml`
- **Outreach mode discovers PIs via WebSearch** → suggests adding

The base file is updated by the project maintainer. User additions always go to `my-sources.yml`.

---

## Ethical Guardrails

- **Max 10 emails per outreach run.** Don't spam the community.
- **Never email the same PI twice** (check tracker for `Emailed` status).
- **Space emails 2+ days apart** to avoid looking like a mass campaign.
- **Every email MUST be personalized.** No template blasts. Each email references a specific paper.
- **Always honest about fit.** If there's a gap, acknowledge it in the email.
- **User approves every email.** Claude drafts, user sends.
