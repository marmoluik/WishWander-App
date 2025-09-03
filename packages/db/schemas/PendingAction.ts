import { logDecision } from "./DecisionLog";

export interface PendingAction {
  id: string;
  action: string;
  reason: string;
  policyDeltas?: Record<string, any>;
  payload?: any;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
}

const queue: PendingAction[] = [];

export const addPendingAction = (entry: PendingAction) => {
  queue.push(entry);
};

export const getPendingActions = () =>
  queue.filter((a) => a.status === "pending");

export const approveAction = (id: string, user: string) => {
  const action = queue.find((a) => a.id === id);
  if (action) {
    action.status = "approved";
    action.approvedBy = user;
    action.approvedAt = new Date();
    logDecision({
      id: action.id,
      action: action.action,
      allowed: true,
      rationale: action.reason,
      timestamp: action.approvedAt,
      payload: action.payload,
      approvedBy: user,
    });
  }
};

export const rejectAction = (id: string, user: string) => {
  const action = queue.find((a) => a.id === id);
  if (action) {
    action.status = "rejected";
    action.approvedBy = user;
    action.approvedAt = new Date();
    logDecision({
      id: action.id,
      action: action.action,
      allowed: false,
      rationale: action.reason,
      timestamp: action.approvedAt,
      payload: action.payload,
      approvedBy: user,
    });
  }
};
