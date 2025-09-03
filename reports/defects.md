# Defects

## Simulation Scripts Require Cycle
- Severity: low
- Repro: `pnpm sim:disruption` or `pnpm sim:weather`
- Expected: mock data generated
- Actual: Node ERR_REQUIRE_CYCLE_MODULE prevents execution

## Mobile E2E Skipped
- Severity: medium
- Reason: no mobile simulator available; tests not executed

