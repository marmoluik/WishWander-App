import { TravelerProfile } from "../db/schemas/TravelerProfile";
import { DayPlan } from "../../context/ItineraryContext";

interface ScoredSlot {
  slot: keyof DayPlan["schedule"];
  activity: NonNullable<DayPlan["schedule"][keyof DayPlan["schedule"]]>;
  score: number;
}

const slotHour: Record<keyof DayPlan["schedule"], number> = {
  morning: 9,
  afternoon: 14,
  evening: 18,
  night: 21,
};

export const scoreActivity = (
  profile: TravelerProfile,
  startHour: number,
  transport: string
) => {
  let score = 0;
  if (profile.tempo === "explorer") score += 1;
  if (profile.tempo === "zen") score -= 1;
  if (profile.morningness < 0.5 && startHour < 10) score -= 1;
  if (profile.morningness > 0.5 && startHour > 10) score -= 0.5;
  if (profile.mobility === "low" && transport === "walk") score -= 1;
  return score;
};

/**
 * Apply traveler profile preferences to a tentative plan by scoring each slot
 * and keeping the best matches.
 */
export const applyProfileToPlan = (
  plan: DayPlan[],
  profile: TravelerProfile
): DayPlan[] => {
  return plan.map((day) => {
    const scored: ScoredSlot[] = [];
    (Object.keys(slotHour) as (keyof DayPlan["schedule"])[]).forEach((slot) => {
      const activity = day.schedule[slot];
      if (!activity) return;
      const start = slotHour[slot];
      const score = scoreActivity(profile, start, "walk");
      scored.push({ slot, activity, score });
    });
    scored.sort((a, b) => b.score - a.score);
    let keep = scored;
    if (profile.tempo === "zen") {
      keep = scored.slice(0, 2); // fewer items
    }
    const schedule: DayPlan["schedule"] = {};
    keep.forEach((s) => {
      schedule[s.slot] = s.activity;
    });
    return { ...day, schedule };
  });
};
