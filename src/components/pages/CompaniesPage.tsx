"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  TrendingUp,
  Users,
  Target,
  CheckCircle2,
  ArrowLeft,
  BarChart3,
  ChevronRight,
  CreditCard,
  Mail,
  MessageSquare,
  BookOpen,
  GitBranch,
  BarChart,
  Calendar,
  HardDrive,
  Zap,
  Kanban,
  AlertTriangle,
  AlertCircle,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { COMPANIES, INTEGRATIONS, MOCK_ALERTS } from "@/lib/data";
import { useTranslation } from "@/i18n/useTranslation";

/* ------------------------------------------------------------------ */
/*  Extended company metadata (linked integrations, health, mini-KPIs) */
/* ------------------------------------------------------------------ */
const COMPANY_META: Record<
  string,
  {
    healthScore: number;
    openDeals: number;
    activeClients: number;
    integrations: string[];
  }
> = {
  alpha: {
    healthScore: 85,
    openDeals: 34,
    activeClients: 1247,
    integrations: ["gmail", "stripe", "analytics", "github", "notion", "calendar"],
  },
  beta: {
    healthScore: 78,
    openDeals: 18,
    activeClients: 892,
    integrations: ["hubspot", "slack", "stripe", "analytics", "drive", "jira"],
  },
  gamma: {
    healthScore: 92,
    openDeals: 7,
    activeClients: 43,
    integrations: ["hubspot", "slack", "analytics", "notion", "zapier"],
  },
};

/* ------------------------------------------------------------------ */
/*  Integration icon mapping                                           */
/* ------------------------------------------------------------------ */
const ICON_MAP: Record<string, React.ReactNode> = {
  mail: <Mail className="h-4 w-4" />,
  "message-square": <MessageSquare className="h-4 w-4" />,
  target: <Target className="h-4 w-4" />,
  "credit-card": <CreditCard className="h-4 w-4" />,
  "book-open": <BookOpen className="h-4 w-4" />,
  "git-branch": <GitBranch className="h-4 w-4" />,
  "bar-chart": <BarChart className="h-4 w-4" />,
  calendar: <Calendar className="h-4 w-4" />,
  "hard-drive": <HardDrive className="h-4 w-4" />,
  zap: <Zap className="h-4 w-4" />,
  kanban: <Kanban className="h-4 w-4" />,
};

/* ------------------------------------------------------------------ */
/*  Alert visuals                                                      */
/* ------------------------------------------------------------------ */
const ALERT_ICON: Record<string, React.ReactNode> = {
  urgent: <AlertCircle className="h-4 w-4 text-red-400" />,
  important: <AlertTriangle className="h-4 w-4 text-amber-400" />,
  success: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
  info: <Info className="h-4 w-4 text-blue-400" />,
};

const ALERT_BG: Record<string, string> = {
  urgent: "border-red-500/20 bg-red-500/5",
  important: "border-amber-500/20 bg-amber-500/5",
  success: "border-emerald-500/20 bg-emerald-500/5",
  info: "border-blue-500/20 bg-blue-500/5",
};

/* ------------------------------------------------------------------ */
/*  Company-specific KPI definitions                                   */
/* ------------------------------------------------------------------ */
const COMPANY_KPIS: Record<
  string,
  { name: string; value: string; trend: "up" | "down" | "flat"; change: string }[]
> = {
  alpha: [
    { name: "Receita Mensal", value: "\u20AC18.200", trend: "up", change: "+12.4%" },
    { name: "Taxa de Convers\u00E3o", value: "4.8%", trend: "up", change: "+0.3%" },
    { name: "NPS", value: "82", trend: "up", change: "+4" },
    { name: "Churn Rate", value: "1.2%", trend: "down", change: "-0.4%" },
    { name: "Ticket M\u00E9dio", value: "\u20AC2.340", trend: "up", change: "+8%" },
    { name: "Tempo de Resposta", value: "1.2h", trend: "down", change: "-0.3h" },
  ],
  beta: [
    { name: "Receita Mensal", value: "\u20AC22.800", trend: "up", change: "+8.7%" },
    { name: "Taxa de Convers\u00E3o", value: "3.2%", trend: "up", change: "+0.5%" },
    { name: "NPS", value: "75", trend: "up", change: "+2" },
    { name: "Churn Rate", value: "2.8%", trend: "down", change: "-0.2%" },
    { name: "Ticket M\u00E9dio", value: "\u20AC4.500", trend: "up", change: "+5%" },
    { name: "Tempo de Resposta", value: "2.4h", trend: "up", change: "+0.5h" },
  ],
  gamma: [
    { name: "Receita Mensal", value: "\u20AC7.500", trend: "up", change: "+21.3%" },
    { name: "Taxa de Convers\u00E3o", value: "6.1%", trend: "up", change: "+1.2%" },
    { name: "NPS", value: "88", trend: "up", change: "+6" },
    { name: "Churn Rate", value: "0.8%", trend: "down", change: "-0.3%" },
    { name: "Ticket M\u00E9dio", value: "\u20AC8.200", trend: "up", change: "+12%" },
    { name: "Tempo de Resposta", value: "0.8h", trend: "down", change: "-0.2h" },
  ],
};

