import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import en from "./en.json";
import et from "./et.json";

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    et: { translation: et },
  },
  lng: Localization.locale.startsWith("et") ? "et" : "en",
  fallbackLng: "en",
} as any);

export function setLanguage(lng: "en" | "et") {
  void i18n.changeLanguage(lng);
}

export default i18n;
