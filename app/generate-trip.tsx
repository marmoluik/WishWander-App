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

      // Create a new chat session with that prompt
      const session = startChatSession([
        { role: "user", parts: [{ text: FINAL_PROMPT }] },
      ]);

      // Send the prompt and await the response
      const result = await session.sendMessage(FINAL_PROMPT);
      const rawText = await result.response.text();

      // Parse the AI response safely
      let parsed: any;
      try {
        parsed = JSON.parse(rawText);
      } catch (err) {
        console.error("parse error", err);
        throw new Error("Invalid response format");
      }

      // Ensure we have a nested trip_plan object and populate defaults so
      // downstream screens can safely render even if the AI omits sections
      const tripPlan = parsed?.trip_plan ?? {};
      if (!tripPlan.flight_details) {
        tripPlan.flight_details = null;
      }
      if (!tripPlan.hotel) {
        tripPlan.hotel = { options: [] };
      } else if (!tripPlan.hotel.options) {
        tripPlan.hotel.options = [];
      }
      if (!tripPlan.places_to_visit) {
        tripPlan.places_to_visit = [];
      }
      parsed.trip_plan = tripPlan;

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