/* ================================================================== */
/*  Component                                                          */
/* ================================================================== */
export function CompaniesPage() {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = COMPANIES.find((c) => c.id === selectedId);
  const meta = selectedId ? COMPANY_META[selectedId] : null;

  return (
    <div className="min-h-screen space-y-6">
      <AnimatePresence mode="wait">
        {/* -------------------------------------------------------- */}
        {/*  LIST VIEW                                                */}
        {/* -------------------------------------------------------- */}
        {!selectedId ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#448AFF]/10">
                <Building2 className="h-5 w-5 text-[#448AFF]" />
              </div>
              <h1 className="text-2xl font-bold text-[#F0F2F8]">
                {t("companies") || "Empresas"}
              </h1>
              <Badge className="border-0 bg-[#448AFF]/15 text-[#448AFF]">
                {COMPANIES.length} {t("activeCompanies") || "empresas ativas"}
              </Badge>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {COMPANIES.map((company, index) => {
                const m = COMPANY_META[company.id];
                const linkedIntegrations = m.integrations
                  .map((id) => INTEGRATIONS.find((i) => i.id === id))
                  .filter(Boolean);

                return (
                  <motion.div
                    key={company.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card
                      className="group relative cursor-pointer overflow-hidden border-[#1E2438] bg-[#0C1017] transition-all hover:border-[#2A3350] hover:shadow-lg"
                      onClick={() => setSelectedId(company.id)}
                      style={{ borderTopWidth: "3px", borderTopColor: company.color }}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{company.icon}</span>
                            <div>
                              <CardTitle className="text-lg text-[#F0F2F8]">
                                {company.name}
                              </CardTitle>
                              <p className="text-sm text-[#A0A8C0]">
                                {company.sector}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className="border-0 bg-emerald-500/15 text-emerald-400">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              {t("active") || "Ativa"}
                            </Badge>
                            <span className="text-xs text-[#5A6380]">
                              {linkedIntegrations.length}{" "}
                              {t("integrations") || "integra\u00E7\u00F5es"}
                            </span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Mini KPIs */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="rounded-lg bg-[#141824] p-3">
                            <div className="mb-1 flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-[#5A6380]" />
                              <span className="text-[10px] uppercase tracking-wider text-[#5A6380]">
                                {t("model") || "Modelo"}
                              </span>
                            </div>
                            <p className="text-sm font-semibold" style={{ color: company.color }}>
                              {company.model}
                            </p>
                          </div>
                          <div className="rounded-lg bg-[#141824] p-3">
                            <div className="mb-1 flex items-center gap-1">
                              <Target className="h-3 w-3 text-[#5A6380]" />
                              <span className="text-[10px] uppercase tracking-wider text-[#5A6380]">
                                Deals
                              </span>
                            </div>
                            <p className="text-sm font-semibold" style={{ color: company.color }}>
                              {m.openDeals}
                            </p>
                          </div>
                          <div className="rounded-lg bg-[#141824] p-3">
                            <div className="mb-1 flex items-center gap-1">
                              <Users className="h-3 w-3 text-[#5A6380]" />
                              <span className="text-[10px] uppercase tracking-wider text-[#5A6380]">
                                {t("clients") || "Clientes"}
                              </span>
                            </div>
                            <p className="text-sm font-semibold" style={{ color: company.color }}>
                              {m.activeClients.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Health Score */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#A0A8C0]">Health Score</span>
                            <span className="font-semibold" style={{ color: company.color }}>
                              {m.healthScore}%
                            </span>
                          </div>
                          <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#1E2438]">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: company.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${m.healthScore}%` }}
                              transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                            />
                          </div>
                        </div>

                        {/* Integration icons */}
                        <div className="flex items-center justify-between border-t border-[#1E2438] pt-3">
                          <div className="flex items-center gap-2">
                            {linkedIntegrations.map((integration) => {
                              if (!integration) return null;
                              return (
                                <div
                                  key={integration.id}
                                  className="flex h-7 w-7 items-center justify-center rounded-md bg-[#141824] text-[#A0A8C0] transition-colors hover:text-[#F0F2F8]"
                                  title={integration.name}
                                >
                                  {ICON_MAP[integration.icon] || (
                                    <BarChart3 className="h-4 w-4" />
                                  )}
                                </div>
                              );
                            })}
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
          /* -------------------------------------------------------- */
          /*  DETAIL VIEW                                              */
          /* -------------------------------------------------------- */
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {selected && meta && (
              <>
                {/* Back + header */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1E2438] bg-[#0C1017] text-[#A0A8C0] transition-colors hover:bg-[#141824] hover:text-[#F0F2F8]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <span className="text-3xl">{selected.icon}</span>
                  <div>
                    <h1 className="text-2xl font-bold text-[#F0F2F8]">
                      {selected.name}
                    </h1>
                    <p className="text-sm text-[#A0A8C0]">{selected.sector}</p>
                  </div>
                  <Badge className="ml-2 border-0 bg-emerald-500/15 text-emerald-400">
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    {t("active") || "Ativa"}
                  </Badge>
                </div>

                {/* Summary KPI cards */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {[
                    {
                      label: t("model") || "Modelo",
                      value: selected.model,
                      icon: TrendingUp,
                      change: selected.active ? "Ativa" : "Inativa",
                    },
                    {
                      label: t("openDeals") || "Deals Abertos",
                      value: String(meta.openDeals),
                      icon: Target,
                      change: "+5",
                    },
                    {
                      label: t("activeClients") || "Clientes Ativos",
                      value: meta.activeClients.toLocaleString(),
                      icon: Users,
                      change: "+32",
                    },
                    {
                      label: "Health Score",
                      value: `${meta.healthScore}%`,
                      icon: BarChart3,
                      change:
                        meta.healthScore >= 85
                          ? t("excellent") || "Excelente"
                          : meta.healthScore >= 70
                            ? t("good") || "Bom"
                            : t("attention") || "Aten\u00E7\u00E3o",
                    },
                  ].map((kpi, i) => (
                    <motion.div
                      key={kpi.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.08 }}
                    >
                      <Card className="border-[#1E2438] bg-[#0C1017]">
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-2 text-[#5A6380]">
                            <kpi.icon className="h-4 w-4" />
                            <span className="text-xs uppercase tracking-wider">
                              {kpi.label}
                            </span>
                          </div>
                          <p
                            className="mt-2 text-2xl font-bold"
                            style={{ color: selected.color }}
                          >
                            {kpi.value}
                          </p>
                          <span className="text-xs text-emerald-400">
                            {kpi.change}
                          </span>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Integrations status */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Card className="border-[#1E2438] bg-[#0C1017]">
                    <CardHeader>
                      <CardTitle className="text-base text-[#F0F2F8]">
                        {t("integrationsStatus") || "Estado das Integra\u00E7\u00F5es"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {INTEGRATIONS.map((integration) => {
                          const isLinked = meta.integrations.includes(integration.id);
                          return (
                            <div
                              key={integration.id}
                              className="flex items-center justify-between rounded-lg bg-[#141824] px-4 py-3"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#1E2438] text-[#A0A8C0]">
                                  {ICON_MAP[integration.icon] || (
                                    <BarChart3 className="h-4 w-4" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-[#F0F2F8]">
                                    {integration.name}
                                  </p>
                                  <p className="text-xs text-[#5A6380]">
                                    {integration.type}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {isLinked ? (
                                  integration.connected ? (
                                    <>
                                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                      <span className="text-xs text-emerald-400">
                                        {t("connected") || "Conectado"}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="h-2 w-2 rounded-full bg-zinc-500" />
                                      <span className="text-xs text-zinc-500">
                                        {t("disconnected") || "Desconectado"}
                                      </span>
                                    </>
                                  )
                                ) : (
                                  <span className="text-xs text-[#5A6380]">
                                    {t("notLinked") || "N\u00E3o vinculada"}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Company alerts */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Card className="border-[#1E2438] bg-[#0C1017]">
                    <CardHeader>
                      <CardTitle className="text-base text-[#F0F2F8]">
                        {t("companyAlerts") || "Alertas da Empresa"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const alerts = MOCK_ALERTS.filter(
                          (a) => a.company === selected.id
                        );
                        if (alerts.length === 0) {
                          return (
                            <p className="text-sm text-[#5A6380]">
                              {t("noAlerts") || "Sem alertas."}
                            </p>
                          );
                        }
                        return (
                          <div className="space-y-2">
                            {alerts.map((alert) => (
                              <div
                                key={alert.id}
                                className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${ALERT_BG[alert.type]}`}
                              >
                                {ALERT_ICON[alert.type]}
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-[#F0F2F8]">
                                    {alert.title}
                                  </p>
                                  <p className="text-xs text-[#A0A8C0]">
                                    {alert.message}
                                  </p>
                                </div>
                                <span className="text-[10px] text-[#5A6380]">
                                  {alert.timestamp.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Company-specific KPIs */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <Card className="border-[#1E2438] bg-[#0C1017]">
                    <CardHeader>
                      <CardTitle className="text-base text-[#F0F2F8]">
                        KPIs &mdash; {selected.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {COMPANY_KPIS[selected.id]?.map((kpi) => {
                          const isInverse =
                            kpi.name.includes("Churn") ||
                            kpi.name.includes("Tempo de Resposta");
                          const isGood = isInverse
                            ? kpi.trend === "down"
                            : kpi.trend === "up";

                          return (
                            <div
                              key={kpi.name}
                              className="rounded-lg bg-[#141824] p-4"
                            >
                              <p className="text-xs text-[#5A6380]">
                                {kpi.name}
                              </p>
                              <p
                                className="mt-1 text-xl font-bold"
                                style={{ color: selected.color }}
                              >
                                {kpi.value}
                              </p>
                              <span
                                className={`text-xs ${
                                  isGood ? "text-emerald-400" : "text-red-400"
                                }`}
                              >
                                {kpi.change}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
