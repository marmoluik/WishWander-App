import { NextRequest, NextResponse } from 'next/server';
import { getTrip } from '@/packages/db/schemas/Trip';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tripId = searchParams.get('tripId');
  if (!tripId) {
    return NextResponse.json({ error: 'tripId required' }, { status: 400 });
  }
  const trip = getTrip(tripId) || { conciergeActive: false, priority: 'standard' };
  return NextResponse.json(trip);
}
