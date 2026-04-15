/**
 * Job scenario stories for the "Ask Gopala" chatbot suggestion chips.
 *
 * Each entry shape:
 * {
 *   id: string,                // unique slug, e.g. 'scaled-infra-migration'
 *   title: string,             // shown on the chip and used as the question
 *   problem: string,           // the challenge or context
 *   solution: string,          // what you did
 *   impact: string,            // measurable outcome
 *   tags: string[],            // e.g. ['leadership', 'cloud', 'cost-reduction']
 *   relatedExperience: string  // id from experience.js if applicable, or null
 * }
 */
export const jobScenarios = [
  {
    id: 'moderna-nat-gateway',
    title: 'How did you save $2M at Moderna?',
    problem:
      'As part of FinOps cost analysis at Moderna, I noticed that one service — Domino — was generating unexpectedly high AWS charges. After digging in, I traced the root cause to excessive NAT Gateway traffic that no one had flagged before.',
    solution:
      'I engaged with the service owner to understand their use cases, then dove into VPC Flow Logs to identify that the majority of traffic was S3-bound — traffic that was being routed expensively through the NAT Gateway. I replaced the NAT Gateway with a VPC endpoint for S3, updated the route tables, validated everything in the dev environment, and promoted to production.',
    impact:
      'Reduced monthly AWS costs by 30% for that service. This single architectural change saved Moderna approximately $2M annually.',
    tags: ['aws', 'cost-reduction', 'finops', 'deep-dive', 'cloud'],
    relatedExperience: 'moderna-2023',
  },
  {
    id: 'moderna-finops-team',
    title: 'How did you build a FinOps team from scratch?',
    problem:
      'At Moderna, I was the sole person responsible for FinOps. The company had a third-party vendor providing recommendations, but they were simply wrapping a licensed FinOps tool — adding cost without adding insight. The $1M annual savings goal for 2024 was impossible to hit with a one-person operation.',
    solution:
      'I built a data-driven case to eliminate the vendor and brought the FinOps tooling directly under Cloud ownership. I advocated for and secured four dedicated FinOps contractors, created a structured onboarding process where new team members shadowed my tasks before taking ownership, and established daily standups, WBRs, and MBRs to maintain accountability. I also embedded a cost-conscious mindset across engineering teams by surfacing cloud spend in higher leadership forums.',
    impact:
      'Hit the $1M annual savings goal in a single quarter — 3x ahead of schedule. FinOps evolved from a side function to a core part of Moderna\'s cloud strategy.',
    tags: ['leadership', 'finops', 'team-building', 'aws', 'cost-reduction'],
    relatedExperience: 'moderna-2023',
  },
  {
    id: 'moderna-tagging-automation',
    title: 'How did you get 80% cost attribution at Moderna?',
    problem:
      'Moderna had ~3,000 AWS resources spread across 130 accounts with inconsistent or missing cost tags. Without proper tagging, the FinOps team couldn\'t attribute spending to business units — making budgeting and accountability impossible.',
    solution:
      'I designed and built a Resource Tagging Control Plane that automatically audited, applied, and enforced tags across all accounts on a daily schedule. I also automated the cost attribution reporting pipeline using AWS Glue, Athena, and QuickSight, with validation checks to ensure data accuracy before surfacing results.',
    impact:
      'Achieved 80% cost attribution across 130 AWS accounts within 3 months. Reporting frequency improved from monthly to daily, and manual effort dropped by 80%.',
    tags: ['aws', 'finops', 'automation', 'cost-attribution', 'cloud'],
    relatedExperience: 'moderna-2023',
  },
  {
    id: 'apptio-kubernetes-migration',
    title: 'How did you migrate to Kubernetes with no prior experience?',
    problem:
      'At Apptio, the team was migrating our data ingestion pipeline from EC2 to a containerized Kubernetes architecture. I had no prior hands-on experience with Kubernetes or Docker, but I saw an opportunity and volunteered to own the migration.',
    solution:
      'I took online courses on Kubernetes and Docker to build foundational knowledge quickly, then learned on the fly by applying concepts directly to the project. One non-trivial challenge: replicating AWS EC2\'s Scale-in Protection behavior in Kubernetes — pods don\'t natively prevent termination during a running job. I researched how to use SIGINT signals in Kubernetes to prevent pods from being killed mid-job, and implemented a custom Kube-HPA solution. I delivered a working POC in the first sprint and completed the full migration in the second.',
    impact:
      'Successfully migrated the entire data pipeline to Kubernetes on time. The system gained better horizontal scalability and the SIGINT-based scale-in protection matched the reliability of the previous EC2 setup.',
    tags: ['kubernetes', 'docker', 'infrastructure', 'learning', 'data-pipelines'],
    relatedExperience: 'apptio-2020',
  },
  {
    id: 'apptio-aws-pipeline-recovery',
    title: 'Tell me about a time you recovered from a costly failure.',
    problem:
      'At Apptio, I was migrating cloud utilization data pipelines from a legacy system to a new orchestration-based architecture using AWS Step Functions. The Azure migration went smoothly, but a staging run for the AWS migration unexpectedly cost $10,000 — triggering alarms across the organization.',
    solution:
      'Rather than waiting for managerial guidance, I acted immediately. I diagnosed the root cause, revamped the pipeline design, and proactively added Spark-based processing — something not originally scoped — to address the underlying inefficiency. I made architectural decisions autonomously to prevent further financial risk and keep the project on track.',
    impact:
      'Resolved the issue and delivered the AWS migration within the original timeline. No further cost overruns. The Spark addition became a core part of the pipeline, ultimately contributing to a 30% reduction in overall pipeline costs.',
    tags: ['aws', 'data-pipelines', 'failure-recovery', 'bias-for-action', 'spark'],
    relatedExperience: 'apptio-2020',
  },
  {
    id: 'purenav-react-native',
    title: 'How did you push back on a bad technical decision?',
    problem:
      'During my MS research project, the plan for PureNav — a navigation app optimizing routes for air and noise quality — was to build separate native apps for Android and iOS. I believed this was the wrong approach: it doubled development effort, required two developers, and created long-term maintenance overhead.',
    solution:
      'I researched cross-platform alternatives, compared React Native vs. Flutter in depth, and built a case for React Native based on community size, stability, and adoption by major companies. I presented this to my advisor and team, convinced them to change direction, and led the implementation in React Native — a framework I had to learn as part of this decision.',
    impact:
      'Development effort reduced by 50% — one developer instead of two. Faster iteration cycles, a single codebase to maintain, and full iOS + Android coverage from day one.',
    tags: ['react-native', 'mobile', 'technical-decision', 'leadership', 'research'],
    relatedExperience: 'sjeq-2022',
  },
  {
    id: 'purenav-slack-integration',
    title: 'How did you turn around poor user engagement?',
    problem:
      'PureNav users were satisfied with our routing recommendations but frustrated with the app experience itself. Competing with Google Maps and Apple Maps on UX was not a battle we could win. Daily active users were stuck at 10 and engagement was declining.',
    solution:
      'I recognized we were building in the wrong space. Since participants were already using Slack daily for another part of the study (PureConnect), I proposed integrating PureNav directly into Slack. We built a Slack app that surfaced navigation details within the user\'s existing workflow and added a chatbot for follow-up queries — removing the need to switch apps entirely.',
    impact:
      'Daily active users grew from 10 to 50. Slack analytics gave us richer behavioral data than before. Customer satisfaction surveys turned positive, and the intervention was statistically validated as part of the published MS thesis.',
    tags: ['user-research', 'product-thinking', 'slack', 'mobile', 'engagement'],
    relatedExperience: 'sjeq-2022',
  },
  {
    id: 'helixcloud-finops-pipelines',
    title: 'Tell me about a side project you built for a real customer.',
    problem:
      'A former colleague reached out needing help with cost attribution on AWS — they were evaluating third-party FinOps tools but wanted to understand whether a custom data pipeline solution was viable. I took this on as a personal project to solve a real customer problem.',
    solution:
      'I designed and built three tiered pipeline architectures tailored to different data volumes: a lightweight stack (S3 + Athena + QuickSight) for small-scale attribution, a mid-tier stack (Glue + RDS + Stored Procedures) for medium workloads, and a heavy stack (Glue + Redshift + Materialized Views) for large-scale reporting. Each was built to be cost-effective and easy to operate without a dedicated data team.',
    impact:
      'Delivered working pipelines across all three tiers. The customer gained accurate cost attribution without committing to an expensive third-party tool, and came away with a reusable architecture they could maintain independently.',
    tags: ['aws', 'finops', 'data-pipelines', 'side-project', 'cost-attribution'],
    relatedExperience: null,
  },
  {
    id: 'moderna-vendor-elimination',
    title: 'How did you eliminate a vendor and own it yourself?',
    problem:
      'Moderna was paying a third-party vendor for FinOps recommendations that amounted to little more than surface-level analysis from a tool the company already licensed. The arrangement was expensive, created external dependency, and blocked us from doing deeper optimization work.',
    solution:
      'I documented the gap between vendor output and actual business value, presented a data-driven justification to leadership, and advocated for full internal ownership. I transitioned the licensed FinOps tool directly under Cloud, developed internal workflows, and established accountability through standups, WBRs, MBRs, and shared program metrics in leadership forums.',
    impact:
      'Eliminated the vendor entirely. Internal ownership gave us faster iteration, deeper analysis, and full control over our FinOps strategy — ultimately contributing to $1M in savings in a single quarter.',
    tags: ['finops', 'vendor-management', 'leadership', 'aws', 'ownership'],
    relatedExperience: 'moderna-2023',
  },
];
