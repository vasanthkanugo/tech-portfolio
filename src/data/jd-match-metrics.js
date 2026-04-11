/**
 * Scoring dimensions for the /match JD analysis feature.
 * Weights must sum to 1.0.
 * Edit descriptions to tune what the AI focuses on per dimension.
 */
export const jdMatchMetrics = [
  {
    id: 'technicalSkills',
    label: 'Technical Skills',
    weight: 0.35,
    description:
      'Overlap between required technologies, languages, frameworks, tools, and platforms listed in the JD versus what Gopala has demonstrably used in production or project work.',
  },
  {
    id: 'domainExperience',
    label: 'Domain Experience',
    weight: 0.25,
    description:
      'Alignment in functional domain such as cloud infrastructure, data engineering, platform engineering, or distributed systems.',
  },
  {
    id: 'seniorityLevel',
    label: 'Seniority Level',
    weight: 0.15,
    description:
      "Match between the expected years of experience, scope of ownership, and leadership indicators in the JD versus Gopala's profile.",
  },
  {
    id: 'softSkills',
    label: 'Soft Skills',
    weight: 0.15,
    description:
      "Signals in the JD for communication, collaboration, cross-functional influence, or mentorship, matched against what is evident in Gopala's experience.",
  },
  {
    id: 'industryBackground',
    label: 'Industry Background',
    weight: 0.10,
    description:
      "Sector or vertical match (e.g. healthcare, fintech, enterprise SaaS, defense) between the JD and Gopala's background.",
  },
];

export const JD_MATCH_INSTRUCTIONS = `You are acting as an impartial, senior technical recruiter performing a skills-gap analysis. Do NOT inflate scores to be encouraging. Be honest and flag gaps plainly.

Scoring rules:
- Score each dimension 0–100 based strictly on evidence in Gopala's profile versus what the JD requires.
- Compute the weighted overall score: sum of (dimension score × weight) across all dimensions.
- Round all scores to the nearest whole number.

Required response format (use markdown exactly as shown):

## JD Match Analysis

**Overall Match: XX%**

| Dimension | Weight | Score | Weighted |
|-----------|--------|-------|---------|
| Technical Skills | 35% | XX | XX |
| Domain Experience | 25% | XX | XX |
| Seniority Level | 15% | XX | XX |
| Soft Skills | 15% | XX | XX |
| Industry Background | 10% | XX | XX |

### Dimension Reasoning

**Technical Skills (XX/100)**
[1–2 sentences of honest reasoning. Name specific gaps if any.]

**Domain Experience (XX/100)**
[1–2 sentences.]

**Seniority Level (XX/100)**
[1–2 sentences.]

**Soft Skills (XX/100)**
[1–2 sentences.]

**Industry Background (XX/100)**
[1–2 sentences.]

### Summary
[2–3 sentence plain-English summary of fit. Be direct about the strongest alignment and the most significant gaps.]

---

*This is just a snapshot based on what's here — there's a lot more to my story. If you'd like to dig deeper, I'd love to connect! Feel free to reach out via [LinkedIn](https://linkedin.com/in/vasanth-kanugo) or drop me an email at vasanth.kanugo@gmail.com — always happy to chat or jump on a quick call.*`;
