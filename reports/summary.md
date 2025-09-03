# QA Summary

## Static Checks
- Install: pass
- Lint: pass with warnings
- Typecheck: pass
- Build: pass

## E2E Tests
- Web: pass
- Mobile: skipped (no simulator)

## Accessibility
- Axe via Playwright: pass (see log)

## Feature Coverage

| Feature | Routes | Status | Evidence |
| --- | --- | --- | --- |
| handsOffMode | `/settings/automation` | not tested | - |
| replanDisruption | `/plan/new` | pass | [web-e2e/test.log](../web-e2e/test.log) |
| weatherAwareAdjustments | `/plan/new` | not tested | - |
| onTripChatActions | `/plan/chat` | not tested | - |
| travelerProfiles | `/onboarding/style` | not tested | - |
| hybridChatForm | `/plan/new`, `/plan/chat` | not tested | - |
| co2Sorting | `/discover` | not tested | - |
| visaAndSafety | `/preflight` | not tested | - |
| conciergeCheckout | `/api/billing/checkout` | not tested | - |
| adminHumanLoop | `/admin/review` | not tested | - |
| notifications | _n/a_ | not tested | - |
| providerAbstractions | _n/a_ | not tested | - |
| privacy | `/api/profile` | not tested | - |
| metrics | `/packages/metrics` | not tested | - |
| testHarness | `/tools/simulate` | failing | see defects |

## Notes
Logs and artifacts are stored in subdirectories under `reports/`.
