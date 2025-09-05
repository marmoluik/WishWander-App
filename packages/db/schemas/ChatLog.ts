export interface ChatLog {
  id: string;
  userPrompt?: string;
  agentResponse?: string;
  summary: string;
  timestamp: Date;
  tripId?: string;
}

const chatLogs: ChatLog[] = [];

export const addChatLog = (entry: ChatLog) => {
  chatLogs.push(entry);
  purgeOldChatLogs();
};

export const getChatLogs = () => chatLogs;

export const purgeOldChatLogs = () => {
  const cutoff = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
  for (const log of chatLogs) {
    if (log.timestamp < cutoff) {
      log.userPrompt = undefined;
      log.agentResponse = undefined;
    }
  }
};

export const clearChatLogs = () => {
  chatLogs.length = 0;
};
