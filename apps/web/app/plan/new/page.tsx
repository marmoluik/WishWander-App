"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlanningRequest } from "@/types/planning";
import {
  planningRequestToPrompt,
  planningRequestToQuery,
} from "@/utils/planning";
import { runTravelAgent } from "@/utils/chatAgent";

const initialRequest: PlanningRequest = {
  dates: { start: "", end: "" },
  budget: "",
  party: "",
  style: "",
  mustDos: "",
};

export default function PlanWizard() {
  const [step, setStep] = useState(0);
  const [req, setReq] = useState<PlanningRequest>(initialRequest);
  const [plan, setPlan] = useState<string | null>(null);
  const router = useRouter();

  const update = (field: keyof PlanningRequest, value: any) => {
    setReq({ ...req, [field]: value });
  };

  const next = () => setStep((s) => Math.min(steps.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const toChat = () => {
    const query = planningRequestToQuery(req);
    router.push(`/plan/chat?${query}`);
  };

  const submit = async () => {
    const prompt = planningRequestToPrompt(req);
    const result = await runTravelAgent(prompt);
    setPlan(result);
  };

  if (plan) {
    return (
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">Your Plan</h1>
        <pre className="whitespace-pre-wrap border p-2">{plan}</pre>
        <button className="border px-4 py-2" onClick={() => setPlan(null)}>
          Start Over
        </button>
      </div>
    );
  }

  const steps = [
    <div className="space-y-2" key="dates">
      <label className="block">
        Start Date
        <input
          type="date"
          value={req.dates.start}
          onChange={(e) => update("dates", { ...req.dates, start: e.target.value })}
          className="border p-1 block"
        />
      </label>
      <label className="block">
        End Date
        <input
          type="date"
          value={req.dates.end}
          onChange={(e) => update("dates", { ...req.dates, end: e.target.value })}
          className="border p-1 block"
        />
      </label>
    </div>,
    <div className="space-y-2" key="budget">
      <label className="block">
        Budget
        <input
          type="text"
          value={req.budget}
          onChange={(e) => update("budget", e.target.value)}
          className="border p-1 w-full"
        />
      </label>
    </div>,
    <div className="space-y-2" key="party">
      <label className="block">
        Who is going?
        <input
          type="text"
          value={req.party}
          onChange={(e) => update("party", e.target.value)}
          className="border p-1 w-full"
        />
      </label>
    </div>,
    <div className="space-y-2" key="style">
      <label className="block">
        Travel Style
        <select
          value={req.style}
          onChange={(e) => update("style", e.target.value)}
          className="border p-1 w-full"
        >
          <option value="">Select...</option>
          <option value="relaxed">Relaxed</option>
          <option value="adventure">Adventure</option>
          <option value="cultural">Cultural</option>
        </select>
      </label>
    </div>,
    <div className="space-y-2" key="mustdos">
      <label className="block">
        Must-do Activities
        <textarea
          value={req.mustDos}
          onChange={(e) => update("mustDos", e.target.value)}
          className="border p-1 w-full"
        />
      </label>
    </div>,
  ];

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Plan Your Trip</h1>
      <div>{steps[step]}</div>
      <div className="flex justify-between">
        {step > 0 ? (
          <button className="border px-4 py-2" onClick={back}>
            Back
          </button>
        ) : (
          <span />
        )}
        {step < steps.length - 1 ? (
          <button className="border px-4 py-2" onClick={next}>
            Next
          </button>
        ) : (
          <button className="border px-4 py-2" onClick={submit}>
            Submit
          </button>
        )}
      </div>
      <button className="underline" onClick={toChat}>
        Chat with assistant
      </button>
    </div>
  );
}
