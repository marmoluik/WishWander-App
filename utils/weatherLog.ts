export const weatherLog: string[] = [];

export const logWeatherAdjustment = (entry: string) => {
  weatherLog.push(`${Date.now()}:${entry}`);
};
