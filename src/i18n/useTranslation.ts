"use client";
import { useCallback } from "react";
import { translations } from "./translations";
import { useLocale } from "./LocaleContext";

export function useTranslation() {
  const { locale } = useLocale();

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      let text =
        translations[locale]?.[key] || translations["en"]?.[key] || key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(`{${k}}`, String(v));
        });
      }
      return text;
    },
    [locale]
  );

  return { t, locale };
}
