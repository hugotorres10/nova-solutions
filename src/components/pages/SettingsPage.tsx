"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Moon,
  Bell,
  Info,
  Check,
  Mail,
  Smartphone,
  MessageSquare,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { locales } from "@/i18n/locales";
import { useLocale } from "@/i18n/LocaleContext";
import { useTranslation } from "@/i18n/useTranslation";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 },
};

export function SettingsPage() {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();

  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [whatsappNotif, setWhatsappNotif] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0E17] p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-[#F0F2F8]">{t("settings.title")}</h1>
          <p className="text-sm text-[#A0A8C0]">Nova Solutions v1.0.0</p>
        </motion.div>

        <div className="space-y-6">
          {/* Language Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-[#1E2438] bg-[#0C1017] p-5"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#448AFF]/10">
                <Globe className="h-4.5 w-4.5 text-[#448AFF]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#F0F2F8]">{t("settings.language")}</h2>
                <p className="text-xs text-[#5A6380]">
                  {locales.find((l) => l.code === locale)?.name || locale}
                </p>
              </div>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-9"
            >
              {locales.map((loc) => (
                <motion.button
                  key={loc.code}
                  variants={item}
                  onClick={() => setLocale(loc.code)}
                  className={`relative flex flex-col items-center gap-1.5 rounded-lg border px-2 py-2.5 text-center transition-all ${
                    locale === loc.code
                      ? "border-[#00D4AA] bg-[#00D4AA]/5"
                      : "border-[#1E2438] hover:border-[#2A3450] hover:bg-[#0A0E17]"
                  }`}
                >
                  {locale === loc.code && (
                    <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#00D4AA]">
                      <Check className="h-2.5 w-2.5 text-[#0A0E17]" />
                    </div>
                  )}
                  <span className="text-lg leading-none">{loc.flag}</span>
                  <span
                    className={`text-[10px] font-medium leading-tight ${
                      locale === loc.code ? "text-[#00D4AA]" : "text-[#A0A8C0]"
                    }`}
                  >
                    {loc.name}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Theme Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-[#1E2438] bg-[#0C1017] p-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E040FB]/10">
                <Moon className="h-4.5 w-4.5 text-[#E040FB]" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-[#F0F2F8]">{t("settings.theme")}</h2>
                <p className="text-xs text-[#5A6380]">{t("settings.dark_mode_desc")}</p>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-[#E040FB]/20 bg-[#E040FB]/5 px-3 py-1.5">
                <Moon className="h-3.5 w-3.5 text-[#E040FB]" />
                <span className="text-xs font-medium text-[#E040FB]">{t("settings.dark_mode")}</span>
              </div>
            </div>
          </motion.div>

          {/* Notifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-[#1E2438] bg-[#0C1017] p-5"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFB300]/10">
                <Bell className="h-4.5 w-4.5 text-[#FFB300]" />
              </div>
              <h2 className="text-sm font-semibold text-[#F0F2F8]">{t("settings.notifications")}</h2>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between rounded-lg px-3 py-3 transition-colors hover:bg-[#0A0E17]">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-[#5A6380]" />
                  <div>
                    <p className="text-sm text-[#F0F2F8]">{t("settings.email_notifications")}</p>
                    <p className="text-xs text-[#5A6380]">Receber alertas e resumos por email</p>
                  </div>
                </div>
                <Switch
                  checked={emailNotif}
                  onCheckedChange={setEmailNotif}
                  className="data-[state=checked]:bg-[#00D4AA]"
                />
              </div>

              <Separator className="bg-[#1E2438]" />

              <div className="flex items-center justify-between rounded-lg px-3 py-3 transition-colors hover:bg-[#0A0E17]">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-4 w-4 text-[#5A6380]" />
                  <div>
                    <p className="text-sm text-[#F0F2F8]">{t("settings.push_notifications")}</p>
                    <p className="text-xs text-[#5A6380]">Notificacoes no browser e dispositivo</p>
                  </div>
                </div>
                <Switch
                  checked={pushNotif}
                  onCheckedChange={setPushNotif}
                  className="data-[state=checked]:bg-[#00D4AA]"
                />
              </div>

              <Separator className="bg-[#1E2438]" />

              <div className="flex items-center justify-between rounded-lg px-3 py-3 transition-colors hover:bg-[#0A0E17]">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4 text-[#5A6380]" />
                  <div>
                    <p className="text-sm text-[#F0F2F8]">{t("settings.whatsapp_notifications")}</p>
                    <p className="text-xs text-[#5A6380]">Alertas urgentes via WhatsApp</p>
                  </div>
                </div>
                <Switch
                  checked={whatsappNotif}
                  onCheckedChange={setWhatsappNotif}
                  className="data-[state=checked]:bg-[#00D4AA]"
                />
              </div>
            </div>
          </motion.div>

          {/* About Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-[#1E2438] bg-[#0C1017] p-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00D4AA]/10">
                <Info className="h-4.5 w-4.5 text-[#00D4AA]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#F0F2F8]">{t("settings.about")}</h2>
                <p className="text-xs text-[#A0A8C0]">{t("settings.version")}</p>
              </div>
            </div>

            <Separator className="my-4 bg-[#1E2438]" />

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#5A6380]">Stack</span>
                <p className="mt-0.5 text-[#A0A8C0]">Next.js 16 + TypeScript + Tailwind CSS</p>
              </div>
              <div>
                <span className="text-[#5A6380]">AI Engine</span>
                <p className="mt-0.5 text-[#A0A8C0]">Claude Opus 4.6 / Sonnet 4.5</p>
              </div>
              <div>
                <span className="text-[#5A6380]">Integracoes</span>
                <p className="mt-0.5 text-[#A0A8C0]">11 servicos conectados</p>
              </div>
              <div>
                <span className="text-[#5A6380]">Empresas</span>
                <p className="mt-0.5 text-[#A0A8C0]">3 empresas ativas</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
