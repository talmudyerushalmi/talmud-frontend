import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

console.log('init')


i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    detection: {
        order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],

        // keys or params to lookup language from
        lookupCookie: 'i18next',
        lookupFromPathIndex: 0,
        lookupFromSubdomainIndex: 0,
      
        // cache user language on
        caches: ['cookie'],
      
      
        // optional htmlTag with lang attribute, the default is:
        htmlTag: document.documentElement,
        cookieOptions: { path: '/', sameSite: 'strict' }
    },  
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      "en-US": {
        translation: {

        },

      },
      he: {
        translation: {
          "Tractate":"מסכת",
          "Chapter":"פרק",
          "Mishna":"משנה",
          "Go":"נווט",
          "Talmudic Parallels":"מקבילות",
          "Citations": "מובאות",
          "Editing Comments":"הערות נוסח",
          "Bibliographic Notes": "ביבליוגרפיה",
          "Explanatory Notes": "הערות פרשניות",
          "Division to Lines": "חלוקה לשורות",
          "Punctuation": "פיסוק",
          "References": "מראי מקום",
          "Jerusalem Talmud": "תלמוד ירושלמי",
          "Beta Version":"מדגים יכולות",
        },

      }
    },
    fallbackLng: "en-US",

    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  });
