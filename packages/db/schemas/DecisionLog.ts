export interface DecisionLog {
  id: string;
  action: string;
  allowed: boolean;
  rationale: string;
  timestamp: Date;
  payload?: any;
  approvedBy?: string;
}

const decisionLogs: DecisionLog[] = [];

export const logDecision = (entry: DecisionLog) => {
  if (entry.payload) {
    delete (entry.payload as any).passportId;
    delete (entry.payload as any).passportNumber;
  }
  decisionLogs.push(entry);
};

export const getDecisionLogs = () => decisionLogs;

export const clearDecisionLogs = () => {
  decisionLogs.length = 0;
};
