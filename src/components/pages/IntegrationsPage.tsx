"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plug,
  ArrowLeft,
  Database,
  BarChart3,
  Zap,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { INTEGRATIONS, COMPANIES, STATS } from "@/lib/data";
import type { Integration } from "@/lib/data";
import { useTranslation } from "@/i18n/useTranslation";

// --- Type badge colors ---
const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  API: { bg: "bg-[#448AFF]/15", text: "text-[#448AFF]" },
  "API + Webhooks": { bg: "bg-[#448AFF]/15", text: "text-[#448AFF]" },
  "API / DB": { bg: "bg-[#448AFF]/15", text: "text-[#448AFF]" },
  "API / Sync": { bg: "bg-[#448AFF]/15", text: "text-[#448AFF]" },
  Webhook: { bg: "bg-[#E040FB]/15", text: "text-[#E040FB]" },
  RSS: { bg: "bg-[#FFB300]/15", text: "text-[#FFB300]" },
  "RSS + Web Scraping": { bg: "bg-[#FFB300]/15", text: "text-[#FFB300]" },
};

function getTypeBadgeStyle(type: string) {
  // Check for partial matches
  if (type.includes("RSS")) return TYPE_COLORS["RSS"];
  if (type.includes("Webhook")) return TYPE_COLORS["Webhook"];
  return TYPE_COLORS["API"]; // Default for API variants
}

