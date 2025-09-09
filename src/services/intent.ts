export type Intent =
  | { type: 'shiftDates'; days: number }
  | { type: 'capBudget'; amount: number }
  | { type: 'replaceActivity'; day: number; activity: string }
  | { type: 'flexibleDays'; min: number; max: number };

/**
 * parseIntent
 * Very small natural language parser for a handful of commands.
 */
export function parseIntent(text: string): Intent | undefined {
  const shift = text.match(/shift\s+dates\s*([+-]?\d+)d/i);
  if (shift) {
    return { type: 'shiftDates', days: parseInt(shift[1], 10) };
  }
  const budget = text.match(/budget\s*[<≤]\s*€?(\d+)/i);
  if (budget) {
    return { type: 'capBudget', amount: parseInt(budget[1], 10) };
  }
  const replace = text.match(/replace\s+day\s*(\d+)\s*(.*)/i);
  if (replace) {
    return { type: 'replaceActivity', day: parseInt(replace[1], 10), activity: replace[2].trim() };
  }
  const flex = text.match(/(\d+)\s*[–-]\s*(\d+)\s*days/i);
  if (flex) {
    return { type: 'flexibleDays', min: parseInt(flex[1], 10), max: parseInt(flex[2], 10) };
  }
  return undefined;
}
