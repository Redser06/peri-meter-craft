export interface CaseStudyExercise {
  id: string;
  trackId: string;
  title: string;
  legacyStory: string;
  legacyFlaw: string;
  aiPmContract: {
    endpoint: string;
    schemaExample: Record<string, unknown>;
    propertyInvariant: string;
  };
}

export const PRD_CASE_STUDIES: CaseStudyExercise[] = [
  {
    id: 'cs-01-audit-export',
    trackId: '02',
    title: 'Enterprise Audit Log Bulk Export',
    legacyStory: 'As an enterprise administrator, I want to bulk-export audit logs so that I can comply with quarterly security reviews.',
    legacyFlaw: 'Ambiguous throughput limits, no error payload contract, undefined pagination, and unverified data boundaries.',
    aiPmContract: {
      endpoint: 'POST /v1/audit/exports',
      schemaExample: {
        timeRange: { start: '2026-01-01T00:00:00Z', end: '2026-03-31T23:59:59Z' },
        format: 'parquet',
        filter: { eventTypes: ['auth.login', 'auth.failed', 'role.change'] },
      },
      propertyInvariant: 'Idempotency: calling with the same idempotency_key returns identical job_id with 0 duplicate exports.',
    },
  },
  {
    id: 'cs-02-synthetic-validation',
    trackId: '01',
    title: 'High-Volume Customer Intent Verification',
    legacyStory: 'As a shopper, I want real-time price-drop alerts so that I can save money.',
    legacyFlaw: 'Assumes alerts drive conversion without validating notification fatigue or willingness-to-buy thresholds.',
    aiPmContract: {
      endpoint: 'POST /v1/simulation/cohort-response',
      schemaExample: {
        cohortSize: 200,
        priceDeltaPct: -0.15,
        notificationFrequency: 'daily',
      },
      propertyInvariant: 'Monotonicity: response rate must be non-decreasing with discount magnitude across identical persona priors.',
    },
  },
];
