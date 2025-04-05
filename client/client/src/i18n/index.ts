export const t = (key: string) => key;

export function useTranslation() {
  return {
    t: (key: string) => key,
    i18n: {
      changeLanguage: (lang: string) => Promise.resolve(),
      language: 'tr'
    },
    currentLanguage: 'tr'
  };
}
