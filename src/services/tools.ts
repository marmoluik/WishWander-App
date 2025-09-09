export interface PlaceResult {
  id: string;
  title: string;
  url?: string;
  lat?: number;
  lng?: number;
  price?: number;
}

export async function searchFlights() {
  return [] as PlaceResult[];
}

export async function searchHotels() {
  return [] as PlaceResult[];
}

export async function searchPlaces() {
  return [] as PlaceResult[];
}

export async function optimizeRoute() {
  return [] as PlaceResult[];
}

export async function generatePDF() {
  return '';
}

export async function shareLink() {
  return '';
}
