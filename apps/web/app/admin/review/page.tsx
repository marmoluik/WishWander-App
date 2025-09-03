"use client";

import { useEffect, useState } from "react";

interface PendingAction {
  id: string;
  action: string;
  reason: string;
  policyDeltas?: Record<string, any>;
  payload?: any;
}

export default function ReviewPage() {
  const [actions, setActions] = useState<PendingAction[]>([]);

  const load = async () => {
    const res = await fetch("/api/admin/review");
    if (res.ok) {
      const data = await res.json();
      setActions(data);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const decide = async (id: string, decision: "approve" | "reject") => {
    await fetch(`/api/admin/review/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: decision, user: "admin" }),
    });
    load();
  };

  return (
    <div className="p-4 space-y-4">
      {actions.map((a) => (
        <div key={a.id} className="border p-2 space-y-2">
          <div>Action: {a.action}</div>
          <div>Reason: {a.reason}</div>
          {a.policyDeltas && (
            <pre className="text-xs bg-gray-100 p-1">
              {JSON.stringify(a.policyDeltas, null, 2)}
            </pre>
          )}
          <div className="space-x-2">
            <button
              className="border px-2 py-1"
              onClick={() => decide(a.id, "approve")}
            >
              Approve
            </button>
            <button
              className="border px-2 py-1"
              onClick={() => decide(a.id, "reject")}
            >
              Reject
            </button>
          </div>
        </div>
      ))}
      {actions.length === 0 && <div>No pending actions.</div>}
    </div>
  );
}