export function IntegrationsPage() {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"data" | "kpis" | "actions">("data");
  const [validated, setValidated] = useState<Record<string, boolean>>({});

  const selected = useMemo(
    () => INTEGRATIONS.find((i) => i.id === selectedId) || null,
    [selectedId]
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setActiveTab("data");
  };

  const handleBack = () => {
    setSelectedId(null);
  };

  const handleValidate = (actionIdx: number) => {
    const key = `${selectedId}-${actionIdx}`;
    setValidated((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen space-y-6">
      <AnimatePresence mode="wait">
        {!selectedId ? (
          /* ===================== OVERVIEW MODE ===================== */
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00D4AA]/10">
                  <Plug className="h-5 w-5 text-[#00D4AA]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#F0F2F8]">
                    {t("integrations.title")}
                  </h1>
                  <p className="text-sm text-[#5A6380]">
                    {t("dashboard.total_integrations")}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  value: STATS.totalIntegrations,
                  label: t("dashboard.total_integrations"),
                  icon: <Plug className="h-4 w-4" />,
                  color: "#00D4AA",
                },
                {
                  value: STATS.totalConnections,
                  label: t("dashboard.active_connections"),
                  icon: <RefreshCw className="h-4 w-4" />,
                  color: "#448AFF",
                },
                {
                  value: STATS.totalDataPoints,
                  label: t("dashboard.data_points"),
                  icon: <Database className="h-4 w-4" />,
                  color: "#E040FB",
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label + i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                >
                  <Card className="border-[#1E2438] bg-[#0C1017]">
                    <CardContent className="flex items-center gap-3 py-4">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${stat.color}15` }}
                      >
                        <span style={{ color: stat.color }}>{stat.icon}</span>
                      </div>
                      <div>
                        <p className="text-xl font-bold" style={{ color: stat.color }}>
                          {stat.value}
                        </p>
                        <p className="text-xs text-[#5A6380]">{stat.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Integration Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {INTEGRATIONS.map((integration, index) => {
                const typeStyle = getTypeBadgeStyle(integration.type);
                return (
                  <motion.div
                    key={integration.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card
                      className="group relative cursor-pointer overflow-hidden border-[#1E2438] bg-[#0C1017] transition-all duration-300 hover:border-[#00D4AA]/30 hover:shadow-lg hover:shadow-[#00D4AA]/5"
                      onClick={() => handleSelect(integration.id)}
                    >
                      <CardContent className="space-y-4 py-5">
                        {/* Top Row: Icon + Name + Status */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#141824] text-2xl">
                              {integration.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-semibold text-[#F0F2F8]">
                                  {integration.name}
                                </h3>
                                {/* Connection Status Dot */}
                                <span className="relative flex h-2.5 w-2.5">
                                  {integration.connected ? (
                                    <>
                                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00D4AA] opacity-40" />
                                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#00D4AA]" />
                                    </>
                                  ) : (
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FF6B6B]" />
                                  )}
                                </span>
                              </div>
                              <p className="text-xs text-[#5A6380]">
                                {integration.type}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            {/* Type Badge */}
                            <Badge
                              className={`border-0 text-[10px] ${typeStyle?.bg || ""} ${typeStyle?.text || ""}`}
                            >
                              {integration.type}
                            </Badge>
                            {/* Refresh Rate */}
                            <span className="flex items-center gap-1 text-[10px] text-[#5A6380]">
                              <RefreshCw className="h-2.5 w-2.5" />
                              {integration.refresh}
                            </span>
                          </div>
                        </div>

                        {/* Mini Stats Row */}
                        <div className="flex items-center gap-3 border-t border-[#1E2438] pt-3">
                          <div className="flex items-center gap-1 text-[10px] text-[#A0A8C0]">
                            <Database className="h-3 w-3 text-[#448AFF]" />
                            <span className="font-medium text-[#F0F2F8]">
                              {integration.dataPoints.length}
                            </span>
                            data points
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-[#A0A8C0]">
                            <BarChart3 className="h-3 w-3 text-[#E040FB]" />
                            <span className="font-medium text-[#F0F2F8]">
                              {integration.derivedKPIs.length}
                            </span>
                            KPIs
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-[#A0A8C0]">
                            <Zap className="h-3 w-3 text-[#FFB300]" />
                            <span className="font-medium text-[#F0F2F8]">
                              {integration.magicActions.length}
                            </span>
                            actions
                          </div>
                        </div>

                        {/* Per Company Badge + Chevron */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {integration.perCompany && (
                              <Badge className="border-0 bg-[#00D4AA]/10 text-[10px] text-[#00D4AA]">
                                x{COMPANIES.length} {t("integrations.per_company")}
                              </Badge>
                            )}
                            {integration.connected ? (
                              <Badge className="border-0 bg-emerald-500/10 text-[10px] text-emerald-400">
                                <CheckCircle2 className="mr-0.5 h-2.5 w-2.5" />
                                {t("integrations.connected")}
                              </Badge>
                            ) : (
                              <Badge className="border-0 bg-[#FF6B6B]/10 text-[10px] text-[#FF6B6B]">
                                <XCircle className="mr-0.5 h-2.5 w-2.5" />
                                {t("integrations.disconnected")}
                              </Badge>
                            )}
                          </div>
                          <ChevronRight className="h-4 w-4 text-[#5A6380] transition-transform group-hover:translate-x-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* ===================== DETAIL MODE ===================== */
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {selected && (
              <>
                {/* Back Button + Integration Header */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleBack}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1E2438] bg-[#0C1017] text-[#A0A8C0] transition-colors hover:bg-[#141824] hover:text-[#F0F2F8]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#141824] text-2xl">
                    {selected.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-bold text-[#F0F2F8]">
                        {selected.name}
                      </h1>
                      <span className="relative flex h-2.5 w-2.5">
                        {selected.connected ? (
                          <>
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00D4AA] opacity-40" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#00D4AA]" />
                          </>
                        ) : (
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FF6B6B]" />
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-[#5A6380]">
                      {selected.type}
                    </p>
                  </div>
                </div>

                {/* Integration Meta Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Card className="border-[#1E2438] bg-[#0C1017]">
                    <CardContent className="py-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <Badge
                          className={`border-0 ${getTypeBadgeStyle(selected.type)?.bg || ""} ${getTypeBadgeStyle(selected.type)?.text || ""}`}
                        >
                          {selected.type}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-xs text-[#A0A8C0]">
                          <RefreshCw className="h-3.5 w-3.5 text-[#5A6380]" />
                          <span className="text-[#5A6380]">{t("integrations.refresh_rate")}:</span>
                          <span className="font-medium text-[#F0F2F8]">
                            {selected.refresh}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#A0A8C0]">
                          <Plug className="h-3.5 w-3.5 text-[#5A6380]" />
                          <span className="text-[#5A6380]">{t("integrations.connection_method")}:</span>
                          <span className="font-medium text-[#F0F2F8]">
                            {selected.connectionMethod}
                          </span>
                        </div>
                        {selected.perCompany && (
                          <Badge className="border-0 bg-[#00D4AA]/10 text-xs text-[#00D4AA]">
                            x{COMPANIES.length} {t("integrations.per_company")}
                          </Badge>
                        )}
                        {selected.connected ? (
                          <Badge className="border-0 bg-emerald-500/10 text-xs text-emerald-400">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            {t("integrations.connected")}
                          </Badge>
                        ) : (
                          <Badge className="border-0 bg-[#FF6B6B]/10 text-xs text-[#FF6B6B]">
                            <XCircle className="mr-1 h-3 w-3" />
                            {t("integrations.disconnected")}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Tabs */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  className="flex gap-2"
                >
                  {(
                    [
                      { key: "data" as const, label: t("integrations.data_tab"), icon: <Database className="h-3.5 w-3.5" />, count: selected.dataPoints.length },
                      { key: "kpis" as const, label: t("integrations.kpis_tab"), icon: <BarChart3 className="h-3.5 w-3.5" />, count: selected.derivedKPIs.length },
                      { key: "actions" as const, label: t("integrations.actions_tab"), icon: <Zap className="h-3.5 w-3.5" />, count: selected.magicActions.length },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.key
                          ? "border-[#00D4AA]/40 bg-[#00D4AA]/10 text-[#00D4AA]"
                          : "border-[#1E2438] bg-[#0C1017] text-[#5A6380] hover:border-[#2A3350] hover:text-[#A0A8C0]"
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                          activeTab === tab.key
                            ? "bg-[#00D4AA]/20 text-[#00D4AA]"
                            : "bg-[#1E2438] text-[#5A6380]"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </motion.div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {/* ---- DATA TAB ---- */}
                  {activeTab === "data" && (
                    <motion.div
                      key="data-tab"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="border-[#1E2438] bg-[#0C1017]">
                        <CardContent className="py-4">
                          <div className="space-y-1">
                            {selected.dataPoints.map((dp, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.25, delay: i * 0.04 }}
                                className="group/item flex items-start gap-4 rounded-lg px-4 py-3.5 transition-colors hover:bg-[#141824]"
                              >
                                {/* Blue dot */}
                                <div className="mt-1.5 flex h-3 w-3 shrink-0 items-center justify-center">
                                  <span className="h-2 w-2 rounded-full bg-[#448AFF]" />
                                </div>
                                <div className="flex-1 space-y-1.5">
                                  <p className="text-sm text-[#F0F2F8]">
                                    {dp.data}
                                  </p>
                                  <div className="flex items-start gap-1.5 text-xs text-[#5A6380]">
                                    <Zap className="mt-0.5 h-3 w-3 shrink-0 text-[#FFB300]" />
                                    <span className="text-[#A0A8C0]">
                                      {dp.derivedAction}
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* ---- KPIS TAB ---- */}
                  {activeTab === "kpis" && (
                    <motion.div
                      key="kpis-tab"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="border-[#1E2438] bg-[#0C1017]">
                        <CardContent className="py-5">
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {selected.derivedKPIs.map((kpi, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.25, delay: i * 0.06 }}
                                className="flex items-center gap-3 rounded-xl border border-[#1E2438] bg-[#141824] px-4 py-4 transition-all duration-200 hover:border-[#2A3350] hover:shadow-sm"
                              >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E040FB]/10">
                                  <BarChart3 className="h-4 w-4 text-[#E040FB]" />
                                </div>
                                <span className="text-sm font-medium text-[#F0F2F8]">
                                  {kpi}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* ---- ACTIONS TAB ---- */}
                  {activeTab === "actions" && (
                    <motion.div
                      key="actions-tab"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="border-[#1E2438] bg-[#0C1017]">
                        <CardContent className="py-4">
                          <div className="space-y-2">
                            {selected.magicActions.map((action, i) => {
                              const validationKey = `${selectedId}-${i}`;
                              const isAutomatic = action.authority.toLowerCase().includes("autom");

                              return (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, x: -12 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.25, delay: i * 0.06 }}
                                  className="rounded-xl border border-[#1E2438] bg-[#141824] p-4 transition-all duration-200 hover:border-[#2A3350]"
                                >
                                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex-1 space-y-2">
                                      {/* Trigger */}
                                      <div className="flex items-start gap-2">
                                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#FFB300]/10">
                                          <Zap className="h-3 w-3 text-[#FFB300]" />
                                        </span>
                                        <div>
                                          <span className="text-[10px] font-medium uppercase tracking-wider text-[#5A6380]">
                                            {t("magic.trigger")}
                                          </span>
                                          <p className="text-sm text-[#F0F2F8]">
                                            {action.trigger}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Action */}
                                      <div className="flex items-start gap-2">
                                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#448AFF]/10">
                                          <ChevronRight className="h-3 w-3 text-[#448AFF]" />
                                        </span>
                                        <div>
                                          <span className="text-[10px] font-medium uppercase tracking-wider text-[#5A6380]">
                                            {t("magic.action")}
                                          </span>
                                          <p className="text-sm text-[#A0A8C0]">
                                            {action.action}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Authority Badge + Validate Button */}
                                    <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-2">
                                      {/* Authority Badge */}
                                      <Badge
                                        className={`border-0 text-[10px] ${
                                          isAutomatic
                                            ? "bg-[#00D4AA]/15 text-[#00D4AA]"
                                            : "bg-[#E040FB]/15 text-[#E040FB]"
                                        }`}
                                      >
                                        {action.authority}
                                      </Badge>

                                      {/* Validate / Validated Toggle */}
                                      <button
                                        onClick={() => handleValidate(i)}
                                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                                          validated[validationKey]
                                            ? "bg-[#00D4AA]/15 text-[#00D4AA]"
                                            : "bg-[#1E2438] text-[#5A6380] hover:bg-[#00D4AA]/10 hover:text-[#00D4AA]"
                                        }`}
                                      >
                                        {validated[validationKey] ? (
                                          <>
                                            <CheckCircle2 className="h-3 w-3" />
                                            {t("integrations.validated")}
                                          </>
                                        ) : (
                                          t("integrations.validate")
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
