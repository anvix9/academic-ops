# Mode: Pipeline — Process Pending URLs

**Trigger:** User says "process pipeline", "evaluate pending", or `/academic-ops pipeline`

## Workflow

1. **Read `data/pipeline.md`** — get all entries with status `Pending`

2. **For each pending URL:**
   - Navigate with Playwright to verify the position is still active
   - If active: run full evaluation (evaluate mode)
   - If closed/filled: mark as `Discarded` with note "Position closed"

3. **Update pipeline.md** after each evaluation:
   - Change status from `Pending` to `Evaluated` (or `Discarded`)
   - Add the report number

4. **Present summary when done:**
   > "Processed 5 pending positions:
   > - ✅ 3 evaluated (reports #012, #013, #014)
   > - 🚫 1 position already closed
   > - ❌ 1 URL unreachable
   >
   > Top result: Dr. Chen's lab at Oxford — 4.1/5"

## Pipeline File Format (data/pipeline.md)

```markdown
# Position Pipeline

| Date | Source | URL | PI/Lab | Institution | Quick Notes | Status |
|------|--------|-----|--------|-------------|-------------|--------|
| 2026-04-10 | EURAXESS | https://... | Dr. Smith | ETH Zürich | ML postdoc | Pending |
| 2026-04-10 | Nature | https://... | Prof. Lee | MIT | NLP intern | Pending |
| 2026-04-08 | Manual | https://... | Dr. García | UNAM | Comp bio RA | Evaluated |
```

## Adding to Pipeline

Positions enter the pipeline from:
- **Scan mode:** automatically adds matches
- **User:** manually adds URLs ("add this to my pipeline: [URL]")
- **Batch discovery:** when evaluating one position, related positions from the same lab
