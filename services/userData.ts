import * as SecureStore from "expo-secure-store";
import { getDecisionLogs, clearDecisionLogs } from "@/packages/db/schemas/DecisionLog";
import {
  getDataAccessLogs,
  clearDataAccessLogs,
  logDataAccess,
} from "@/packages/db/schemas/DataAccessLog";
import { getChatLogs, clearChatLogs, purgeOldChatLogs } from "@/packages/db/schemas/ChatLog";
import { getPassportCountry } from "@/services/passport";

const PASSPORT_KEY = "passportCountry";

export const exportUserData = async (userId?: string) => {
  purgeOldChatLogs();
  const data = {
    passportCountry: await getPassportCountry(),
    decisions: getDecisionLogs(),
    access: getDataAccessLogs(),
    chats: getChatLogs(),
  };
  logDataAccess({
    id: Date.now().toString(),
    actor: userId || "local-user",
    resource: "userData",
    action: "export",
    timestamp: new Date(),
  });
  return data;
};

export const deleteUserData = async (userId?: string) => {
  await SecureStore.deleteItemAsync(PASSPORT_KEY);
  clearDecisionLogs();
  clearDataAccessLogs();
  clearChatLogs();
  logDataAccess({
    id: Date.now().toString(),
    actor: userId || "local-user",
    resource: "userData",
    action: "delete",
    timestamp: new Date(),
  });
};
