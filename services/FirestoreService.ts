import { db } from '@/config/FirebaseConfig';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { Trip, DayPlan } from '@/types/Trip';

const FirestoreService = {
  saveTrip: async (trip: Trip) => {
    await setDoc(doc(db, 'trips', trip.id), trip);
  },
  listenTrip: (tripId: string, cb: (trip: Trip) => void) => {
    return onSnapshot(doc(db, 'trips', tripId), (snap) => {
      if (snap.exists()) cb(snap.data() as Trip);
    });
  },
  saveDayPlan: async (tripId: string, day: DayPlan) => {
    await setDoc(doc(db, 'trips', tripId, 'itinerary', day.day.toString()), day);
  },
};

export default FirestoreService;
