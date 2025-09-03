export interface PlanningRequest {
  dates: {
    start: string;
    end: string;
  };
  budget: string;
  party: string;
  style: string;
  mustDos: string;
}
