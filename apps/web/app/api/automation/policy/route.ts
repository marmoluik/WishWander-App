import { NextRequest, NextResponse } from "next/server";
import {
  getPolicy,
  setPolicy,
  BookingPolicy,
} from "../../../../packages/agent/policies";

export async function GET() {
  const policy = getPolicy();
  return NextResponse.json(policy || {});
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as BookingPolicy;
  setPolicy(body);
  return NextResponse.json({ success: true });
}
