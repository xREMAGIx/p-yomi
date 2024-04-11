/* eslint-disable @typescript-eslint/no-explicit-any */
export const TRANSLATIONS_MAPPING: Record<string, () => Promise<any>> = {
  en: () => import("./en.json"),
  vi: () => import("./vi.json"),
};

export const LOCALES_LIST = Object.keys(TRANSLATIONS_MAPPING);
