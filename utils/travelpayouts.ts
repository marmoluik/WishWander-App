export const getTravelpayoutsMarker = () => process.env.EXPO_PUBLIC_TRAVELPAYOUTS_MARKER || "";

import airports from "@/utils/airports.json";
import { estimateFlightCO2 } from "@/packages/impact/co2";

interface Airport { code: string; lat: number; lng: number }

const toRad = (value: number) => (value * Math.PI) / 180;

const distanceBetween = (a: Airport, b: Airport) => {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const rLat1 = toRad(a.lat);
  const rLat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rLat1) * Math.cos(rLat2) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
};

const findAirport = (code: string): Airport | undefined =>
  (airports as Airport[]).find((a) => a.code === code);

export const generateFlightLink = (
  origin: string,
  destination: string,
  departDate: string,
  returnDate?: string
) => {
  const marker = getTravelpayoutsMarker();
  const params = [`origin=${origin}`, `destination=${destination}`, `marker=${marker}`];
  if (departDate) params.push(`depart_date=${departDate}`);
  if (returnDate) params.push(`return_date=${returnDate}`);
  const baseSearch = `https://www.aviasales.com/search?${params.join("&")}`;
  return `https://tp.media/r?campaign_id=100&marker=${marker}&p=4114&sub_id=ww&trs=446474&u=${encodeURIComponent(
    baseSearch
  )}`;
};

export interface FlightInfo {
  airline: string;
  flightNumber: string;
  price: string | number;
}

export interface FlightOffer extends FlightInfo {
  bookingUrl: string;
  /** estimated CO2 emissions for the trip in kilograms */
  co2Kg?: number;
}

export const fetchFlightInfo = async (
  origin: string,
  destination: string,
  departDate: string
): Promise<FlightInfo | null> => {
  const token = process.env.EXPO_PUBLIC_TRAVELPAYOUTS_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch(
      `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=${origin}&destination=${destination}&departure_at=${departDate}&limit=1&token=${token}&currency=usd`
    );
    const json = await res.json();
    const flight = json?.data?.[0];
    if (flight) {
      return {
        airline: flight.airline || "",
        flightNumber: flight.flight_number || "",
        price: flight.price || flight.value || "",
      };
    }
  } catch (e) {
    console.error("flight info fetch failed", e);
  }
  return null;
};

export const fetchCheapestFlights = async (
  origin: string,
  destination: string,
  departDate: string
): Promise<FlightOffer[]> => {
  const token = process.env.EXPO_PUBLIC_TRAVELPAYOUTS_TOKEN;
  if (!token) return [];
  try {
    const res = await fetch(
      `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=${origin}&destination=${destination}&departure_at=${departDate}&limit=10&token=${token}&currency=usd`
    );
    const json = await res.json();
    const flights = json?.data || [];
    const marker = getTravelpayoutsMarker();

    // estimate emissions once per route since all options share the same path
    let co2: number | undefined;
    const a1 = findAirport(origin);
    const a2 = findAirport(destination);
    if (a1 && a2) {
      const distance = distanceBetween(a1, a2);
      co2 = estimateFlightCO2([{ distanceKm: distance }]);
    }

    return flights
      .map((f: any) => ({
        airline: f.airline || "",
        flightNumber: f.flight_number || "",
        price: f.price || f.value || "",
        bookingUrl: f.link
          ? `https://tp.media/r?campaign_id=100&marker=${marker}&p=4114&sub_id=ww&trs=446474&u=${encodeURIComponent(`https://www.aviasales.com${f.link}`)}`
          : generateFlightLink(origin, destination, departDate),
        co2Kg: co2,
      }))
      .sort((a: FlightOffer, b: FlightOffer) => Number(a.price) - Number(b.price));
  } catch (e) {
    console.error("cheapest flights fetch failed", e);
  }
  return [];
};

export const generateHotelLink = (
  query: string,
  checkIn?: string,
  checkOut?: string
) => {
  const marker = getTravelpayoutsMarker();
  const baseSearch = `https://search.hotellook.com/hotels?destination=${encodeURIComponent(
    query
  )}${checkIn ? `&checkIn=${checkIn}` : ""}${
    checkOut ? `&checkOut=${checkOut}` : ""
  }`;
  return `https://tp.media/r?campaign_id=101&marker=${marker}&p=4115&sub_id=ww&trs=446474&u=${encodeURIComponent(
    baseSearch
  )}`;
};

export const generatePoiLink = (query: string) => {
  const marker = getTravelpayoutsMarker();
  const lower = query.toLowerCase();
  if (lower.includes("cruise") || lower.includes("boat") || lower.includes("sail")) {
    const base = `https://searadar.com/search?q=${encodeURIComponent(query)}`;
    return `https://tp.media/r?campaign_id=258&marker=${marker}&p=5907&sub_id=ww&trs=446474&u=${encodeURIComponent(
      base
    )}`;
  }
  const base = `https://welcomepickups.com/search?q=${encodeURIComponent(query)}`;
  return `https://tp.media/r?campaign_id=627&marker=${marker}&p=8919&sub_id=ww&trs=446474&u=${encodeURIComponent(
    base
  )}`;
};

export default {
  generateFlightLink,
  fetchFlightInfo,
  fetchCheapestFlights,
  generateHotelLink,
  generatePoiLink,
};
