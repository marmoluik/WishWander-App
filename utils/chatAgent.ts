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
export const runTravelAgent = async (prompt: string, tripId?: string) => {
  const session = startChatSession(
    [{ role: "user", parts: [{ text: prompt }] }],
    "gemini-1.5-flash",
    [{ functionDeclarations } as any],
    { tripMode: true, tripId }
  );

  // initial response from the model
  let result = await session.sendMessage(prompt);
  let { response } = result;

  // Some responses may not include any function calls. The previous implementation
  // attempted to read `.length` on the result of `functionCalls()` without verifying
  // it was defined, which caused a runtime error and surfaced the message
  // "Cannot read property 'length' of undefined" in the UI. We guard against
  // undefined here by retrieving the calls once and checking for existence before
  // accessing `.length`.
  let calls = (response as any).functionCalls?.() || [];
  while (calls.length > 0) {
    for (const call of calls) {
      const name = call.name as TravelFunctionName;
      const args = call.args ? JSON.parse(call.args) : {};
      const fnResult = await executeAgentFunction(name, args);
      result = await (session as any).sendMessage({
        functionCall: call,
        functionResponse: { name, response: fnResult },
      });
      response = result.response;
    }
    calls = (response as any).functionCalls?.() || [];
  }
  const reply = response.text();
  addChatLog({
    id: Date.now().toString(),
    userPrompt: prompt,
    agentResponse: reply,
    summary: reply,
    timestamp: new Date(),
    ...(tripId ? { tripId } : {}),
  });
  return reply;
};
