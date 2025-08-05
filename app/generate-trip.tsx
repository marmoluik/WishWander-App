// app/generate-trip.tsx

import { Text, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreateTripContext } from "@/context/CreateTripContext";
import { AI_PROMPT } from "@/constants/Options";
import { startChatSession } from "@/config/GeminiConfig";
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/config/FirebaseConfig";

export default function GenerateTrip() {
  const { tripData } = useContext(CreateTripContext);
  const [error, setError] = useState<string | null>(null);
  const user = auth?.currentUser;
  const router = useRouter();

  useEffect(() => {
    generateTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateTrip = async () => {
    try {
      // Gather pieces from tripData
      const locationInfo = tripData.find((item) => item.locationInfo)
        ?.locationInfo;
      const travelers = tripData.find((item) => item.travelers)?.travelers;
      const dates = tripData.find((item) => item.dates)?.dates;
      const budget = tripData.find((item) => item.budget)?.budget;

      // Compute totals
      const totalDays = dates?.totalNumberOfDays || 0;
      const totalNights = totalDays > 0 ? totalDays - 1 : 0;

      // Build your final prompt string
      const FINAL_PROMPT = AI_PROMPT.replace(
        "{location}",
        locationInfo?.name || ""
      )
        .replace("{totalDays}", totalDays.toString())
        .replace("{totalNights}", totalNights.toString())
        .replace(
          "{travelers}",
          `${travelers?.type || ""} (${travelers?.count || 0})`
        )
        .replace("{budget}", budget?.type || "");

      // Helper to extract JSON from possible extra text
      const extractJSON = (text: string) => {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
          return JSON.parse(match[0]);
        }
        throw new Error("Invalid response format");
      };

      // Normalize various AI response formats into our expected structure
      const normalizeTripPlan = (data: any) => {
        const root = data.trip_plan || data;
        const flight =
          root.flight_details || root.flights || data.flight_details || data.flights;
        const hotels =
          root.hotel?.options ||
          root.hotel_options ||
          root.hotels ||
          data.hotel?.options ||
          data.hotel_options ||
          data.hotels;
        const places =
          root.places_to_visit ||
          root.places ||
          root.sightseeing ||
          data.places_to_visit ||
          data.places ||
          data.sightseeing;

        return {
          trip_plan: {
            ...root,
            flight_details: flight,
            hotel: { options: hotels || [] },
            places_to_visit: places || [],
          },
        };
      };

      // Try multiple times to obtain a complete trip plan
      const MAX_RETRIES = 5;
      let attempt = 0;
      let prompt = FINAL_PROMPT;
      let parsed: any = null;

      while (attempt < MAX_RETRIES) {
        const session = startChatSession([
          { role: "user", parts: [{ text: prompt }] },
        ]);
        const result = await session.sendMessage(prompt);
        const rawText = await result.response.text();

        try {
          parsed = normalizeTripPlan(extractJSON(rawText));
        } catch (err) {
          console.error("parse error", err);
          throw new Error("Invalid response format");
        }

        const tripPlan = parsed?.trip_plan;
        const missing: string[] = [];
        if (!tripPlan?.flight_details) missing.push("flight details");
        if (!tripPlan?.hotel?.options?.length) missing.push("hotel options");
        if (!tripPlan?.places_to_visit?.length) missing.push("places to visit");

        if (missing.length === 0) {
          break; // complete plan obtained
        }

        attempt++;
        if (attempt >= MAX_RETRIES) {
          throw new Error(
            `Incomplete trip plan received: missing ${missing.join(", ")}`
          );
        }

        // Ask the AI again for the missing sections
        prompt = `The previous response was missing ${missing.join(", ")}. Please resend the entire trip plan in valid JSON including flight_details object, hotel options array, and places_to_visit array.`;
      }

      // Save the entire parsed response so downstream screens receive trip_plan
      const docId = Date.now().toString();
      if (db && user) {
        await setDoc(doc(db, "UserTrips", docId), {
          userEmail: user.email,
          tripPlan: parsed,
          tripData: JSON.stringify(tripData),
          docId,
        });
        router.push("/mytrip");
      } else {
        setError("Unable to save trip. Please sign in and try again.");
      }
    } catch (err) {
      console.error("Failed to generate trip", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate trip. Please try again."
      );
    }
  };

  return (
    <SafeAreaView className="p-6 h-full flex flex-col items-center justify-center">
      {error ? (
        <Text className="font-outfit-medium text-xl text-center text-red-500">
          {error}
        </Text>
      ) : (
        <>
          <Text className="font-outfit-bold text-3xl text-center">
            Please Wait...
          </Text>
          <Text className="font-outfit-medium text-xl text-center mt-10">
            Generating your itinerary...
          </Text>

          <Image
            source={require("@/assets/images/loading.gif")}
            className="w-96 h-96"
          />

          <Text className="font-outfit text-gray-700 text-center mt-10">
            This might take a while, please do not go back.
          </Text>
        </>
      )}
    </SafeAreaView>
  );
}
