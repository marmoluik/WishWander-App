import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { getEvents, EventType, MetricEvent } from '@/packages/metrics';

interface Metrics {
  plans: number;
  bookings: number;
  conversionRate: number;
  ttfvHours: number;
  disruptions: number;
  replans: number;
  replanSuccessRate: number;
}

function calculateMetrics(events: MetricEvent[]): Metrics {
  const plans = events.filter(e => e.type === EventType.PLAN_CREATED).sort((a,b)=>a.timestamp-b.timestamp);
  const bookings = events.filter(e => e.type === EventType.BOOKING_CONFIRMED).sort((a,b)=>a.timestamp-b.timestamp);
  const disruptions = events.filter(e => e.type === EventType.DISRUPTION_DETECTED);
  const replans = events.filter(e => e.type === EventType.REPLAN_APPLIED);

  // pair plans with following booking to compute TTFV
  const ttfv: number[] = [];
  let i = 0, j = 0;
  while (i < plans.length && j < bookings.length) {
    if (bookings[j].timestamp >= plans[i].timestamp) {
      ttfv.push(bookings[j].timestamp - plans[i].timestamp);
      i++; j++;
    } else {
      j++;
    }
  }
  const avgTtfv = ttfv.length ? ttfv.reduce((a,b)=>a+b,0)/ttfv.length : 0;

  return {
    plans: plans.length,
    bookings: bookings.length,
    conversionRate: plans.length ? (bookings.length / plans.length) * 100 : 0,
    ttfvHours: avgTtfv / (1000 * 60 * 60),
    disruptions: disruptions.length,
    replans: replans.length,
    replanSuccessRate: disruptions.length ? (replans.length / disruptions.length) * 100 : 0,
  };
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics>();

  useEffect(() => {
    getEvents().then(ev => setMetrics(calculateMetrics(ev)));
  }, []);

  if (!metrics) {
    return (
      <View className="flex-1 items-center justify-center"><Text>Loading...</Text></View>
    );
  }

  const maxFunnel = Math.max(metrics.plans, metrics.bookings) || 1;

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold mb-4">Metrics (last 30 days)</Text>

      <Text className="text-lg font-semibold mb-2">Funnel</Text>
      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Text className="w-32">Plans</Text>
          <View className="flex-1 h-4 bg-gray-200">
            <View style={{width: `${(metrics.plans/maxFunnel)*100}%`}} className="h-4 bg-blue-500" />
          </View>
          <Text className="ml-2">{metrics.plans}</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="w-32">Bookings</Text>
          <View className="flex-1 h-4 bg-gray-200">
            <View style={{width: `${(metrics.bookings/maxFunnel)*100}%`}} className="h-4 bg-green-500" />
          </View>
          <Text className="ml-2">{metrics.bookings}</Text>
        </View>
      </View>
      <Text className="text-lg mb-1">Plan → Booking Conversion: {metrics.conversionRate.toFixed(1)}%</Text>
      <Text className="text-lg mb-1">Avg. Time to First Value: {metrics.ttfvHours.toFixed(1)} hrs</Text>
      <Text className="text-lg font-semibold mt-4 mb-1">Replan Success Rate: {metrics.replanSuccessRate.toFixed(1)}%</Text>
      <View className="h-4 bg-gray-200">
        <View style={{width: `${metrics.replanSuccessRate}%`}} className="h-4 bg-purple-500" />
      </View>
    </ScrollView>
  );
}
