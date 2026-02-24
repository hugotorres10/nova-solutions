"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Settings,
  Plug,
  Building2,
  Bot,
  ScrollText,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Clock,
  Plus,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { INTEGRATIONS, COMPANIES } from "@/lib/data";
import { useTranslation } from "@/i18n/useTranslation";

type TabKey = "integrations" | "companies" | "agents" | "logs";

type LogEntry = {
  id: string;
  time: string;
  message: string;
  level: "info" | "success" | "warning" | "error";
};

const MOCK_LOGS: LogEntry[] = [
  { id: "l1", time: "14:23:15", message: "Gmail sync completed -- 12 new emails classified", level: "success" },
  { id: "l2", time: "14:20:00", message: "CRM pipeline updated -- 2 deals moved to negotiation", level: "success" },
  { id: "l3", time: "14:15:32", message: "Calendar briefing generated for 14:30 meeting", level: "info" },
  { id: "l4", time: "14:10:00", message: "News scan -- 3 relevant articles found for Empresa Alpha", level: "info" },
  { id: "l5", time: "14:05:44", message: "Stripe webhook received -- new subscription activated", level: "success" },
  { id: "l6", time: "14:02:18", message: "Slack message classified as urgent -- notification sent", level: "warning" },
  { id: "l7", time: "13:58:00", message: "GitHub PR #47 review summary generated", level: "info" },
  { id: "l8", time: "13:45:22", message: "Google Analytics traffic spike detected (+67%)", level: "warning" },
  { id: "l9", time: "13:42:00", message: "Notion sprint board synced -- 78% completion", level: "info" },
  { id: "l10", time: "13:30:15", message: "HubSpot lead scoring completed -- 4 new MQLs", level: "success" },
  { id: "l11", time: "13:25:00", message: "Zapier connection failed -- authentication expired", level: "error" },
  { id: "l12", time: "13:20:33", message: "Google Drive backup completed -- 234 files synced", level: "success" },
  { id: "l13", time: "13:15:00", message: "Agent auto-briefing sent to Slack #general", level: "info" },
  { id: "l14", time: "13:10:45", message: "Payment failure detected -- retry scheduled for 14:00", level: "warning" },
  { id: "l15", time: "13:05:00", message: "Jira connection timeout -- retrying in 5 minutes", level: "error" },
  { id: "l16", time: "13:00:00", message: "Daily report generated -- sent to admin@novasolutions.com", level: "success" },
  { id: "l17", time: "12:55:12", message: "Calendar conflict detected -- 2 overlapping meetings", level: "warning" },
  { id: "l18", time: "12:50:00", message: "System health check passed -- all services operational", level: "info" },
  { id: "l19", time: "12:45:30", message: "Magic Action approved -- follow-up email sent to VIP client", level: "success" },
  { id: "l20", time: "12:40:00", message: "Database backup completed -- 2.3GB compressed", level: "info" },
];

const logLevelConfig = {
  info: { color: "text-[#448AFF]", bg: "bg-[#448AFF]/10", icon: Info },
  success: { color: "text-[#00D4AA]", bg: "bg-[#00D4AA]/10", icon: CheckCircle2 },
  warning: { color: "text-[#FFB300]", bg: "bg-[#FFB300]/10", icon: AlertTriangle },
  error: { color: "text-[#FF6B6B]", bg: "bg-[#FF6B6B]/10", icon: XCircle },
};

const tabs: { key: TabKey; labelKey: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "integrations", labelKey: "admin.tab_integrations", icon: Plug },
  { key: "companies", labelKey: "admin.tab_companies", icon: Building2 },
  { key: "agents", labelKey: "admin.tab_agents", icon: Bot },
  { key: "logs", labelKey: "admin.tab_logs", icon: ScrollText },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariant = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

