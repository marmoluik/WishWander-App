import { startChatSession } from "@/config/GeminiConfig";
import {
  functionDeclarations,
  executeAgentFunction,
  TravelFunctionName,
} from "@/utils/agentFunctions";
import { UserPreferences } from "@/types/user";

/**
 * runTravelAgent
 * Given a natural language prompt, this helper will run a Gemini chat session
 * with tool/function calling enabled. When the model requests a function, we
 * execute it and feed the result back, allowing the LLM to build richer answers.
 */
export const runTravelAgent = async (
  prompt: string,
  prefs?: UserPreferences
) => {
  const prefParts: string[] = [];
  if (prefs?.budget) prefParts.push(`budget up to $${prefs.budget}`);
  if (prefs?.preferredAirlines?.length)
    prefParts.push(`preferred airlines: ${prefs.preferredAirlines.join(", ")}`);
  if (prefs?.preferredHotels?.length)
    prefParts.push(`preferred hotels: ${prefs.preferredHotels.join(", ")}`);
  if (prefs?.dietaryNeeds?.length)
    prefParts.push(`dietary needs: ${prefs.dietaryNeeds.join(", ")}`);
  if (prefs?.petFriendly) prefParts.push("pet friendly");
  const prefPrompt = prefParts.length
    ? `${prompt}\nPreferences: ${prefParts.join(", ")}`
    : prompt;

  const session = startChatSession(
    [{ role: "user", parts: [{ text: prefPrompt }] }],
    "gemini-1.5-flash",
    { functionDeclarations }
  );

  // initial response from the model
  let result = await session.sendMessage(prompt);
  let { response } = result;

  while (response.functionCalls && response.functionCalls.length > 0) {
    for (const call of response.functionCalls) {
      const name = call.name as TravelFunctionName;
      const args = call.args ? JSON.parse(call.args) : {};
      const fnResult = await executeAgentFunction(name, args, prefs);
      result = await session.sendMessage({
        functionCall: call,
        functionResponse: { name, response: fnResult },
      } as any);
      response = result.response;
    }
  }
  return response.text();
};
