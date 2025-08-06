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
  return `https://www.aviasales.com/search?${params.join("&")}`;
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
  generateHotelLink,
  generatePoiLink,
};
