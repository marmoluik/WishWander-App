"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PlanningRequest } from "@/types/planning";
import {
  planningRequestToPrompt,
  queryToPlanningRequest,
} from "@/utils/planning";
import { runTravelAgent } from "@/utils/chatAgent";

interface Message {
  role: "user" | "agent";
  text: string;
}

export default function PlanChat() {
  const params = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<{ conciergeActive: boolean; priority: string } | null>(null);

  const tripId = params.get("tripId") || "default";

  useEffect(() => {
    const req: PlanningRequest = queryToPlanningRequest(params);
    if (req) {
      const intro = planningRequestToPrompt(req);
      setMessages([{ role: "user", text: intro }]);
      runTravelAgent(intro).then((reply) =>
        setMessages((m) => [...m, { role: "agent", text: reply }])
      );
    }
    fetch(`/api/billing/status?tripId=${tripId}`)
      .then((res) => res.json())
      .then(setStatus)
      .catch(() => setStatus(null));
  }, [params, tripId]);

  const send = async () => {
    if (!input) return;
    const prompt = input;
    setMessages((m) => [...m, { role: "user", text: prompt }]);
    setInput("");
    const reply = await runTravelAgent(prompt);
    setMessages((m) => [...m, { role: "agent", text: reply }]);
  };

  const checkout = async () => {
    const res = await fetch(`/api/billing/checkout?tripId=${tripId}`, {
      method: "POST",
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="p-4 flex flex-col h-full max-h-screen">
      <div className="mb-2 flex justify-between items-center">
        {status?.conciergeActive ? (
          <span className="bg-purple-500 text-white px-2 py-1 rounded text-sm">Priority</span>
        ) : (
          <button className="border px-2 py-1 text-sm" onClick={checkout}>
            Unlock Hands-Off Mode
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((m, idx) => (
          <div key={idx} className={m.role === "user" ? "text-right" : "text-left"}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="flex mt-2 gap-2">
        <input
          className="border flex-1 p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="border px-4" onClick={send}>
          Send
        </button>
      </div>
    </div>
  );
}
