import { getForecast } from "../providers/weather";

export interface ActivitySlot {
  name: string;
  indoor: boolean;
}

export interface DayPlan {
  day: number;
  date: string; // ISO date
  schedule: {
    morning?: ActivitySlot;
    afternoon?: ActivitySlot;
    evening?: ActivitySlot;
    night?: ActivitySlot;
  };
}

export interface SwapSuggestion {
  fromDay: number;
  fromSlot: keyof DayPlan["schedule"];
  toDay: number;
  toSlot: keyof DayPlan["schedule"];
  reason: string;
}

const slotHour: Record<keyof DayPlan["schedule"], number> = {
  morning: 9,
  afternoon: 14,
  evening: 18,
  night: 21,
};

/**
 * Analyse the next 48 hours and propose swaps of outdoor activities with
 * later indoor ones when rain is forecast.
 */
export const suggestWeatherSwaps = async (
  plan: DayPlan[],
  lat: number,
  lng: number
): Promise<SwapSuggestion[]> => {
  const now = new Date();
  const horizon = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  const dates: Date[] = [];
  plan.forEach((d) => {
    const dt = new Date(d.date);
    if (dt <= horizon) dates.push(dt);
  });
  if (!dates.length) return [];
  const forecast = await getForecast(lat, lng, dates);
  const forecastMap = new Map<string, number>();
  forecast.forEach((h) => forecastMap.set(h.time, h.precipitation));

  const suggestions: SwapSuggestion[] = [];
  for (let i = 0; i < plan.length; i++) {
    const day = plan[i];
    const dayDate = new Date(day.date);
    if (dayDate > horizon) continue;
    (Object.keys(slotHour) as (keyof DayPlan["schedule"])[]).forEach((slot) => {
      const activity = day.schedule[slot];
      if (!activity || activity.indoor) return;
      const hour = slotHour[slot];
      const slotTime = new Date(dayDate.getTime() + hour * 3600 * 1000)
        .toISOString()
        .slice(0, 13) + ":00";
      const precip = forecastMap.get(slotTime) || 0;
      if (precip < 50) return; // only worry if >=50% chance of rain
      for (let j = i + 1; j < plan.length; j++) {
        const other = plan[j];
        const indoorSlot = (Object.keys(slotHour) as (keyof DayPlan["schedule"])[]).find(
          (s) => other.schedule[s]?.indoor
        );
        if (indoorSlot) {
          suggestions.push({
            fromDay: day.day,
            fromSlot: slot,
            toDay: other.day,
            toSlot: indoorSlot,
            reason: `Rain expected at ${slotTime.slice(11, 16)}`,
          });
          break;
        }
      }
    });
  }
  return suggestions;
};
