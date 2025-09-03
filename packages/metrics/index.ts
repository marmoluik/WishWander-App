import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventType, MetricEvent } from './events';

const STORAGE_KEY = 'metrics_events';
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

async function getStoredEvents(): Promise<MetricEvent[]> {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch {
    return [];
  }
}

async function saveEvents(events: MetricEvent[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (e) {
    console.warn('Failed to persist metric event', e);
  }
}

export async function emitEvent(type: EventType, metadata?: Record<string, any>) {
  const event: MetricEvent = { type, timestamp: Date.now(), metadata };
  const events = await getStoredEvents();
  const cutoff = Date.now() - THIRTY_DAYS;
  const recent = events.filter(e => e.timestamp >= cutoff);
  recent.push(event);
  await saveEvents(recent);
}

export async function getEvents(): Promise<MetricEvent[]> {
  const events = await getStoredEvents();
  const cutoff = Date.now() - THIRTY_DAYS;
  return events.filter(e => e.timestamp >= cutoff);
}

export { EventType } from './events';
export type { MetricEvent };

export const Metrics = {
  planCreated: (metadata?: Record<string, any>) => emitEvent(EventType.PLAN_CREATED, metadata),
  bookingConfirmed: (metadata?: Record<string, any>) => emitEvent(EventType.BOOKING_CONFIRMED, metadata),
  disruptionDetected: (metadata?: Record<string, any>) => emitEvent(EventType.DISRUPTION_DETECTED, metadata),
  replanApplied: (metadata?: Record<string, any>) => emitEvent(EventType.REPLAN_APPLIED, metadata),
};
