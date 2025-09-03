export enum EventType {
  PLAN_CREATED = 'PLAN_CREATED',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  DISRUPTION_DETECTED = 'DISRUPTION_DETECTED',
  REPLAN_APPLIED = 'REPLAN_APPLIED',
}

export interface MetricEvent {
  type: EventType;
  timestamp: number; // unix ms
  metadata?: Record<string, any>;
}
