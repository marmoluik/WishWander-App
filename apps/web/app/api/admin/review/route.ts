import { NextResponse } from "next/server";
import { getPendingActions } from "../../../../packages/db/schemas/PendingAction";

export async function GET() {
  const items = getPendingActions();
  return NextResponse.json(items);
}
