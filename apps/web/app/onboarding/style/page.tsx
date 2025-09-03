"use client";

import { useState } from "react";
import { TravelerProfile } from "@/packages/db/schemas/TravelerProfile";

const defaultProfile: TravelerProfile = {
  tempo: "zen",
  morningness: 0.5,
  budgetComfort: "budget",
  foodPrefs: [],
  mobility: "medium",
  kids: false,
  accessibility: "none",
};

export default function StyleQuiz() {
  const [profile, setProfile] = useState<TravelerProfile>(defaultProfile);

  const update = (field: keyof TravelerProfile, value: any) => {
    setProfile({ ...profile, [field]: value });
  };

  const save = async () => {
    await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile }),
    });
    alert("Saved!");
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="block">Tempo</label>
        <select
          value={profile.tempo}
          onChange={(e) => update("tempo", e.target.value)}
          className="border p-2"
        >
          <option value="zen">Zen</option>
          <option value="explorer">Explorer</option>
        </select>
      </div>
      <div>
        <label className="block">Morningness ({profile.morningness.toFixed(1)})</label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={profile.morningness}
          onChange={(e) => update("morningness", parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label className="block">Budget Comfort</label>
        <select
          value={profile.budgetComfort}
          onChange={(e) => update("budgetComfort", e.target.value)}
          className="border p-2"
        >
          <option value="budget">Budget</option>
          <option value="comfort">Comfort</option>
          <option value="luxury">Luxury</option>
        </select>
      </div>
      <div>
        <label className="block">Food Preferences (comma separated)</label>
        <input
          type="text"
          value={profile.foodPrefs.join(",")}
          onChange={(e) => update("foodPrefs", e.target.value.split(","))}
          className="border p-2 w-full"
        />
      </div>
      <div>
        <label className="block">Mobility</label>
        <select
          value={profile.mobility}
          onChange={(e) => update("mobility", e.target.value)}
          className="border p-2"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={profile.kids}
          onChange={(e) => update("kids", e.target.checked)}
        />
        <span>Traveling with kids</span>
      </div>
      <div>
        <label className="block">Accessibility Needs</label>
        <select
          value={profile.accessibility}
          onChange={(e) => update("accessibility", e.target.value)}
          className="border p-2"
        >
          <option value="none">None</option>
          <option value="limited">Limited</option>
          <option value="full">Full</option>
        </select>
      </div>
      <button className="border px-4 py-2" onClick={save}>
        Save
      </button>
    </div>
  );
}
