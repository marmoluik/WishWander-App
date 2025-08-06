export const getTravelpayoutsMarker = () => process.env.EXPO_PUBLIC_TRAVELPAYOUTS_MARKER || "";

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
  flight_number: string;
  price: string | number;
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
        flight_number: flight.flight_number || "",
        price: flight.price || flight.value || "",
      };
    }
  } catch (e) {
    console.error("flight info fetch failed", e);
  }
  return null;
};

export const generateHotelLink = (
  query: string,
  checkIn?: string,
  checkOut?: string
) => {
  const marker = getTravelpayoutsMarker();
  const baseSearch = `https://search.hotellook.com/hotels?destination=${query}${
    checkIn ? `&checkIn=${checkIn}` : ""
  }${checkOut ? `&checkOut=${checkOut}` : ""}`;
  return `https://tp.media/r?campaign_id=101&marker=${marker}&p=4115&sub_id=ww&trs=446474&u=${encodeURIComponent(
    baseSearch
  )}`;
};

export const generatePoiLink = (query: string) => {
  const marker = getTravelpayoutsMarker();
  const lower = query.toLowerCase();
  if (lower.includes("cruise") || lower.includes("boat") || lower.includes("sail")) {
    const base = "https://searadar.com";
    return `https://tp.media/r?campaign_id=258&marker=${marker}&p=5907&sub_id=ww&trs=446474&u=${encodeURIComponent(
      base
    )}`;
  }
  const base = "https://welcomepickups.com";
  return `https://tp.media/r?campaign_id=627&marker=${marker}&p=8919&sub_id=ww&trs=446474&u=${encodeURIComponent(
    base
  )}`;
};

export default {
  generateFlightLink,
  fetchFlightInfo,
  generateHotelLink,
  generatePoiLink,
};
