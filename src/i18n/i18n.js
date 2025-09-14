import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./Locales/en.json";
import jp from "./Locales/jp.json"

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      jp: {translation: jp}
    },
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
