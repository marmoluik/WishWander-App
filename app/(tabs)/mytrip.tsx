import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import StartNewTripCard from "@/components/MyTrips/StartNewTripCard";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "@/config/FirebaseConfig";
import UserTripList from "@/components/MyTrips/UserTripList";
import { useRouter } from "expo-router";

export default function MyTrip() {
  const [userTrips, setUserTrips] = useState<any[]>([]);
  const user = auth?.currentUser;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    user && getMyTrips();
  }, [user]);

  const getMyTrips = async () => {
    if (!db || !user) return;
    setLoading(true);
    setUserTrips([]);
    const q = query(
      collection(db, "UserTrips"),
      where("userId", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const plan = data.tripPlan?.trip_plan;
      if (
        plan?.flight_details?.departure_city &&
        plan?.hotel?.options?.length &&
        plan?.places_to_visit?.length
      ) {
        setUserTrips((prev) => [...prev, { id: docSnap.id, ...data }]);
      }
    });
    setLoading(false);
  };

  const deleteTrip = async (id: string) => {
    if (!db || !id) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "UserTrips", id));
      setUserTrips((prev) => prev.filter((trip) => trip.id !== id));
    } catch (e) {
      console.error("failed to delete trip", e);
    }
    setLoading(false);
  };

  return (
    <ScrollView
      className="p-6 h-full"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex flex-row items-center justify-between">
        <Text className="text-3xl font-outfit-bold text-primary">My Trips</Text>
        <TouchableOpacity onPress={() => router.push("/create-trip/search-place")}>
          <Ionicons name="add-circle" size={40} color="#9C00FF" />
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator size="large" color="#9C00FF" />}
      {userTrips?.length == 0 ? (
        <StartNewTripCard />
      ) : (
        <UserTripList userTrips={userTrips} onDelete={deleteTrip} />
      )}
    </ScrollView>
  );
}
