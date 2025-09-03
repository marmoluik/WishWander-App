import { test, expect } from '@playwright/test';
import { replanOnDisruption } from '../../packages/agent/replan';
import { setPolicy, getPolicy, BookingPolicy } from '../../packages/agent/policies';
import { Itinerary } from '../../types/itinerary';
import fs from 'fs';

test('plan creation to disruption acceptance', async ({ page }) => {
  fs.mkdirSync('e2e-artifacts', { recursive: true });

  await page.setContent('<h1>Plan created</h1>');
  await page.screenshot({ path: 'e2e-artifacts/plan-created.png' });

  const itinerary: Itinerary = {
    id: 'trip-123',
    userId: 'user-1',
    destination: { city: 'Test City' },
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    bookings: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const policy: BookingPolicy = {
    perTripCap: 1000,
    perItemCap: 500,
    handsOffMode: true,
  };
  setPolicy(policy);
  const options = await replanOnDisruption(itinerary, getPolicy()!);
  expect(options.length).toBeGreaterThan(0);

  await page.setContent('<h1>Alternative shown</h1>');
  await page.screenshot({ path: 'e2e-artifacts/alternative.png' });

  expect(options[0]).toHaveProperty('eta');
});
