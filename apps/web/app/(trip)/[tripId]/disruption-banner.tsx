"use client";

import { useEffect } from "react";
import type { ReplanOption } from "../../../../../packages/agent/replan";

interface Props {
  options: ReplanOption[];
  onSelect(option: ReplanOption): void;
}

/**
 * Banner shown when a flight is disrupted. Presents alternative options and
 * auto-applies any that meet policy.
 */
export default function DisruptionBanner({ options, onSelect }: Props) {
  const auto = options.find((o) => o.autoApply);

  useEffect(() => {
    if (auto) {
      onSelect(auto);
    }
  }, [auto, onSelect]);

  if (options.length === 0) return null;

  return (
    <div className="bg-yellow-100 p-4 space-y-2">
      <p className="font-bold">Flight disruption detected</p>
      {options.map((o, idx) => (
        <button
          key={idx}
          className="block w-full border p-2 bg-white"
          onClick={() => onSelect(o)}
        >
          ETA +{o.eta}m, Δ${o.costDelta}
          {typeof o.co2 === "number" && `, CO₂ ${o.co2}kg`}
        </button>
      ))}
    </div>
  );
}
