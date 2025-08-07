import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/config/FirebaseConfig';
import { runAgent } from './chatAgent';
import { Itinerary } from '@/types/itinerary';

/**
 * planTrip
 * Runs the chat agent with a user prompt and stores the resulting itinerary
 * in Firestore. Returns the persisted itinerary object.
 */
export async function planTrip(prompt: string): Promise<Itinerary | null> {
  const text = await runAgent(prompt);
  let itinerary: Itinerary;
  try {
    itinerary = JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse itinerary', e);
    return null;
  }
  const id = Date.now().toString();
  const data: Itinerary = {
    id,
    destination: itinerary.destination,
    prompt,
    createdAt: Date.now(),
    flights: itinerary.flights || [],
    hotels: itinerary.hotels || [],
    activities: itinerary.activities || [],
    metadata: itinerary.metadata || {},
  };
  if (db && auth.currentUser) {
    await setDoc(doc(db, 'Itineraries', id), {
      userId: auth.currentUser.uid,
      ...data,
    });
  }
  return data;
}
