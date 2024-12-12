import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    resources: {
      en: {
        translation: {
          settings: "Settings",
          language: "Language",
          theme: "Theme",
          toDoExercise: "To do exercise",
          exercise1: "Exercise 1: Write Practice",
          exercise2: "Exercise 2: Listen Practice",
          exercise3: "Exercise 3: Pronoun Practice",
          description1: "Description: Read follow contest.",
          description2: "Description: Type follow contest.",
          description3: "Description: Pronoun sentence.",
          back: "Back",
          tasks: "Tasks"
        }
      },
      th: {
        translation: {
          settings: "การตั้งค่า",
          language: "ภาษา",
          theme: "ธีม",
          toDoExercise: "ทำแบบฝึกหัด",
          exercise1: "แบบฝึกหัดที่ 1: การฝึกเขียน",
          exercise2: "แบบฝึกหัดที่ 2: การฝึกฟัง",
          exercise3: "แบบฝึกหัดที่ 3: การฝึกออกเสียง",
          description1: "คำอธิบาย: อ่านตามเนื้อหา",
          description2: "คำอธิบาย: พิมพ์ตามเนื้อหา",
          description3: "คำอธิบาย: ออกเสียงประโยค",
          back: "ย้อนกลับ",
          tasks: "งาน"
        }
      }
    }
  });

export default i18n;
