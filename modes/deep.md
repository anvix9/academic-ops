# Mode: Deep — Lab & PI Deep Research

**Trigger:** User says "research this lab", "tell me about this PI", "deep dive", or `/academic-ops deep`

## Workflow

1. **Gather information** (WebSearch + Playwright):
   - PI's Google Scholar profile: h-index, i10-index, recent papers, citation trends
   - PI's university page: bio, current grants, teaching
   - Lab group page: current members (PhD students, postdocs), alumni, projects
   - Recent news: grants awarded, media mentions, awards
   - PI's Twitter/X or Mastodon (if public and academic)

2. **Publication Analysis:**
   - Venue quality: Are they publishing in top-tier venues for the field?
   - Collaboration patterns: solo vs. collaborative, recurring co-authors
   - Trajectory: increasing or decreasing output? Shifting topics?
   - Student co-authorship: do students get first-author papers?

3. **Alumni Tracking:**
   - Where did recent PhD graduates go? (Faculty? Industry? Another postdoc?)
   - Where did recent postdocs go?
   - This is a strong signal of mentoring quality

4. **Funding Status:**
   - Active grants (NSF, NIH, ERC, etc.)
   - Grant topics = likely project directions
   - Funded positions are more secure

5. **Red & Green Flags:**

   🟢 **Green Flags:**
   - Students publish as first authors
   - Alumni are well-placed
   - Active grants with years remaining
   - Clear, updated lab website
   - PI responds to emails (check lab FAQ or blog)
   - Reasonable group size (3-8 for most fields)

   🔴 **Red Flags:**
   - No student first-author papers
   - High student turnover / many incomplete PhDs
   - Lab website not updated in 2+ years
   - No active grants visible
   - Glassdoor-style reviews mentioning toxic culture
   - PI has 50+ people — you may get lost

6. **Generate Report:**

```markdown
# Lab Deep Dive: {PI Name}
## {Institution} — {Department}

### Research Profile
- **Field:** {field}
- **h-index:** {h} | **i10-index:** {i10}
- **Recent output:** {N papers in last 3 years}
- **Top venues:** {list}
- **Active grants:** {list with funding body and end date}

### Group Composition
- **Current PhD students:** {N}
- **Current postdocs:** {N}
- **Notable alumni:** {names + current positions}

### Recent Key Papers
1. {Title} ({Year}) — {venue} — {why it matters}
2. ...
3. ...

### Mentoring Signals
- Student first-authorship rate: {X}%
- Average PhD completion time: {if findable}
- Alumni placement: {summary}

### Red & Green Flags
🟢 ...
🔴 ...

### Recommendation
{Verdict: pursue / proceed with caution / avoid}
{Specific next steps}
```
