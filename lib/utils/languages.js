export const LANGUAGES = [
  { code: "en", ol: "eng", name: "English", native: "English", seed: "fiction" },
  { code: "bn", ol: "ben", name: "Bengali", native: "বাংলা", seed: "সাহিত্য", catalogQueries: ["বাংলা সাহিত্য", "হুমায়ূন আহমেদ", "রবীন্দ্রনাথ"] },
  { code: "es", ol: "spa", name: "Spanish", native: "Español", seed: "novela" },
  { code: "fr", ol: "fre", name: "French", native: "Français", seed: "roman" },
  { code: "ar", ol: "ara", name: "Arabic", native: "العربية", seed: "رواية" },
  { code: "hi", ol: "hin", name: "Hindi", native: "हिन्दी", seed: "उपन्यास" },
  { code: "de", ol: "ger", name: "German", native: "Deutsch", seed: "roman" },
  { code: "ja", ol: "jpn", name: "Japanese", native: "日本語", seed: "小説" },
  { code: "zh", ol: "chi", name: "Chinese", native: "中文", seed: "小说" },
  { code: "pt", ol: "por", name: "Portuguese", native: "Português", seed: "romance" },
  { code: "it", ol: "ita", name: "Italian", native: "Italiano", seed: "romanzo" },
  { code: "ru", ol: "rus", name: "Russian", native: "Русский", seed: "роман" },
  { code: "ko", ol: "kor", name: "Korean", native: "한국어", seed: "소설" },
  { code: "tr", ol: "tur", name: "Turkish", native: "Türkçe", seed: "roman" },
  { code: "fa", ol: "per", name: "Persian", native: "فارسی", seed: "رمان" },
  { code: "ur", ol: "urd", name: "Urdu", native: "اردو", seed: "ناول" },
  { code: "ta", ol: "tam", name: "Tamil", native: "தமிழ்", seed: "நாவல்" },
  { code: "te", ol: "tel", name: "Telugu", native: "తెలుగు", seed: "నవల" },
  { code: "ml", ol: "mal", name: "Malayalam", native: "മലയാളം", seed: "നോവൽ" },
  { code: "mr", ol: "mar", name: "Marathi", native: "मराठी", seed: "कादंबरी" },
  { code: "gu", ol: "guj", name: "Gujarati", native: "ગુજરાતી", seed: "નવલકથા" },
  { code: "pa", ol: "pan", name: "Punjabi", native: "ਪੰਜਾਬੀ", seed: "ਨਾਵਲ" },
  { code: "kn", ol: "kan", name: "Kannada", native: "ಕನ್ನಡ", seed: "ಕಾದಂಬರಿ" },
  { code: "th", ol: "tha", name: "Thai", native: "ไทย", seed: "นวนิยาย" },
  { code: "vi", ol: "vie", name: "Vietnamese", native: "Tiếng Việt", seed: "tiểu thuyết" },
  { code: "id", ol: "ind", name: "Indonesian", native: "Bahasa Indonesia", seed: "novel" },
  { code: "ms", ol: "may", name: "Malay", native: "Bahasa Melayu", seed: "novel" },
  { code: "nl", ol: "dut", name: "Dutch", native: "Nederlands", seed: "roman" },
  { code: "pl", ol: "pol", name: "Polish", native: "Polski", seed: "powieść" },
  { code: "uk", ol: "ukr", name: "Ukrainian", native: "Українська", seed: "роман" },
  { code: "he", ol: "heb", name: "Hebrew", native: "עברית", seed: "רומן" },
  { code: "el", ol: "gre", name: "Greek", native: "Ελληνικά", seed: "μυθιστόρημα" },
  { code: "sv", ol: "swe", name: "Swedish", native: "Svenska", seed: "roman" },
  { code: "cs", ol: "cze", name: "Czech", native: "Čeština", seed: "román" },
  { code: "ro", ol: "rum", name: "Romanian", native: "Română", seed: "roman" },
  { code: "hu", ol: "hun", name: "Hungarian", native: "Magyar", seed: "regény" },
  { code: "fi", ol: "fin", name: "Finnish", native: "Suomi", seed: "romaani" },
  { code: "da", ol: "dan", name: "Danish", native: "Dansk", seed: "roman" },
  { code: "no", ol: "nor", name: "Norwegian", native: "Norsk", seed: "roman" },
  { code: "sw", ol: "swa", name: "Swahili", native: "Kiswahili", seed: "riwaya" },
];

const OL_TO_ISO = Object.fromEntries(LANGUAGES.map((item) => [item.ol, item.code]));
const ISO_TO_LANG = Object.fromEntries(LANGUAGES.map((item) => [item.code, item]));

export function normalizeLanguage(code) {
  if (!code) return "";
  const raw = String(code).toLowerCase().replace("_", "-").split("-")[0];
  if (ISO_TO_LANG[raw]) return raw;
  if (OL_TO_ISO[raw]) return OL_TO_ISO[raw];
  if (raw.length === 3) return OL_TO_ISO[raw] || raw;
  return raw.slice(0, 2);
}

export function getLanguage(code) {
  const normalized = normalizeLanguage(code);
  return (
    ISO_TO_LANG[normalized] || {
      code: normalized,
      ol: normalized,
      name: normalized.toUpperCase(),
      native: normalized.toUpperCase(),
      seed: "fiction",
    }
  );
}

export function languageName(code) {
  return getLanguage(code).name;
}

export function toOpenLibraryLang(code) {
  const lang = getLanguage(code);
  return lang.ol || lang.code;
}

export function isNonLatinQuery(value) {
  return /[^\u0000-\u024F\s\d.,;:!?'"()\-]/.test(String(value || ""));
}

const SCRIPT_RE = {
  bn: /[\u0980-\u09FF]/,
  hi: /[\u0900-\u097F]/,
  mr: /[\u0900-\u097F]/,
  ar: /[\u0600-\u06FF]/,
  ur: /[\u0600-\u06FF]/,
  fa: /[\u0600-\u06FF]/,
  he: /[\u0590-\u05FF]/,
  ru: /[\u0400-\u04FF]/,
  uk: /[\u0400-\u04FF]/,
  el: /[\u0370-\u03FF]/,
  ja: /[\u3040-\u30FF\u4E00-\u9FFF]/,
  zh: /[\u4E00-\u9FFF]/,
  ko: /[\uAC00-\uD7AF]/,
  ta: /[\u0B80-\u0BFF]/,
  te: /[\u0C00-\u0C7F]/,
  ml: /[\u0D00-\u0D7F]/,
  kn: /[\u0C80-\u0CFF]/,
  gu: /[\u0A80-\u0AFF]/,
  pa: /[\u0A00-\u0A7F]/,
  th: /[\u0E00-\u0E7F]/,
};

function isLatinOnly(value) {
  return /^[\u0000-\u024F\s\d.,;:!?'"“”‘’()\-–—/&]+$/.test(String(value || "").trim());
}

export function bookMatchesLanguage(book, lang) {
  if (!lang?.code) return true;
  const target = lang.code;
  const codes = [...new Set((book.languages || []).map(normalizeLanguage).filter(Boolean))];
  const text = [book.title, book.subtitle, ...(book.authors || []).map((author) => author.name || author)]
    .filter(Boolean)
    .join(" ");
  const scriptRe = SCRIPT_RE[target];

  if (scriptRe?.test(text)) return true;
  if (codes.length === 1 && codes[0] === target) return true;
  if (!codes.includes(target)) return false;
  if (scriptRe && isLatinOnly(book.title) && codes.length > 1) return false;
  if (codes.length > 5) return false;
  return true;
}
