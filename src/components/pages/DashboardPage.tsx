"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plug,
  Link,
  Database,
  Zap,
  TrendingUp,
  TrendingDown,
  Bell,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/i18n/useTranslation";
import {
  COMPANIES,
  INTEGRATIONS,
  STATS,
  MOCK_ALERTS,
  MOCK_KPI_DATA,
} from "@/lib/data";
import type { Alert } from "@/lib/data";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type StatItem = {
  id: string;
  icon: "plug" | "link" | "database" | "zap";
  labelKey: string;
  value: number;
  color: string;
};

const STAT_ITEMS: StatItem[] = [
  { id: "integrations", icon: "plug", labelKey: "dashboard.total_integrations", value: STATS.totalIntegrations, color: "#00D4AA" },
  { id: "connections", icon: "link", labelKey: "dashboard.active_connections", value: STATS.totalConnections, color: "#448AFF" },
  { id: "datapoints", icon: "database", labelKey: "dashboard.data_points", value: STATS.totalDataPoints, color: "#E040FB" },
  { id: "magic", icon: "zap", labelKey: "dashboard.magic_actions", value: STATS.totalMagicActions, color: "#FFB300" },
];

type KPIItem = {
  id: string;
  labelKey: string;
  value: string;
  change: number;
  lowerIsBetter: boolean;
  sparkline: number[];
};

const KPI_ITEMS: KPIItem[] = [
  { id: "mrr", labelKey: "dashboard.kpi_mrr", value: `€${MOCK_KPI_DATA.mrr.current.toLocaleString()}`, change: MOCK_KPI_DATA.mrr.change, lowerIsBetter: false, sparkline: [30, 35, 32, 40, 38, 42, 48] },
  { id: "pipeline", labelKey: "dashboard.kpi_pipeline", value: `€${(MOCK_KPI_DATA.pipeline.current / 1000).toFixed(0)}K`, change: MOCK_KPI_DATA.pipeline.change, lowerIsBetter: false, sparkline: [50, 52, 48, 55, 58, 56, 62] },
  { id: "emailResponseTime", labelKey: "dashboard.kpi_response_time", value: `${MOCK_KPI_DATA.emailResponseTime.current}h`, change: MOCK_KPI_DATA.emailResponseTime.change, lowerIsBetter: true, sparkline: [4, 3.5, 3.2, 3, 2.8, 2.5, 2.3] },
  { id: "openDeals", labelKey: "dashboard.kpi_open_deals", value: String(MOCK_KPI_DATA.openDeals.current), change: MOCK_KPI_DATA.openDeals.change, lowerIsBetter: false, sparkline: [22, 24, 26, 28, 29, 31, 34] },
];

const STAT_ICONS: Record<StatItem["icon"], React.ElementType> = {
  plug: Plug,
  link: Link,
  database: Database,
  zap: Zap,
};

const ALERT_DOT_COLORS: Record<Alert["type"], string> = {
  urgent: "#FF6B6B",
  important: "#FFB300",
  info: "#448AFF",
  success: "#00D4AA",
};

function timeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 60) return `${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  return `${diffH}h`;
}

function formatDate(locale: string): string {
  const now = new Date();
  try {
    return now.toLocaleDateString(locale === "pt" ? "pt-PT" : locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return now.toLocaleDateString("pt-PT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

// ---------------------------------------------------------------------------
// Animation presets
// ---------------------------------------------------------------------------

const fadeSlide = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: "easeOut" as const },
  }),
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SparklineBars({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-[3px] h-10">
      {data.map((v, i) => {
        const h = Math.max(4, (v / max) * 100);
        return (
          <div
            key={i}
            className="rounded-sm transition-all duration-300"
            style={{
              height: `${h}%`,
              width: 6,
              backgroundColor: color,
              opacity: 0.25 + (i / data.length) * 0.75,
            }}
          />
        );
      })}
    </div>
  );
}

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const { t } = useTranslation();
  const Icon = STAT_ICONS[stat.icon];

  return (
    <motion.div
      custom={index}
      variants={fadeSlide}
      initial="hidden"
      animate="visible"
    >
      <Card className="bg-[#0C1017] border-[#1E2438] py-5 gap-4 hover:border-[#2E3A52] transition-colors duration-300 group">
        <CardContent className="px-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <Icon size={20} style={{ color: stat.color }} />
              </div>
              <span className="text-sm font-medium text-[#A0A8C0]">
                {t(stat.labelKey)}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <span
              className="text-3xl font-bold tracking-tight"
              style={{ color: stat.color }}
            >
              {stat.value}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function KPICard({ kpi, index }: { kpi: KPIItem; index: number }) {
  const { t } = useTranslation();
  const isPositiveChange = kpi.change >= 0;
  const displayChange = `${isPositiveChange ? "+" : ""}${kpi.change}%`;
  // For "lower is better" metrics, a negative change is good (green)
  const isGood = kpi.lowerIsBetter ? kpi.change <= 0 : kpi.change >= 0;
  const changeColor = isGood ? "#00D4AA" : "#FF6B6B";
  const TrendIcon = isPositiveChange ? TrendingUp : TrendingDown;
  const ArrowIcon = isPositiveChange ? ArrowUpRight : ArrowDownRight;

  return (
    <motion.div
      custom={index + 4}
      variants={fadeSlide}
      initial="hidden"
      animate="visible"
    >
      <Card className="bg-[#0C1017] border-[#1E2438] py-5 gap-3 hover:border-[#2E3A52] transition-colors duration-300 group overflow-hidden relative">
        {/* Subtle top-border glow */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] opacity-40"
          style={{
            background: `linear-gradient(90deg, transparent, ${changeColor}, transparent)`,
          }}
        />
        <CardContent className="px-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-[#A0A8C0]">
              {t(kpi.labelKey)}
            </span>
            <div
              className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                color: changeColor,
                backgroundColor: `${changeColor}12`,
              }}
            >
              <ArrowIcon size={12} />
              {displayChange}
            </div>
          </div>
          <div className="flex items-end justify-between mt-2">
            <span className="text-2xl font-bold text-[#F0F2F8] tracking-tight">
              {kpi.value}
            </span>
            <SparklineBars data={kpi.sparkline} color={changeColor} />
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            <TrendIcon size={14} style={{ color: changeColor }} />
            <span className="text-xs" style={{ color: changeColor }}>
              {displayChange} vs. last month
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AlertItem({ alert, index }: { alert: Alert; index: number }) {
  const dotColor = ALERT_DOT_COLORS[alert.type];
  const company = COMPANIES.find((c) => c.id === alert.company);
  const companyColor = company?.color || "#5A6380";
  const companyName = company?.name || alert.company;

  return (
    <motion.div
      custom={index + 8}
      variants={fadeSlide}
      initial="hidden"
      animate="visible"
      className="flex items-start gap-3 py-3 border-b border-[#1E2438]/60 last:border-b-0 group/alert hover:bg-[#0E1320] -mx-2 px-2 rounded-lg transition-colors duration-200"
    >
      {/* Status dot */}
      <div className="mt-1.5 shrink-0">
        <div
          className="h-2.5 w-2.5 rounded-full pulse-dot"
          style={{ backgroundColor: dotColor }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-[#F0F2F8] truncate">
            {alert.title}
          </span>
          <Badge
            className="text-[10px] px-1.5 py-0 h-4 rounded-md border-0 shrink-0"
            style={{
              backgroundColor: `${companyColor}18`,
              color: companyColor,
            }}
          >
            {companyName}
          </Badge>
        </div>
        <p className="text-xs text-[#5A6380] truncate max-w-[340px]">
          {alert.message}
        </p>
      </div>

      {/* Time */}
      <div className="flex items-center gap-1 text-[11px] text-[#5A6380] shrink-0 mt-0.5">
        <Clock size={11} />
        {timeAgo(alert.timestamp)}
      </div>
    </motion.div>
  );
}

function CompanyCard({
  company,
  index,
}: {
  company: (typeof COMPANIES)[number];
  index: number;
}) {
  const { t } = useTranslation();

  return (
    <motion.div
      custom={index + 10}
      variants={fadeSlide}
      initial="hidden"
      animate="visible"
    >
      <Card className="bg-[#0C1017] border-[#1E2438] py-4 gap-3 hover:border-[#2E3A52] transition-all duration-300 group overflow-hidden relative">
        {/* Left accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
          style={{ backgroundColor: company.color }}
        />

        <CardContent className="px-5">
          {/* Header row */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg text-lg transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: `${company.color}15` }}
            >
              {company.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-[#F0F2F8] truncate">
                {company.name}
              </h4>
              <p className="text-xs text-[#5A6380]">{company.sector}</p>
            </div>
          </div>

          {/* Company Info */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-[#5A6380] mb-1">
                {t("dashboard.sector")}
              </p>
              <p
                className="text-sm font-bold truncate"
                style={{ color: company.color }}
              >
                {company.sector.split(" ")[0]}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-[#5A6380] mb-1">
                {t("dashboard.model")}
              </p>
              <p className="text-sm font-bold text-[#F0F2F8] truncate">
                {company.model.split(" ")[0]}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-[#5A6380] mb-1">
                Status
              </p>
              <p className={`text-sm font-bold ${company.active ? "text-[#00D4AA]" : "text-[#FF6B6B]"}`}>
                {company.active ? "Ativa" : "Inativa"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function IntegrationStatusBar() {
  const { t } = useTranslation();

  return (
    <motion.div
      custom={14}
      variants={fadeSlide}
      initial="hidden"
      animate="visible"
    >
      <Card className="bg-[#0C1017] border-[#1E2438] py-4 gap-2">
        <CardHeader className="px-5 pb-0">
          <CardTitle className="text-sm font-semibold text-[#A0A8C0] flex items-center gap-2">
            <Plug size={16} className="text-[#5A6380]" />
            {t("dashboard.integration_status")}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5">
          <div className="flex flex-wrap gap-3">
            {INTEGRATIONS.map((integration) => (
              <div
                key={integration.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1E2438] bg-[#080B14] hover:bg-[#0E1320] transition-colors duration-200 group/int"
              >
                <div
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: integration.connected
                      ? "#00D4AA"
                      : "#FF6B6B",
                    boxShadow: integration.connected
                      ? "0 0 6px rgba(0,212,170,0.4)"
                      : "0 0 6px rgba(255,107,107,0.4)",
                  }}
                />
                <span className="text-xs font-medium text-[#A0A8C0] group-hover/int:text-[#F0F2F8] transition-colors duration-200">
                  {integration.name}
                </span>
                <span className="text-[10px] text-[#5A6380]">
                  {integration.connected
                    ? t("dashboard.connected")
                    : t("dashboard.disconnected")}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export function DashboardPage() {
  const { t, locale } = useTranslation();
  const dateStr = useMemo(() => formatDate(locale), [locale]);

  return (
    <div className="min-h-screen bg-[#06080F] p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-[1440px] space-y-6">
        {/* ─── Welcome Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#F0F2F8] tracking-tight">
              {t("dashboard.welcome")}
            </h1>
            <p className="text-sm text-[#5A6380] mt-1">
              {t("dashboard.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#A0A8C0]">
            <Clock size={14} className="text-[#5A6380]" />
            <span className="capitalize">{dateStr}</span>
          </div>
        </motion.div>

        {/* ─── Stats Row (4 cards) ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_ITEMS.map((stat, i) => (
            <StatCard key={stat.id} stat={stat} index={i} />
          ))}
        </div>

        {/* ─── KPI Grid (2x2) ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {KPI_ITEMS.map((kpi, i) => (
            <KPICard key={kpi.id} kpi={kpi} index={i} />
          ))}
        </div>

        {/* ─── Two Columns: Alerts + Companies ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Recent Alerts */}
          <motion.div
            custom={8}
            variants={fadeSlide}
            initial="hidden"
            animate="visible"
          >
            <Card className="bg-[#0C1017] border-[#1E2438] py-4 gap-2 h-full">
              <CardHeader className="px-5 pb-0">
                <CardTitle className="text-sm font-semibold text-[#A0A8C0] flex items-center gap-2">
                  <Bell size={16} className="text-[#FFB300]" />
                  {t("dashboard.recent_alerts")}
                  <Badge className="ml-auto text-[10px] px-1.5 py-0 h-4 rounded-md bg-[#FF6B6B]/15 text-[#FF6B6B] border-0">
                    {MOCK_ALERTS.filter((a) => a.type === "urgent").length}{" "}
                    urgent
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5">
                <div className="divide-y-0">
                  {MOCK_ALERTS.map((alert, i) => (
                    <AlertItem key={alert.id} alert={alert} index={i} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: Company Overview */}
          <motion.div
            custom={9}
            variants={fadeSlide}
            initial="hidden"
            animate="visible"
          >
            <Card className="bg-[#0C1017] border-[#1E2438] py-4 gap-2 h-full">
              <CardHeader className="px-5 pb-0">
                <CardTitle className="text-sm font-semibold text-[#A0A8C0] flex items-center gap-2">
                  <Building2 size={16} className="text-[#448AFF]" />
                  {t("dashboard.company_overview")}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 space-y-4">
                {COMPANIES.map((company, i) => (
                  <CompanyCard key={company.id} company={company} index={i} />
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ─── Integration Status Bar ─── */}
        <IntegrationStatusBar />
      </div>
    </div>
  );
}
