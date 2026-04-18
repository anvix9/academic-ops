# Mode: Tracker — Application Status Overview

**Trigger:** User says "show tracker", "application status", "where am I", or `/academic-ops tracker`

## Workflow

1. **Read `data/applications.md`**

2. **Generate status summary:**
   ```
   📊 Application Pipeline — 15 total
   
   📋 Evaluated:     8   ████████░░░░░░░
   📧 Emailed:       3   ███░░░░░░░░░░░░
   📨 Applied:       2   ██░░░░░░░░░░░░░
   💬 Responded:     1   █░░░░░░░░░░░░░░
   🎤 Interview:     1   █░░░░░░░░░░░░░░
   🚫 Discarded:     0
   ❌ Rejected:      0
   ```

3. **Highlight action items:**
   - Positions evaluated but not yet contacted (oldest first)
   - **Outreach follow-ups due** (from `data/outreach-log.md`):
     - Professors emailed 7+ days ago with no response and < 2 follow-ups
     - Format: "📧 Follow-up due: Prof. X (emailed 10 days ago, 0 follow-ups)"
   - Upcoming deadlines (within 2 weeks)
   - Interviews to prepare for

4. **Score distribution:**
   - Average score of evaluated positions
   - Top 3 highest-scored positions
   - Any patterns (e.g., "Your strongest matches are in computational neuroscience at European institutions")

5. **Suggest next actions:**
   > "Recommended next steps:
   > 1. Send follow-up to Dr. Smith (emailed 10 days ago, no response)
   > 2. Apply to Dr. Chen's position at Oxford (score: 4.1, deadline in 5 days)
   > 3. Prepare for lab visit at ETH (scheduled April 20)"
