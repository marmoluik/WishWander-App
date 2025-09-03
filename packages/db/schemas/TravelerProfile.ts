export interface TravelerProfile {
  tempo: "zen" | "explorer" | string;
  /** 0 = night owl, 1 = early bird */
  morningness: number;
  budgetComfort: string;
  foodPrefs: string[];
  mobility: string;
  kids: boolean;
  accessibility: string;
}

const profiles: Record<string, TravelerProfile> = {};

export const setTravelerProfile = (tripId: string, profile: TravelerProfile) => {
  profiles[tripId] = profile;
};

export const getTravelerProfile = (tripId: string): TravelerProfile | undefined =>
  profiles[tripId];
