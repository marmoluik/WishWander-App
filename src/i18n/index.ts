import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import et from "./et.json";

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    et: { translation: et },
  },
  lng: "en",
  fallbackLng: "en",
  compatibilityJSON: "v3",
});

export default i18n;
