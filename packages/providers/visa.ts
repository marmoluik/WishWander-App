export interface VisaRule {
  /** Short summary like "visa-free up to 90 days" */
  summary: string;
  /** Optional URL to official source */
  url?: string;
}

// Minimal data for demo purposes
const schengen = new Set([
  "AT","BE","CZ","DE","DK","EE","ES","FI","FR","GR","HU",
  "IS","IT","LI","LT","LU","LV","MT","NL","NO","PL","PT",
  "SE","SI","SK","CH"
]);

/**
 * Determine visa rules based on passport and destination country codes.
 * Returns a friendly summary or a generic message if unknown.
 */
export const getVisaRules = async (
  passport: string,
  destination: string,
  _dates: Date[]
): Promise<VisaRule> => {
  // Example: Schengen area passport holder visiting Japan
  if (destination === "JP" && schengen.has(passport)) {
    return {
      summary: "visa-free up to 90 days",
      url: "https://www.mofa.go.jp/j_info/visit/visa/short/novisa.html",
    };
  }

  return {
    summary: "Verify requirements",
    url: "https://www.iatatravelcentre.com/",
  };
};
