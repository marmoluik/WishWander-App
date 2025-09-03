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
  decisionLogs.push(entry);
};

export const getDecisionLogs = () => decisionLogs;
