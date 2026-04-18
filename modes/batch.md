# Mode: Batch — Parallel Position Evaluation

**Trigger:** User says "batch evaluate", "evaluate all pending", or `/academic-ops batch`

## Workflow

1. **Read `data/pipeline.md`** — get all positions with status `Pending`

2. **For each position**, run the evaluate mode using `claude -p` sub-agents:
   ```bash
   claude -p "$(cat batch/batch-prompt.md)" < jds/{position-file}.md
   ```

3. **Each sub-agent produces:**
   - Evaluation report in `reports/`
   - Tracker TSV in `batch/tracker-additions/`

4. **After all complete:**
   ```bash
   node merge-tracker.mjs
   ```

5. **Present summary:**
   > "Evaluated 8 positions:
   > - 🟢 2 strong fits (score ≥ 4.0)
   > - 🟡 3 moderate fits (3.0–3.9)
   > - 🔴 3 weak fits (< 3.0)
   >
   > Top recommendations:
   > 1. Dr. Smith's lab at MIT — 4.5/5 — perfect alignment on [topic]
   > 2. Dr. García's group at ETH — 4.2/5 — strong methods match
   >
   > Want me to generate CVs and cover letters for the top 2?"

## Batch Prompt

The batch prompt (`batch/batch-prompt.md`) is a self-contained version of the evaluate mode that includes:
- The user's CV (embedded)
- The user's profile (embedded)
- Scoring dimensions and archetypes
- Instructions to output report + TSV

This allows sub-agents to operate independently without reading files.

## Rate Limiting

- Max 5 concurrent sub-agents
- 2-second delay between launches
- If a sub-agent fails, retry once, then skip and log the failure
