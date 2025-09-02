"use client";

import { useEffect, useState } from "react";
import { BookingPolicy } from "../../../../packages/agent/policies";

export default function AutomationSettings() {
  const [policy, setPolicy] = useState<BookingPolicy>({
    perTripCap: 0,
    perItemCap: 0,
    earliestDeparture: "",
    latestDeparture: "",
    handsOffMode: false,
  });

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/automation/policy");
      if (res.ok) {
        const data = await res.json();
        setPolicy({
          perTripCap: data.perTripCap || 0,
          perItemCap: data.perItemCap || 0,
          earliestDeparture: data.earliestDeparture || "",
          latestDeparture: data.latestDeparture || "",
          handsOffMode: data.handsOffMode || false,
        });
      }
    };
    load();
  }, []);

  const savePolicy = async () => {
    await fetch("/api/automation/policy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(policy),
    });
  };

  return (
    <div className="space-y-4 p-4">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={policy.handsOffMode}
          onChange={(e) =>
            setPolicy({ ...policy, handsOffMode: e.target.checked })
          }
        />
        <span>Hands-Off Mode</span>
      </label>

      <div>
        <label className="block">Per-trip Cap (${policy.perTripCap})</label>
        <input
          type="range"
          min={0}
          max={10000}
          value={policy.perTripCap}
          onChange={(e) =>
            setPolicy({ ...policy, perTripCap: parseInt(e.target.value, 10) })
          }
        />
      </div>

      <div>
        <label className="block">Per-item Cap (${policy.perItemCap})</label>
        <input
          type="range"
          min={0}
          max={5000}
          value={policy.perItemCap}
          onChange={(e) =>
            setPolicy({ ...policy, perItemCap: parseInt(e.target.value, 10) })
          }
        />
      </div>

      <div className="space-y-2">
        <label className="block">Earliest Departure</label>
        <input
          type="datetime-local"
          value={policy.earliestDeparture}
          onChange={(e) =>
            setPolicy({ ...policy, earliestDeparture: e.target.value })
          }
        />
        <label className="block">Latest Departure</label>
        <input
          type="datetime-local"
          value={policy.latestDeparture}
          onChange={(e) =>
            setPolicy({ ...policy, latestDeparture: e.target.value })
          }
        />
      </div>

      <button className="border px-4 py-2" onClick={savePolicy}>
        Save
      </button>
    </div>
  );
}
