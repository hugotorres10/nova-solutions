"use client";

import { LocaleProvider } from "@/i18n/LocaleContext";
import { AppShell } from "@/components/AppShell";

export default function Home() {
  return (
    <LocaleProvider>
      <AppShell />
    </LocaleProvider>
  );
}
