import { auth, db } from "@/config/FirebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore";
import { TripPlan } from "@/utils/itinerarySchema";
import { Itinerary } from "@/types/itinerary";

/**
 * Save a normalized itinerary to Firestore.
 * Creates a trip document and subcollections for flights, hotels and places.
 */
export const saveItinerary = async (
  tripPlan: TripPlan,
  itinerary: Itinerary,
  tripData: unknown,
  userEmail?: string
) => {
  if (!auth.currentUser || !db) return;

  const user = auth.currentUser;
  const rootRef = doc(db, "UserTrips", user.uid, "trips", itinerary.id);
  const now = Date.now();

  await setDoc(rootRef, {
    userEmail: userEmail || user.email,
    tripData: JSON.stringify(tripData),
    itinerary,
  });

  const saveCollection = async (key: string, items: any[] = []) => {
    const col = collection(rootRef, key);
    await Promise.all(
      items.map(async (item) => {
        const itemRef = doc(col);
        await setDoc(itemRef, {
          ...item,
          id: itemRef.id,
          itineraryId: itinerary.id,
          createdAt: now,
          updatedAt: now,
        });
      })
    );
  };

  const flights = Array.isArray(tripPlan.flight_details)
    ? tripPlan.flight_details
    : tripPlan.flight_details
      ? [tripPlan.flight_details]
      : [];

  await saveCollection("flights", flights);
  await saveCollection("hotels", tripPlan.hotel?.options);
  await saveCollection("places", tripPlan.places_to_visit);
  await saveCollection("days", tripPlan.itinerary);

  return itinerary.id;
};
