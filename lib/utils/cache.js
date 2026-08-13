export const REVALIDATE = {
  search: 60 * 5,
  suggestions: 60 * 10,
  trending: 60 * 30,
  book: 60 * 60 * 6,
  editions: 60 * 60 * 12,
  author: 60 * 60 * 12,
  subject: 60 * 60 * 6,
  language: 60 * 60 * 6,
  free: 60 * 60,
  reader: 60 * 60 * 24,
  static: 60 * 60 * 24 * 7,
};

export const USER_AGENT = "OmniLibrary/1.0 (https://omnilibrary.app; global book discovery)";
