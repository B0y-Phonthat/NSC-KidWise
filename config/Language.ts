import i18next from "i18next";
import { initReactI18next, translate } from "react-i18next";
import { en } from "../translate/en.json";
import { th } from "../translate/th.json";

const resouces = {
    en: {
        translation: en,
    },
    th: {
        translation: th,
    },
}

i18next.use(initReactI18next).init({
    debug: true,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
    resouces,
})

export default i18next;