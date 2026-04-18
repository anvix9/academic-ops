# Mode: Scan — Academic Portal Scanner

**Trigger:** User says "scan", "search for positions", "find openings", or `/academic-ops scan`

## Workflow

1. **Read context:**
   - `config/profile.yml` — field, level, preferences
   - `portals.yml` — configured portals and search queries
   - `data/scan-history.tsv` — previously seen positions (dedup)

2. **For each portal in `portals.yml`:**

   **Community spreadsheets** (type: `community_sheet`) — scan FIRST:
   - Download CSV via the `csv_url`
   - Parse rows: professor, institution, area, position type, link, deadline
   - These are SELF-POSTED by professors → highest signal source
   - Match against user's research topics
   - Cross-reference with PI directory for enrichment

   **Standard portals:**
   - Navigate to the portal URL with Playwright
   - Apply filters (field, level, keywords)
   - Extract position listings: title, institution, PI (if available), URL, deadline
   - Deduplicate against `scan-history.tsv`

3. **For each new position:**
   - Quick relevance check against profile (field match, level match, location match)
   - Assign preliminary relevance: High / Medium / Low / Skip
   - Only include High and Medium in results

4. **Update `scan-history.tsv`** with all seen positions (including skipped)

5. **Add promising positions to `data/pipeline.md`:**
   ```markdown
   | Date | Source | URL | PI/Lab | Institution | Quick Notes | Status |
   |------|--------|-----|--------|-------------|-------------|--------|
   | 2026-04-13 | EURAXESS | https://... | Dr. Smith | ETH Zürich | ML + neuroscience postdoc | Pending |
   ```

6. **Present summary to user:**
   > "Scanned 8 portals. Found 23 new positions, 12 match your profile:
   > - 🟢 4 high relevance (postdoc in computational neuro)
   > - 🟡 8 medium relevance (related fields, worth reviewing)
   >
   > Want me to evaluate the top ones?"

## Portal Configuration (portals.yml)

```yaml
portals:
  # Aggregator sites
  - name: EURAXESS
    url: https://euraxess.ec.europa.eu/jobs/search
    type: aggregator
    filters:
      research_field: "{from profile}"
      career_stage: "{from profile: R1/R2/R3}"
      country: "{from profile}"

  - name: AcademicJobsOnline
    url: https://academicjobsonline.org/ajo/jobs
    type: aggregator

  - name: jobs.ac.uk
    url: https://www.jobs.ac.uk/search
    type: aggregator

  - name: AcademicTransfer
    url: https://www.academictransfer.com/en/jobs/
    type: aggregator
    region: Netherlands/Europe

  # Discipline-specific
  - name: mathjobs.org
    url: https://www.mathjobs.org/jobs
    type: discipline
    fields: [mathematics, statistics, applied math]

  # University career pages
  - name: MIT
    url: https://careers.mit.edu
    type: university

  - name: Stanford
    url: https://postdocs.stanford.edu/prospective/opportunities
    type: university

  - name: ETH Zürich
    url: https://jobs.ethz.ch
    type: university

  # Lab group pages (user adds these)
  labs: []

# Search queries for aggregators
queries:
  - "{field} postdoc"
  - "{field} research assistant"
  - "{field} PhD internship"
  - "{field} lab intern"
  - "{field} visiting researcher"
  - "{subfield1} {subfield2} postdoctoral"

# Keyword filters
title_filter:
  positive: [postdoc, postdoctoral, research assistant, lab intern, visiting researcher, PhD student, research fellow]
  negative: [faculty, professor, lecturer, administrative, technician]
```

## Dedup Strategy

- Key: `{institution}_{normalized_title}_{PI_if_known}`
- If a position was seen in the last 30 days, skip
- If a position was previously evaluated (in applications.md), skip
- If deadline has passed, skip