export function AdminPage() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<TabKey>("integrations");
  const [integrationStates, setIntegrationStates] = useState<Record<string, boolean>>(() => {
    const states: Record<string, boolean> = {};
    INTEGRATIONS.forEach((i) => {
      states[i.id] = i.connected;
    });
    return states;
  });
  const [companyStates, setCompanyStates] = useState<Record<string, boolean>>(() => {
    const states: Record<string, boolean> = {};
    COMPANIES.forEach((c) => {
      states[c.id] = c.active;
    });
    return states;
  });
  const [masterToggle, setMasterToggle] = useState(true);
  const [logFilter, setLogFilter] = useState<"all" | "info" | "success" | "warning" | "error">("all");
  const [agentModel, setAgentModel] = useState("claude-sonnet-4-5");
  const [magicActionsEnabled, setMagicActionsEnabled] = useState(true);
  const [autoBriefingEnabled, setAutoBriefingEnabled] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState("5");
  const [responseTime, setResponseTime] = useState("< 2s");

  // Per-company integration toggles
  const [perCompanyToggles, setPerCompanyToggles] = useState<Record<string, Record<string, boolean>>>(() => {
    const toggles: Record<string, Record<string, boolean>> = {};
    INTEGRATIONS.forEach((i) => {
      if (i.perCompany) {
        toggles[i.id] = {};
        COMPANIES.forEach((c) => {
          toggles[i.id][c.id] = true;
        });
      }
    });
    return toggles;
  });

  // Company edit states
  const [companyNames, setCompanyNames] = useState<Record<string, string>>(() => {
    const names: Record<string, string> = {};
    COMPANIES.forEach((c) => { names[c.id] = c.name; });
    return names;
  });
  const [companySectors, setCompanySectors] = useState<Record<string, string>>(() => {
    const sectors: Record<string, string> = {};
    COMPANIES.forEach((c) => { sectors[c.id] = c.sector; });
    return sectors;
  });
  const [companyModels, setCompanyModels] = useState<Record<string, string>>(() => {
    const models: Record<string, string> = {};
    COMPANIES.forEach((c) => { models[c.id] = c.model; });
    return models;
  });

  const handleMasterToggle = (checked: boolean) => {
    setMasterToggle(checked);
    const newStates: Record<string, boolean> = {};
    INTEGRATIONS.forEach((i) => {
      newStates[i.id] = checked;
    });
    setIntegrationStates(newStates);
  };

  const filteredLogs = useMemo(() => {
    if (logFilter === "all") return MOCK_LOGS;
    return MOCK_LOGS.filter((l) => l.level === logFilter);
  }, [logFilter]);

  const colorOptions = ["#00D4AA", "#448AFF", "#E040FB", "#FFB300", "#FF6B6B", "#7C4DFF"];

  return (
    <div className="min-h-screen bg-[#0A0E17] p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E040FB]/10">
              <Shield className="h-5 w-5 text-[#E040FB]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#F0F2F8]">{t("admin.title")}</h1>
              <p className="text-sm text-[#A0A8C0]">{t("admin.subtitle")}</p>
            </div>
          </div>
        </motion.div>

        {/* System Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex items-center justify-between rounded-xl border border-[#00D4AA]/20 bg-[#00D4AA]/5 px-5 py-3"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00D4AA] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#00D4AA]" />
            </span>
            <span className="text-sm font-medium text-[#00D4AA]">{t("admin.all_systems")}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs text-[#A0A8C0]">
              <span className="text-[#5A6380]">{t("admin.uptime")}:</span>
              <span className="font-semibold text-[#00D4AA]">99.97%</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#A0A8C0]">
              <Clock className="h-3.5 w-3.5 text-[#5A6380]" />
              <span className="text-[#5A6380]">{t("admin.last_sync")}:</span>
              <span className="font-medium text-[#F0F2F8]">{t("admin.ago_min", { n: "2" })}</span>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-6 flex gap-1 rounded-xl border border-[#1E2438] bg-[#0C1017] p-1"
        >
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-[#448AFF]/10 text-[#448AFF]"
                    : "text-[#5A6380] hover:text-[#A0A8C0] hover:bg-[#0A0E17]"
                }`}
              >
                <TabIcon className="h-4 w-4" />
                {t(tab.labelKey)}
              </button>
            );
          })}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Integrations Tab */}
          {activeTab === "integrations" && (
            <div className="space-y-4">
              {/* Master Toggle */}
              <div className="flex items-center justify-between rounded-xl border border-[#1E2438] bg-[#0C1017] p-4">
                <div className="flex items-center gap-3">
                  <Settings className="h-4 w-4 text-[#5A6380]" />
                  <div>
                    <p className="text-sm font-medium text-[#F0F2F8]">{t("admin.master_toggle")}</p>
                    <p className="text-xs text-[#5A6380]">{t("admin.all_integrations")}</p>
                  </div>
                </div>
                <Switch
                  checked={masterToggle}
                  onCheckedChange={handleMasterToggle}
                  className="data-[state=checked]:bg-[#00D4AA]"
                />
              </div>

              {/* Integration List */}
              <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
                {INTEGRATIONS.map((integration) => {
                  const isEnabled = integrationStates[integration.id] ?? integration.connected;

                  return (
                    <motion.div
                      key={integration.id}
                      variants={itemVariant}
                      className={`rounded-xl border bg-[#0C1017] p-4 transition-all ${
                        isEnabled ? "border-[#1E2438]" : "border-[#1E2438]/50 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg ${isEnabled ? "bg-[#448AFF]/10" : "bg-[#1E2438]"}`}>
                            {integration.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-[#F0F2F8]">{integration.name}</span>
                              <Badge
                                variant="outline"
                                className="border-[#1E2438] text-[10px] text-[#5A6380] px-1.5 py-0"
                              >
                                {integration.type}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className={`flex items-center gap-1 text-xs ${isEnabled ? "text-[#00D4AA]" : "text-[#FF6B6B]"}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${isEnabled ? "bg-[#00D4AA]" : "bg-[#FF6B6B]"}`} />
                                {isEnabled ? t("admin.connected") : t("admin.disconnected")}
                              </span>
                              <span className="text-xs text-[#5A6380]">{integration.refresh}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button className="rounded-lg border border-[#1E2438] px-3 py-1.5 text-xs text-[#A0A8C0] transition-all hover:border-[#448AFF]/30 hover:text-[#448AFF]">
                            <RefreshCw className="mr-1.5 inline h-3 w-3" />
                            {t("admin.test_connection")}
                          </button>
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={(checked) =>
                              setIntegrationStates((prev) => ({ ...prev, [integration.id]: checked }))
                            }
                            className="data-[state=checked]:bg-[#00D4AA]"
                          />
                        </div>
                      </div>

                      {/* Per-company toggles */}
                      {integration.perCompany && isEnabled && (
                        <div className="mt-3 flex flex-wrap gap-4 border-t border-[#1E2438] pt-3">
                          {COMPANIES.map((company) => (
                            <div key={company.id} className="flex items-center gap-2">
                              <Switch
                                checked={perCompanyToggles[integration.id]?.[company.id] ?? true}
                                onCheckedChange={(checked) =>
                                  setPerCompanyToggles((prev) => ({
                                    ...prev,
                                    [integration.id]: {
                                      ...prev[integration.id],
                                      [company.id]: checked,
                                    },
                                  }))
                                }
                                className="data-[state=checked]:bg-[#00D4AA]"
                                size="sm"
                              />
                              <span className="text-xs text-[#A0A8C0]">{company.icon} {company.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          )}

          {/* Companies Tab */}
          {activeTab === "companies" && (
            <div className="space-y-4">
              <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
                {COMPANIES.map((company) => (
                  <motion.div
                    key={company.id}
                    variants={itemVariant}
                    className="rounded-xl border border-[#1E2438] bg-[#0C1017] p-5"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                          style={{ backgroundColor: `${company.color}15` }}
                        >
                          {company.icon}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-[#F0F2F8]">{company.name}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className={`flex items-center gap-1 text-xs ${
                                companyStates[company.id] ? "text-[#00D4AA]" : "text-[#FF6B6B]"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  companyStates[company.id] ? "bg-[#00D4AA]" : "bg-[#FF6B6B]"
                                }`}
                              />
                              {companyStates[company.id] ? t("admin.active") : t("admin.inactive")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={companyStates[company.id] ?? true}
                        onCheckedChange={(checked) =>
                          setCompanyStates((prev) => ({ ...prev, [company.id]: checked }))
                        }
                        className="data-[state=checked]:bg-[#00D4AA]"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div>
                        <label className="mb-1 block text-xs text-[#5A6380]">Nome</label>
                        <Input
                          value={companyNames[company.id] || ""}
                          onChange={(e) =>
                            setCompanyNames((prev) => ({ ...prev, [company.id]: e.target.value }))
                          }
                          className="h-8 border-[#1E2438] bg-[#0A0E17] text-xs text-[#F0F2F8] focus-visible:ring-[#448AFF]/30"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-[#5A6380]">{t("admin.sector")}</label>
                        <Input
                          value={companySectors[company.id] || ""}
                          onChange={(e) =>
                            setCompanySectors((prev) => ({ ...prev, [company.id]: e.target.value }))
                          }
                          className="h-8 border-[#1E2438] bg-[#0A0E17] text-xs text-[#F0F2F8] focus-visible:ring-[#448AFF]/30"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs text-[#5A6380]">{t("admin.business_model")}</label>
                        <Input
                          value={companyModels[company.id] || ""}
                          onChange={(e) =>
                            setCompanyModels((prev) => ({ ...prev, [company.id]: e.target.value }))
                          }
                          className="h-8 border-[#1E2438] bg-[#0A0E17] text-xs text-[#F0F2F8] focus-visible:ring-[#448AFF]/30"
                        />
                      </div>
                    </div>

                    {/* Color picker */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-[#5A6380]">Cor:</span>
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          className={`h-5 w-5 rounded-full border-2 transition-all ${
                            company.color === color
                              ? "border-white scale-110"
                              : "border-transparent hover:border-[#5A6380]"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#1E2438] bg-[#0C1017] py-3 text-sm text-[#5A6380] transition-all hover:border-[#448AFF]/30 hover:text-[#448AFF]">
                <Plus className="h-4 w-4" />
                {t("admin.add_company")}
              </button>
            </div>
          )}

          {/* Agent Configuration Tab */}
          {activeTab === "agents" && (
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-[#1E2438] bg-[#0C1017] p-5"
              >
                {/* Agent Identity */}
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E040FB]/10">
                    <Bot className="h-6 w-6 text-[#E040FB]" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-[#F0F2F8]">AGENT::OPS</h3>
                    <p className="text-xs text-[#A0A8C0]">Chief Operations Officer</p>
                  </div>
                </div>

                <Separator className="mb-5 bg-[#1E2438]" />

                <div className="space-y-5">
                  {/* Model Selector */}
                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#5A6380]">{t("admin.model")}</label>
                    <div className="flex gap-2">
                      {[
                        { value: "claude-sonnet-4-5", label: "Claude Sonnet 4.5" },
                        { value: "claude-opus-4-6", label: "Claude Opus 4.6" },
                      ].map((model) => (
                        <button
                          key={model.value}
                          onClick={() => setAgentModel(model.value)}
                          className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                            agentModel === model.value
                              ? "border-[#E040FB]/30 bg-[#E040FB]/10 text-[#E040FB]"
                              : "border-[#1E2438] text-[#5A6380] hover:border-[#2A3450] hover:text-[#A0A8C0]"
                          }`}
                        >
                          {model.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Response Time */}
                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#5A6380]">{t("admin.response_time")}</label>
                    <Input
                      value={responseTime}
                      onChange={(e) => setResponseTime(e.target.value)}
                      className="border-[#1E2438] bg-[#0A0E17] text-sm text-[#F0F2F8] focus-visible:ring-[#448AFF]/30"
                    />
                  </div>

                  <Separator className="bg-[#1E2438]" />

                  {/* Toggle Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#F0F2F8]">{t("admin.magic_actions")}</p>
                        <p className="text-xs text-[#5A6380]">Ativar/desativar todas as magic actions</p>
                      </div>
                      <Switch
                        checked={magicActionsEnabled}
                        onCheckedChange={setMagicActionsEnabled}
                        className="data-[state=checked]:bg-[#FFB300]"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-[#F0F2F8]">{t("admin.auto_briefing")}</p>
                        <p className="text-xs text-[#5A6380]">Briefings automaticos antes de reunioes</p>
                      </div>
                      <Switch
                        checked={autoBriefingEnabled}
                        onCheckedChange={setAutoBriefingEnabled}
                        className="data-[state=checked]:bg-[#448AFF]"
                      />
                    </div>
                  </div>

                  <Separator className="bg-[#1E2438]" />

                  {/* Alert Threshold */}
                  <div>
                    <label className="mb-2 block text-xs font-medium text-[#5A6380]">{t("admin.alert_threshold")}</label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        value={alertThreshold}
                        onChange={(e) => setAlertThreshold(e.target.value)}
                        className="w-24 border-[#1E2438] bg-[#0A0E17] text-sm text-[#F0F2F8] focus-visible:ring-[#448AFF]/30"
                        min="1"
                        max="50"
                      />
                      <span className="text-xs text-[#5A6380]">alertas por hora antes de escalar</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === "logs" && (
            <div className="space-y-4">
              {/* Log Filter */}
              <div className="flex gap-1 rounded-lg border border-[#1E2438] bg-[#0C1017] p-1">
                {(["all", "info", "success", "warning", "error"] as const).map((level) => {
                  const labelMap: Record<string, string> = {
                    all: t("admin.filter_all"),
                    info: t("admin.filter_info"),
                    success: "Success",
                    warning: t("admin.filter_warning"),
                    error: t("admin.filter_error"),
                  };
                  const colorMap: Record<string, string> = {
                    all: "text-[#F0F2F8]",
                    info: "text-[#448AFF]",
                    success: "text-[#00D4AA]",
                    warning: "text-[#FFB300]",
                    error: "text-[#FF6B6B]",
                  };
                  const bgActive = level === "all"
                    ? "bg-[#448AFF]/10"
                    : logLevelConfig[level].bg;
                  return (
                    <button
                      key={level}
                      onClick={() => setLogFilter(level)}
                      className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                        logFilter === level
                          ? `${bgActive} ${colorMap[level]}`
                          : "text-[#5A6380] hover:text-[#A0A8C0]"
                      }`}
                    >
                      {labelMap[level]}
                    </button>
                  );
                })}
              </div>

              {/* Log Entries */}
              <div className="rounded-xl border border-[#1E2438] bg-[#0C1017]">
                <ScrollArea className="h-[500px]">
                  <div className="p-2">
                    <motion.div variants={container} initial="hidden" animate="show">
                      {filteredLogs.map((log) => {
                        const config = logLevelConfig[log.level];
                        const LogIcon = config.icon;
                        return (
                          <motion.div
                            key={log.id}
                            variants={itemVariant}
                            className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-[#0A0E17]"
                          >
                            <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded ${config.bg}`}>
                              <LogIcon className={`h-3 w-3 ${config.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-[#F0F2F8]">{log.message}</p>
                            </div>
                            <span className="shrink-0 font-mono text-xs text-[#5A6380]">[{log.time}]</span>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
