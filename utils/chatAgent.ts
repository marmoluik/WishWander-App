import { startChatSession } from "@/config/GeminiConfig";
import {
  functionDeclarations,
  executeAgentFunction,
  TravelFunctionName,
} from "@/utils/agentFunctions";
import { addChatLog } from "@/packages/db/schemas/ChatLog";

/**
 * runTravelAgent
 * Given a natural language prompt, this helper will run a Gemini chat session
 * with tool/function calling enabled. When the model requests a function, we
 * execute it and feed the result back, allowing the LLM to build richer answers.
 */
export const runTravelAgent = async (prompt: string) => {
  const session = startChatSession(
    [{ role: "user", parts: [{ text: prompt }] }],
    "gemini-1.5-flash",
    { functionDeclarations },
    { tripMode: true }
  );

  // initial response from the model
  let result = await session.sendMessage(prompt);
  let { response } = result;

  while (response.functionCalls && response.functionCalls.length > 0) {
    for (const call of response.functionCalls) {
      const name = call.name as TravelFunctionName;
      const args = call.args ? JSON.parse(call.args) : {};
      const fnResult = await executeAgentFunction(name, args);
      result = await session.sendMessage({
        functionCall: call,
        functionResponse: { name, response: fnResult },
      } as any);
      response = result.response;
    }
  }
  const reply = response.text();
  addChatLog({
    id: Date.now().toString(),
    userPrompt: prompt,
    agentResponse: reply,
    summary: reply,
    timestamp: new Date(),
  });
  return reply;
};
