import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Switch, Linking } from "react-native";
import { getPassportCountry, setPassportCountry } from "@/services/passport";
import { getVisaRules, VisaRule } from "@/packages/providers/visa";
import { getAdvisories, Advisory } from "@/packages/providers/safety";

interface Props {
  destinationCountry: string;
  dates: Date[];
}

const PreFlightChecklist: React.FC<Props> = ({ destinationCountry, dates }) => {
  const [passport, setPassport] = useState<string | null>(null);
  const [visa, setVisa] = useState<VisaRule | null>(null);
  const [advisory, setAdvisory] = useState<Advisory | null>(null);
  const [input, setInput] = useState("");
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    getPassportCountry().then((p) => setPassport(p));
  }, []);

  useEffect(() => {
    const run = async () => {
      if (passport) {
        const v = await getVisaRules(passport, destinationCountry, dates);
        const a = await getAdvisories(destinationCountry);
        setVisa(v);
        setAdvisory(a);
      }
    };
    run();
  }, [passport, destinationCountry, dates]);

  const savePassport = async () => {
    if (!consent || !input) return;
    await setPassportCountry(input.trim());
    setPassport(input.trim().toUpperCase());
  };

  if (!passport) {
    return (
      <View className="p-4 border border-primary rounded-xl mt-4 space-y-2">
        <Text className="font-outfit-bold text-text-primary">
          Share Passport Country
        </Text>
        <Text className="text-text-primary">
          To check visa rules we store your passport country securely. No numbers
          or additional data is saved.
        </Text>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Country code (e.g., FR)"
          className="border p-2"
        />
        <View className="flex-row items-center">
          <Switch value={consent} onValueChange={setConsent} />
          <Text className="ml-2 text-text-primary">I consent to storing my passport country</Text>
        </View>
        <Button title="Save" onPress={savePassport} disabled={!consent || !input} />
      </View>
    );
  }

  return (
    <View className="p-4 border border-primary rounded-xl mt-4 space-y-2">
      <Text className="font-outfit-bold text-text-primary">Pre-Flight Checklist</Text>
      {visa && (
        <Text className="text-text-primary">Visa: {visa.summary}</Text>
      )}
      {advisory && (
        <Text className="text-text-primary">Safety: {advisory.message}</Text>
      )}
      {visa?.url && (
        <Text
          className="text-accent underline"
          onPress={() => Linking.openURL(visa.url!)}
        >
          Learn more
        </Text>
      )}
    </View>
  );
};

export default PreFlightChecklist;
