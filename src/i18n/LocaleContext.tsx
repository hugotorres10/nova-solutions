"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type LocaleContextType = {
  locale: string;
  setLocale: (locale: string) => void;
};

const LocaleContext = createContext<LocaleContextType>({
  locale: "pt",
  setLocale: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("nova-locale") || "pt";
    }
    return "pt";
  });

  const handleSetLocale = (newLocale: string) => {
    setLocale(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("nova-locale", newLocale);
    }
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale: handleSetLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
