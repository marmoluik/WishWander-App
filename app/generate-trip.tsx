// app/generate-trip.tsx

import { Text, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import JSON5 from "json5";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreateTripContext } from "@/context/CreateTripContext";
import { AI_PROMPT } from "@/constants/Options";
import { startChatSession } from "@/config/GeminiConfig";
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { auth, db } from "@/config/FirebaseConfig";
import { Itinerary, Booking } from "@/types/itinerary";
import {
  flightProvider,
  hotelProvider,
  activityProvider,
} from "@/packages/providers/registry";

const formatDate = (value: any) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") {
    return new Date(value).toISOString().split("T")[0];
  }
  if (value.seconds) {
    return new Date(value.seconds * 1000).toISOString().split("T")[0];
  }
  if (value._seconds) {
    return new Date(value._seconds * 1000).toISOString().split("T")[0];
  }
  return "";
};


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
      const originAirport = tripData.find((item) => item.originAirport)?.originAirport;

      const startDateStr = formatDate(dates?.startDate);
      const endDateStr = formatDate(dates?.endDate);

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
        const start = text.indexOf("{");
        if (start === -1) {
          throw new Error("Invalid response format");
        }

        let depth = 0;
        let end = -1;
        for (let i = start; i < text.length; i++) {
          const ch = text[i];
          if (ch === "{") depth++;
          if (ch === "}") {
            depth--;
            if (depth === 0) {
              end = i;
              break;
            }
          }
        }

        if (end === -1) {
          throw new Error("Invalid response format");
        }

        const jsonStr = text
          .slice(start, end + 1)
          .replace(/```json|```/gi, "");
        try {
          return JSON.parse(jsonStr);
        } catch (_) {
          // Fallback to JSON5 for more forgiving parsing (handles trailing commas, single quotes, etc.)
          return JSON5.parse(jsonStr);
        }
      };

      // Normalize various AI response formats into our expected structure
      const normalizeTripPlan = (data: any) => {
        const root = data.trip_plan || data;
        let flight =
          root.flight_details || root.flights || data.flight_details || data.flights;

        if (Array.isArray(flight)) {
          flight = flight[0];
        }

        const hotels =
          root.hotel?.options ||
          root.hotel_options ||
          root.hotels ||
          data.hotel?.options ||
          data.hotel_options ||
          data.hotels;

        const cleanedHotels = (hotels || [])
          .filter(
            (h: any) =>
              h?.name && !/accommodation|option/i.test(h.name)
          )
          .map((h: any) => ({
            ...h,
            booking_url: hotelProvider.getSearchUrl({ query: h.name }),
          }))
          .slice(0, 10);

        const places =
          root.places_to_visit ||
          root.places ||
          root.sightseeing ||
          data.places_to_visit ||
          data.places ||
          data.sightseeing;

        const cleanedPlaces = (places || [])
          .filter(
            (p: any) =>
              p?.name &&
              !p.name
                .toLowerCase()
                .includes((locationInfo?.name || "").toLowerCase())
          )
          .map((p: any) => ({
            ...p,
            booking_url: activityProvider.getSearchUrl({ query: p.name }),
          }))
          .slice(0, 10);

        const filledFlight = {
          departure_city: originAirport?.name || flight?.departure_city || "TBD",
          arrival_city: locationInfo?.name || flight?.arrival_city || "",
          departure_date: startDateStr || flight?.departure_date || "",
          departure_time: flight?.departure_time || "",
          arrival_date: startDateStr || flight?.arrival_date || "",
          arrival_time: flight?.arrival_time || "",
          airline: flight?.airline || "",
          flightNumber: flight?.flightNumber || "",
          price: flight?.price || "",
          bookingUrl: flight?.bookingUrl || "",
        };

        return {
          trip_plan: {
            ...root,
            flight_details: filledFlight,
            hotel: { options: cleanedHotels },
            places_to_visit: cleanedPlaces,
          },
        };
      };

      // Try multiple times to obtain a complete trip plan
      const MAX_RETRIES = 5;
      let attempt = 0;
      let prompt = FINAL_PROMPT;
      let parsed: any = null;

      while (attempt < MAX_RETRIES) {
        try {
          const session = startChatSession([
            { role: "user", parts: [{ text: prompt }] },
          ]);
          const result = await session.sendMessage(prompt);
          const rawText = await result.response.text();

          try {
            parsed = normalizeTripPlan(extractJSON(rawText));
          } catch (err) {
            console.error("parse error", err);
            attempt++;
            if (attempt >= MAX_RETRIES) {
              throw new Error("Invalid response format");
            }
            await new Promise((res) => setTimeout(res, attempt * 1000));
            continue; // retry after parse failure
          }
        } catch (err) {
          if (err instanceof Error && err.message.includes("503")) {
            attempt++;
            if (attempt >= MAX_RETRIES) {
              throw new Error("AI service is overloaded. Please try again later.");
            }
            await new Promise((res) => setTimeout(res, attempt * 1000));
            continue; // retry after delay
          }
          throw err;
        }

        const tripPlan = parsed?.trip_plan;
        const missing: string[] = [];

        const hotelOpts = tripPlan?.hotel?.options;
        if (
          !Array.isArray(hotelOpts) ||
          hotelOpts.length === 0 ||
          hotelOpts.some((h: any) => !h?.name)
        ) {
          missing.push("hotel options");
        }

        const places = tripPlan?.places_to_visit;
        if (
          !Array.isArray(places) ||
          places.length === 0 ||
          places.some((p: any) => !p?.name)
        ) {
          missing.push("places to visit");
        }

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

      if (originAirport && locationInfo?.name) {
        try {
          const locRes = await fetch(
            `https://autocomplete.travelpayouts.com/places2?term=${encodeURIComponent(
              locationInfo.name
            )}&locale=en&types[]=airport&limit=1`
          );
          let arrival: any = null;
          try {
            if (locRes.ok) {
              const locJson = await locRes.json();
              arrival = locJson?.[0];
            }
          } catch (parseErr) {
            console.error("flight location parse failed", parseErr);
          }

          if (arrival?.code) {
            parsed.trip_plan.flight_details.bookingUrl =
              flightProvider.getSearchUrl({
                origin: originAirport.code,
                destination: arrival.code,
                departDate: startDateStr || "",
                returnDate: endDateStr || undefined,
              });
            const info = await flightProvider.getInfo?.({
              origin: originAirport.code,
              destination: arrival.code,
              departDate: startDateStr || "",
            });
            if (info) {
              parsed.trip_plan.flight_details.airline =
                info.airline || parsed.trip_plan.flight_details.airline;
              parsed.trip_plan.flight_details.flightNumber =
                info.flightNumber || parsed.trip_plan.flight_details.flightNumber;
              if (info.price)
                parsed.trip_plan.flight_details.price = `$${info.price}`;
            }
          }
        } catch (e) {
          console.error("flight link failed", e);
        }
      }

      // Save the entire parsed response so downstream screens receive trip_plan
      const docId = Date.now().toString();
      if (db && user) {
        const bookings: Booking[] = [];
        const fd = parsed.trip_plan.flight_details;
        if (fd) {
          bookings.push({
            type: "flight",
            provider: fd.airline || "",
            reference: fd.flightNumber || "",
            url: fd.bookingUrl || "",
          });
        }
        const firstHotel = parsed.trip_plan.hotel?.options?.[0];
        if (firstHotel) {
          bookings.push({
            type: "hotel",
            provider: firstHotel.name,
            url: firstHotel.booking_url,
          });
        }
        const itinerary: Itinerary = {
          id: docId,
          userId: user.uid,
          destination: {
            city: locationInfo?.name || "",
            country: locationInfo?.country || "",
          },
          startDate: startDateStr,
          endDate: endDateStr,
          bookings,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        await setDoc(doc(db, "UserTrips", user.uid, "trips", docId), {
          userEmail: user.email,
          tripPlan: parsed,
          tripData: JSON.stringify(tripData),
          itinerary,
          docId,
        });
        router.push("/mytrip");
      } else {
        setError("Unable to save trip. Please sign in and try again.");
      }
    } catch (err) {
      console.error("Failed to generate trip", err);

      if (err instanceof FirebaseError && err.code === "permission-denied") {
        setError(
          "You do not have permission to save this trip. Please verify your Firebase rules."
        );
      } else if (err instanceof Error && err.message.includes("503")) {
        setError("AI service is overloaded. Please try again later.");
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to generate trip. Please try again."
        );
      }
    }
  };

  return (
    <SafeAreaView className="p-6 h-full flex flex-col items-center justify-center">
      {error ? (
        <Text className="font-outfit-medium text-xl text-center text-accent">
          {error}
        </Text>
      ) : (
        <>
          <Text className="font-outfit-bold text-3xl text-center">
            Generating your itinerary...
          </Text>

          <Image
            source={require("@/assets/images/wishwander_loading.gif")}
            className="w-96 h-96 mt-10"
          />

          <Text className="font-outfit text-text-primary text-center mt-10">
            This might take a while, please do not go back.
          </Text>
        </>
      )}
    </SafeAreaView>
  );
}
