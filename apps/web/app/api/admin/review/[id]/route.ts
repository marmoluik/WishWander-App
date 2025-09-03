import { NextRequest, NextResponse } from "next/server";
import {
  approveAction,
  rejectAction,
} from "../../../../../packages/db/schemas/PendingAction";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const user = body.user || "admin";
  if (body.action === "approve") {
    approveAction(params.id, user);
  } else {
    rejectAction(params.id, user);
  }
  return NextResponse.json({ success: true });
}
