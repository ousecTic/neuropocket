import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import pt from './locales/pt.json';
import ar from './locales/ar.json';
import hi from './locales/hi.json';
import sw from './locales/sw.json';
import fa from './locales/fa.json';
import ps from './locales/ps.json';
import ur from './locales/ur.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' },
  { code: 'ar', label: 'العربية' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'sw', label: 'Kiswahili' },
  { code: 'fa', label: 'دری' },
  { code: 'ps', label: 'پښتو' },
  { code: 'ur', label: 'اردو' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

const STORAGE_KEY = 'np_lang';
const RTL_LANGUAGES = ['ar', 'fa', 'ps', 'ur'];

// The supported code for a language tag (just the base, e.g. "es-MX" -> "es"), or null.
// Dari is sometimes reported as "prs" rather than "fa-AF".
function toSupported(tag: string | null | undefined): string | null {
  if (!tag) return null;
  const base = tag.toLowerCase().split(/[-_]/)[0];
  const code = base === 'prs' ? 'fa' : base;
  return SUPPORTED_LANGUAGES.some((l) => l.code === code) ? code : null;
}

function getInitialLanguage(): string {
  // A ?lang= in the address (e.g. neuropocket.html?lang=ur, as the offline course opens
  // it) wins, and is saved so the app stays in that language.
  const requested =
    typeof location !== 'undefined' ? toSupported(new URLSearchParams(location.search).get('lang')) : null;
  if (requested) {
    try {
      localStorage.setItem(STORAGE_KEY, requested);
    } catch {
      // Storage can be unavailable (e.g. blocked over file://); the language still applies.
    }
    return requested;
  }
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
    return saved;
  }
  // Fall back to the browser language, else English.
  return toSupported(typeof navigator !== 'undefined' ? navigator.language : null) ?? 'en';
}

function applyDirection(lng: string) {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = lng;
  document.documentElement.dir = RTL_LANGUAGES.includes(lng) ? 'rtl' : 'ltr';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },
    pt: { translation: pt },
    ar: { translation: ar },
    hi: { translation: hi },
    sw: { translation: sw },
    fa: { translation: fa },
    ps: { translation: ps },
    ur: { translation: ur },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

// Keep document direction/lang and the saved preference in sync with the active language.
applyDirection(i18n.language);
i18n.on('languageChanged', (lng) => {
  applyDirection(lng);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, lng);
  }
});

export default i18n;
