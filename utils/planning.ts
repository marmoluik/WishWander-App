import { PlanningRequest } from "@/types/planning";

export const planningRequestToPrompt = (req: PlanningRequest) => {
  const parts = [
    req.party ? `Plan a trip for ${req.party}` : "Plan a trip",
  ];
  if (req.dates.start && req.dates.end) {
    parts.push(`from ${req.dates.start} to ${req.dates.end}`);
  }
  if (req.budget) {
    parts.push(`with a ${req.budget} budget`);
  }
  if (req.style) {
    parts.push(`in a ${req.style} style`);
  }
  if (req.mustDos) {
    parts.push(`including must-do activities like ${req.mustDos}`);
  }
  return parts.join(" ") + ".";
};

export const planningRequestToQuery = (req: PlanningRequest) => {
  const params = new URLSearchParams({
    start: req.dates.start || "",
    end: req.dates.end || "",
    budget: req.budget || "",
    party: req.party || "",
    style: req.style || "",
    mustDos: req.mustDos || "",
  });
  return params.toString();
};

export const queryToPlanningRequest = (
  params: URLSearchParams
): PlanningRequest => {
  return {
    dates: { start: params.get("start") || "", end: params.get("end") || "" },
    budget: params.get("budget") || "",
    party: params.get("party") || "",
    style: params.get("style") || "",
    mustDos: params.get("mustDos") || "",
  };
};
