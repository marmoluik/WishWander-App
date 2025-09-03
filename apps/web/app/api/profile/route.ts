import { NextRequest, NextResponse } from "next/server";
import {
  getTravelerProfile,
  setTravelerProfile,
  TravelerProfile,
} from "@/packages/db/schemas/TravelerProfile";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tripId = searchParams.get("tripId") || "default";
  const profile = getTravelerProfile(tripId);
  return NextResponse.json(profile || {});
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    tripId?: string;
    profile: TravelerProfile;
  };
  const tripId = body.tripId || "default";
  setTravelerProfile(tripId, body.profile);
  return NextResponse.json({ success: true });
}
