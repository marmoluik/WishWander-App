export const getTravelpayoutsMarker = () => process.env.EXPO_PUBLIC_TRAVELPAYOUTS_MARKER || "";

export const generateFlightLink = (
  origin: string,
  destination: string,
  departDate: string,
  returnDate?: string
) => {
  const marker = getTravelpayoutsMarker();
  const params = [`origin=${origin}`, `destination=${destination}`];
  if (departDate) params.push(`depart_date=${departDate}`);
  if (returnDate) params.push(`return_date=${returnDate}`);
  const baseSearch = `https://www.aviasales.com/search?${params.join("&")}`;
  return `https://www.travelpayouts.com/redirect?marker=${marker}&url=${encodeURIComponent(baseSearch)}`;
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
  return `https://www.travelpayouts.com/redirect?marker=${marker}&url=${encodeURIComponent(baseSearch)}`;
};

export const generatePoiLink = (query: string) => {
  const marker = getTravelpayoutsMarker();
  const baseSearch = `https://www.viator.com/search-results?query=${query}`;
  return `https://www.travelpayouts.com/redirect?marker=${marker}&url=${encodeURIComponent(baseSearch)}`;
};

export default {
  generateFlightLink,
  generateHotelLink,
  generatePoiLink,
};
