"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Filter,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { INTEGRATIONS, COMPANIES } from "@/lib/data";
import { useTranslation } from "@/i18n/useTranslation";

/* ------------------------------------------------------------------ */
/*  Derived KPI type & data                                            */
/* ------------------------------------------------------------------ */
type DerivedKPI = {
  id: string;
  name: string;
  value: string;
  trend: "up" | "down" | "flat";
  change: string;
  lastUpdated: string;
  integrationId: string;
  companyIds: string[];
};

const DERIVED_KPIS: DerivedKPI[] = [
  /* ---- Stripe --------------------------------------------------- */
  {
    id: "stripe-mrr",
    name: "MRR Total",
    value: "\u20AC48.500",
    trend: "up",
    change: "+8.0%",
    lastUpdated: "2026-02-24T10:30:00Z",
    integrationId: "stripe",
    companyIds: ["alpha", "beta"],
  },
  {
    id: "stripe-arr",
    name: "ARR Projetado",
    value: "\u20AC582K",
    trend: "up",
    change: "+15.2%",
    lastUpdated: "2026-02-24T10:30:00Z",
    integrationId: "stripe",
    companyIds: ["alpha", "beta"],
  },
  {
    id: "stripe-arpu",
    name: "ARPU",
    value: "\u20AC68,40",
    trend: "up",
    change: "+3.1%",
    lastUpdated: "2026-02-24T10:30:00Z",
    integrationId: "stripe",
    companyIds: ["alpha", "beta"],
  },
  {
    id: "stripe-ltv",
    name: "LTV M\u00E9dio",
    value: "\u20AC2.847",
    trend: "up",
    change: "+8.7%",
    lastUpdated: "2026-02-24T10:30:00Z",
    integrationId: "stripe",
    companyIds: ["alpha", "beta"],
  },
  {
    id: "stripe-refund",
    name: "Taxa de Reembolso",
    value: "1.3%",
    trend: "down",
    change: "-0.2%",
    lastUpdated: "2026-02-24T10:30:00Z",
    integrationId: "stripe",
    companyIds: ["alpha", "beta"],
  },
  {
    id: "stripe-failed",
    name: "Pagamentos Falhados",
    value: "0.8%",
    trend: "down",
    change: "-0.1%",
    lastUpdated: "2026-02-24T10:30:00Z",
    integrationId: "stripe",
    companyIds: ["alpha", "beta"],
  },

  /* ---- Google Analytics ----------------------------------------- */
  {
    id: "ga-sessions",
    name: "Sess\u00F5es Mensais",
    value: "184.230",
    trend: "up",
    change: "+22.6%",
    lastUpdated: "2026-02-24T10:25:00Z",
    integrationId: "analytics",
    companyIds: ["alpha", "beta", "gamma"],
  },
  {
    id: "ga-bounce",
    name: "Bounce Rate",
    value: "34.2%",
    trend: "down",
    change: "-2.8%",
    lastUpdated: "2026-02-24T10:25:00Z",
    integrationId: "analytics",
    companyIds: ["alpha", "beta", "gamma"],
  },
  {
    id: "ga-duration",
    name: "Dura\u00E7\u00E3o M\u00E9dia",
    value: "4m 32s",
    trend: "up",
    change: "+12.1%",
    lastUpdated: "2026-02-24T10:25:00Z",
    integrationId: "analytics",
    companyIds: ["alpha", "beta", "gamma"],
  },
  {
    id: "ga-conversion",
    name: "Taxa de Convers\u00E3o",
    value: "3.24%",
    trend: "flat",
    change: "+0.02%",
    lastUpdated: "2026-02-24T10:25:00Z",
    integrationId: "analytics",
    companyIds: ["alpha", "beta", "gamma"],
  },
  {
    id: "ga-pages",
    name: "P\u00E1ginas / Sess\u00E3o",
    value: "4.7",
    trend: "up",
    change: "+0.3",
    lastUpdated: "2026-02-24T10:25:00Z",
    integrationId: "analytics",
    companyIds: ["alpha", "beta", "gamma"],
  },

  /* ---- HubSpot -------------------------------------------------- */
  {
    id: "hs-deals",
    name: "Deals no Pipeline",
    value: "59",
    trend: "up",
    change: "+7",
    lastUpdated: "2026-02-24T09:45:00Z",
    integrationId: "hubspot",
    companyIds: ["beta", "gamma"],
  },
  {
    id: "hs-pipeline",
    name: "Valor do Pipeline",
    value: "\u20AC438K",
    trend: "up",
    change: "+18.3%",
    lastUpdated: "2026-02-24T09:45:00Z",
    integrationId: "hubspot",
    companyIds: ["beta", "gamma"],
  },
  {
    id: "hs-winrate",
    name: "Win Rate",
    value: "32.4%",
    trend: "up",
    change: "+2.1%",
    lastUpdated: "2026-02-24T09:45:00Z",
    integrationId: "hubspot",
    companyIds: ["beta", "gamma"],
  },
  {
    id: "hs-cycle",
    name: "Ciclo de Venda",
    value: "28 dias",
    trend: "down",
    change: "-3 dias",
    lastUpdated: "2026-02-24T09:45:00Z",
    integrationId: "hubspot",
    companyIds: ["beta", "gamma"],
  },
  {
    id: "hs-leads",
    name: "Leads Qualificados",
    value: "127",
    trend: "up",
    change: "+14",
    lastUpdated: "2026-02-24T09:45:00Z",
    integrationId: "hubspot",
    companyIds: ["beta", "gamma"],
  },
  {
    id: "hs-contacts",
    name: "Contactos Ativos",
    value: "3.482",
    trend: "up",
    change: "+156",
    lastUpdated: "2026-02-24T09:45:00Z",
    integrationId: "hubspot",
    companyIds: ["beta", "gamma"],
  },

  /* ---- Slack ---------------------------------------------------- */
  {
    id: "slack-msgs",
    name: "Mensagens / Dia",
    value: "1.247",
    trend: "flat",
    change: "+12",
    lastUpdated: "2026-02-24T08:00:00Z",
    integrationId: "slack",
    companyIds: ["beta", "gamma"],
  },
  {
    id: "slack-response",
    name: "Tempo de Resposta",
    value: "18 min",
    trend: "down",
    change: "-4 min",
    lastUpdated: "2026-02-24T08:00:00Z",
    integrationId: "slack",
    companyIds: ["beta", "gamma"],
  },
  {
    id: "slack-channels",
    name: "Canais Ativos",
    value: "34",
    trend: "up",
    change: "+2",
    lastUpdated: "2026-02-24T08:00:00Z",
    integrationId: "slack",
    companyIds: ["beta", "gamma"],
  },

  /* ---- Gmail ---------------------------------------------------- */
  {
    id: "gmail-sent",
    name: "Emails Enviados / Semana",
    value: "342",
    trend: "up",
    change: "+28",
    lastUpdated: "2026-02-24T10:15:00Z",
    integrationId: "gmail",
    companyIds: ["alpha"],
  },
  {
    id: "gmail-response",
    name: "Tempo de Resposta",
    value: "2.3h",
    trend: "down",
    change: "-25.8%",
    lastUpdated: "2026-02-24T10:15:00Z",
    integrationId: "gmail",
    companyIds: ["alpha"],
  },
  {
    id: "gmail-open",
    name: "Open Rate",
    value: "67.4%",
    trend: "up",
    change: "+4.2%",
    lastUpdated: "2026-02-24T10:15:00Z",
    integrationId: "gmail",
    companyIds: ["alpha"],
  },

  /* ---- GitHub --------------------------------------------------- */
  {
    id: "gh-commits",
    name: "Commits / Semana",
    value: "87",
    trend: "up",
    change: "+12",
    lastUpdated: "2026-02-24T09:00:00Z",
    integrationId: "github",
    companyIds: ["alpha"],
  },
  {
    id: "gh-prs",
    name: "PRs Abertos",
    value: "14",
    trend: "flat",
    change: "+1",
    lastUpdated: "2026-02-24T09:00:00Z",
    integrationId: "github",
    companyIds: ["alpha"],
  },
  {
    id: "gh-issues",
    name: "Issues Resolvidas",
    value: "23",
    trend: "up",
    change: "+8",
    lastUpdated: "2026-02-24T09:00:00Z",
    integrationId: "github",
    companyIds: ["alpha"],
  },

  /* ---- Notion --------------------------------------------------- */
  {
    id: "notion-pages",
    name: "P\u00E1ginas Ativas",
    value: "156",
    trend: "up",
    change: "+18",
    lastUpdated: "2026-02-24T08:30:00Z",
    integrationId: "notion",
    companyIds: ["alpha", "gamma"],
  },
  {
    id: "notion-updates",
    name: "Atualiza\u00E7\u00F5es / Dia",
    value: "42",
    trend: "up",
    change: "+6",
    lastUpdated: "2026-02-24T08:30:00Z",
    integrationId: "notion",
    companyIds: ["alpha", "gamma"],
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const COMPANY_COLOR: Record<string, string> = {
  alpha: "#00D4AA",
  beta: "#448AFF",
  gamma: "#E040FB",
};

const TREND_ICON: Record<string, React.ReactNode> = {
  up: <TrendingUp className="h-3.5 w-3.5" />,
  down: <TrendingDown className="h-3.5 w-3.5" />,
  flat: <Minus className="h-3.5 w-3.5" />,
};

const TREND_COLOR: Record<string, string> = {
  up: "text-emerald-400",
  down: "text-red-400",
  flat: "text-amber-400",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

/* ================================================================== */
/*  Component                                                          */
/* ================================================================== */
export function KPIsPage() {
  const { t } = useTranslation();
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [integrationFilter, setIntegrationFilter] = useState<string>("all");

  /* ---- filtering ------------------------------------------------ */
  const filtered = useMemo(() => {
    return DERIVED_KPIS.filter((kpi) => {
      if (companyFilter !== "all" && !kpi.companyIds.includes(companyFilter))
        return false;
      if (integrationFilter !== "all" && kpi.integrationId !== integrationFilter)
        return false;
      return true;
    });
  }, [companyFilter, integrationFilter]);

  const grouped = useMemo(() => {
    const map: Record<string, DerivedKPI[]> = {};
    filtered.forEach((kpi) => {
      (map[kpi.integrationId] ??= []).push(kpi);
    });
    return map;
  }, [filtered]);

  const availableIntegrations = useMemo(() => {
    if (companyFilter === "all") return INTEGRATIONS;
    return INTEGRATIONS.filter((i) =>
      DERIVED_KPIS.some(
        (kpi) =>
          kpi.integrationId === i.id && kpi.companyIds.includes(companyFilter)
      )
    );
  }, [companyFilter]);

  return (
    <div className="min-h-screen space-y-6">
      {/* ---- Header ---------------------------------------------- */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E040FB]/10">
            <BarChart3 className="h-5 w-5 text-[#E040FB]" />
          </div>
          <h1 className="text-2xl font-bold text-[#F0F2F8]">
            {t("derivedKPIs") || "KPIs Derivados"}
          </h1>
          <Badge className="border-0 bg-[#E040FB]/15 text-[#E040FB]">
            {filtered.length} KPIs
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#5A6380]">
          <RefreshCw className="h-3.5 w-3.5" />
          <span>{t("autoRefresh") || "Auto-refresh a cada 5 min"}</span>
        </div>
      </motion.div>

      {/* ---- Filter bar ------------------------------------------ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border-[#1E2438] bg-[#0C1017]">
          <CardContent className="py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-[#5A6380]">
                <Filter className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  {t("filters") || "Filtros"}
                </span>
              </div>

              {/* Company pills */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCompanyFilter("all")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    companyFilter === "all"
                      ? "bg-[#448AFF]/15 text-[#448AFF]"
                      : "bg-[#141824] text-[#A0A8C0] hover:bg-[#1E2438]"
                  }`}
                >
                  {t("all") || "Todas"}
                </button>
                {COMPANIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() =>
                      setCompanyFilter(companyFilter === c.id ? "all" : c.id)
                    }
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      companyFilter === c.id
                        ? ""
                        : "bg-[#141824] text-[#A0A8C0] hover:bg-[#1E2438]"
                    }`}
                    style={
                      companyFilter === c.id
                        ? { backgroundColor: `${c.color}20`, color: c.color }
                        : undefined
                    }
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="hidden h-6 w-px bg-[#1E2438] sm:block" />

              {/* Integration pills */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setIntegrationFilter("all")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    integrationFilter === "all"
                      ? "bg-[#E040FB]/15 text-[#E040FB]"
                      : "bg-[#141824] text-[#A0A8C0] hover:bg-[#1E2438]"
                  }`}
                >
                  {t("allIntegrations") || "Todas Integra\u00E7\u00F5es"}
                </button>
                {availableIntegrations.map((i) => (
                  <button
                    key={i.id}
                    onClick={() =>
                      setIntegrationFilter(
                        integrationFilter === i.id ? "all" : i.id
                      )
                    }
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      integrationFilter === i.id
                        ? "bg-[#E040FB]/15 text-[#E040FB]"
                        : "bg-[#141824] text-[#A0A8C0] hover:bg-[#1E2438]"
                    }`}
                  >
                    {i.name}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ---- KPI groups by integration --------------------------- */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([integrationId, kpis], gi) => {
          const integration = INTEGRATIONS.find((i) => i.id === integrationId);
          if (!integration) return null;

          return (
            <motion.div
              key={integrationId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: gi * 0.1 }}
              className="space-y-3"
            >
              {/* Section header */}
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#141824]">
                  <BarChart3 className="h-4 w-4 text-[#A0A8C0]" />
                </div>
                <h2 className="text-base font-semibold text-[#F0F2F8]">
                  {integration.name}
                </h2>
                <Badge
                  variant="outline"
                  className="border-[#1E2438] text-[#5A6380]"
                >
                  {kpis.length} KPIs
                </Badge>
                <div
                  className={`ml-auto flex items-center gap-1.5 text-xs ${
                    integration.connected ? "text-emerald-400" : "text-zinc-500"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      integration.connected ? "bg-emerald-400" : "bg-zinc-500"
                    }`}
                  />
                  {integration.connected
                    ? t("synced") || "Sincronizado"
                    : t("offline") || "Offline"}
                </div>
              </div>

              {/* KPI cards */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {kpis.map((kpi, ki) => {
                  const isInverse =
                    kpi.name.toLowerCase().includes("reembolso") ||
                    kpi.name.toLowerCase().includes("falhado") ||
                    kpi.name.toLowerCase().includes("bounce") ||
                    kpi.name.toLowerCase().includes("churn");

                  const trendColor = isInverse
                    ? kpi.trend === "down"
                      ? "text-emerald-400"
                      : kpi.trend === "up"
                        ? "text-red-400"
                        : "text-amber-400"
                    : TREND_COLOR[kpi.trend];

                  return (
                    <motion.div
                      key={kpi.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: gi * 0.1 + ki * 0.04,
                      }}
                    >
                      <Card className="border-[#1E2438] bg-[#0C1017] transition-colors hover:border-[#2A3350]">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <p className="text-xs font-medium text-[#A0A8C0]">
                              {kpi.name}
                            </p>
                            <Badge className="border-0 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-400">
                              Auto
                            </Badge>
                          </div>

                          <p className="mt-2 text-xl font-bold text-[#F0F2F8]">
                            {kpi.value}
                          </p>

                          <div className="mt-2 flex items-center justify-between">
                            <div className={`flex items-center gap-1 ${trendColor}`}>
                              {TREND_ICON[kpi.trend]}
                              <span className="text-xs font-medium">
                                {kpi.change}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[#5A6380]">
                              <Clock className="h-3 w-3" />
                              <span className="text-[10px]">
                                {timeAgo(kpi.lastUpdated)}
                              </span>
                            </div>
                          </div>

                          {/* Company dots */}
                          <div className="mt-3 flex items-center gap-1 border-t border-[#1E2438] pt-2">
                            {kpi.companyIds.map((cid) => {
                              const company = COMPANIES.find(
                                (c) => c.id === cid
                              );
                              return (
                                <div
                                  key={cid}
                                  className="flex items-center gap-1 rounded-md bg-[#141824] px-1.5 py-0.5"
                                  title={company?.name}
                                >
                                  <span
                                    className="h-1.5 w-1.5 rounded-full"
                                    style={{
                                      backgroundColor:
                                        COMPANY_COLOR[cid] || "#5A6380",
                                    }}
                                  />
                                  <span className="text-[10px] text-[#5A6380]">
                                    {company?.icon}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ---- Summary footer -------------------------------------- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Card className="border-[#1E2438] bg-[#0C1017]">
          <CardContent className="py-4">
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <div className="flex items-center gap-6">
                <div className="text-center sm:text-left">
                  <p className="text-xs text-[#5A6380]">
                    {t("totalKPIs") || "Total de KPIs"}
                  </p>
                  <p className="text-lg font-bold text-[#F0F2F8]">
                    {filtered.length}
                  </p>
                </div>
                <div className="h-8 w-px bg-[#1E2438]" />
                <div className="text-center sm:text-left">
                  <p className="text-xs text-[#5A6380]">
                    {t("integrationSources") || "Fontes de Integra\u00E7\u00E3o"}
                  </p>
                  <p className="text-lg font-bold text-[#F0F2F8]">
                    {Object.keys(grouped).length}
                  </p>
                </div>
                <div className="h-8 w-px bg-[#1E2438]" />
                <div className="text-center sm:text-left">
                  <p className="text-xs text-[#5A6380]">
                    {t("companiesCovered") || "Empresas Cobertas"}
                  </p>
                  <p className="text-lg font-bold text-[#F0F2F8]">
                    {COMPANIES.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-[#141824] px-3 py-2">
                <RefreshCw
                  className="h-3.5 w-3.5 animate-spin text-[#5A6380]"
                  style={{ animationDuration: "3s" }}
                />
                <span className="text-xs text-[#5A6380]">
                  {t("autoComputed") ||
                    "Todos os KPIs s\u00E3o calculados automaticamente"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
