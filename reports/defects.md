# Defects

## TypeScript Errors
- Severity: high
- Repro: run `pnpm tsc --noEmit`
- Expected: typecheck passes
- Actual: multiple missing modules and type errors (see reports/static/typecheck.log)

## Build Script Missing
- Severity: medium
- Repro: run `pnpm build`
- Expected: project builds
- Actual: script not found

## Mobile E2E Fails
- Severity: high
- Repro: run `pnpm test:e2e:mobile`
- Expected: tests execute
- Actual: Babel syntax error in packages/notify

## Accessibility Tool Missing Browser
- Severity: medium
- Repro: `npx @axe-core/cli https://example.com`
- Expected: report generated
- Actual: Chrome binary missing
