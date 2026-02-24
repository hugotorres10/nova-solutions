"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  CheckCircle2,
  XCircle,
  Filter,
  Sparkles,
  Shield,
  ChevronDown,
} from "lucide-react";
import { INTEGRATIONS, STATS } from "@/lib/data";
import { useTranslation } from "@/i18n/useTranslation";
import type { MagicAction } from "@/lib/data";

type FlatAction = MagicAction & {
  key: string;
  integrationId: string;
  integrationName: string;
  integrationIcon: string;
};

function getAllMagicActions(): FlatAction[] {
  const actions: FlatAction[] = [];
  for (const integration of INTEGRATIONS) {
    integration.magicActions.forEach((ma, idx) => {
      actions.push({
        ...ma,
        key: `${integration.id}-ma-${idx}`,
        integrationId: integration.id,
        integrationName: integration.name,
        integrationIcon: integration.icon,
      });
    });
  }
  return actions;
}

function isAutomatic(authority: string): boolean {
  const lower = authority.toLowerCase();
  return lower.includes("autom") && !lower.includes("aprova") && !lower.includes("decide");
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function MagicActionsPage() {
  const { t } = useTranslation();
  const allActions = useMemo(() => getAllMagicActions(), []);
  const totalCount = typeof STATS === "object" && "totalMagicActions" in STATS
    ? (STATS as { totalMagicActions: number }).totalMagicActions
    : allActions.length;

  const [filter, setFilter] = useState("all");
  const [authorityFilter, setAuthorityFilter] = useState("all");
  const [integrationFilter, setIntegrationFilter] = useState("all");
  const [approved, setApproved] = useState<Record<string, boolean>>({});
  const [rejected, setRejected] = useState<Record<string, boolean>>({});
  const [showIntegrationDropdown, setShowIntegrationDropdown] = useState(false);

  const filteredActions = useMemo(() => {
    let result = allActions;

    if (authorityFilter === "automatic") {
      result = result.filter((a) => isAutomatic(a.authority));
    } else if (authorityFilter === "approval") {
      result = result.filter((a) => !isAutomatic(a.authority));
    }

    if (integrationFilter !== "all") {
      result = result.filter((a) => a.integrationId === integrationFilter);
    }

    return result;
  }, [allActions, filter, authorityFilter, integrationFilter]);

  const approvedCount = Object.values(approved).filter(Boolean).length;
  const rejectedCount = Object.values(rejected).filter(Boolean).length;
  const pendingCount = allActions.length - approvedCount - rejectedCount;
  const automaticCount = allActions.filter((a) => isAutomatic(a.authority)).length;

  const handleApprove = (actionKey: string) => {
    setApproved((prev) => ({ ...prev, [actionKey]: true }));
    setRejected((prev) => {
      const next = { ...prev };
      delete next[actionKey];
      return next;
    });
  };

  const handleReject = (actionKey: string) => {
    setRejected((prev) => ({ ...prev, [actionKey]: true }));
    setApproved((prev) => {
      const next = { ...prev };
      delete next[actionKey];
      return next;
    });
  };

  const filterButtons = [
    { key: "all", label: t("magic.filter_all") },
    { key: "reply", label: t("magic.filter_reply") },
    { key: "action", label: t("magic.filter_action") },
    { key: "alerts", label: t("magic.filter_alerts") },
  ];

  const authorityButtons = [
    { key: "all", label: t("magic.authority_all") },
    { key: "automatic", label: t("magic.authority_auto") },
    { key: "approval", label: t("magic.authority_approval") },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E17] p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFB300]/10">
              <Zap className="h-5 w-5 text-[#FFB300]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#F0F2F8] flex items-center gap-2">
                {t("magic.title")}
                <span className="ml-2 rounded-full bg-[#FFB300]/10 px-3 py-0.5 text-sm font-medium text-[#FFB300]">
                  {totalCount}
                </span>
              </h1>
              <p className="text-sm text-[#A0A8C0]">{t("magic.subtitle")}</p>
            </div>
          </div>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-xl border border-[#1E2438] bg-[#0C1017] p-4"
        >
          <div className="flex flex-wrap items-center gap-4">
            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#5A6380]" />
              <div className="flex gap-1">
                {filterButtons.map((btn) => (
                  <button
                    key={btn.key}
                    onClick={() => setFilter(btn.key)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      filter === btn.key
                        ? "bg-[#448AFF]/10 text-[#448AFF]"
                        : "text-[#5A6380] hover:text-[#A0A8C0] hover:bg-[#1E2438]"
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-6 w-px bg-[#1E2438]" />

            {/* Authority Filter */}
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#5A6380]" />
              <div className="flex gap-1">
                {authorityButtons.map((btn) => (
                  <button
                    key={btn.key}
                    onClick={() => setAuthorityFilter(btn.key)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      authorityFilter === btn.key
                        ? "bg-[#E040FB]/10 text-[#E040FB]"
                        : "text-[#5A6380] hover:text-[#A0A8C0] hover:bg-[#1E2438]"
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-6 w-px bg-[#1E2438]" />

            {/* Integration Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowIntegrationDropdown(!showIntegrationDropdown)}
                className="flex items-center gap-2 rounded-lg border border-[#1E2438] bg-[#0A0E17] px-3 py-1.5 text-xs font-medium text-[#A0A8C0] transition-all hover:border-[#448AFF]/30"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#5A6380]" />
                {integrationFilter === "all"
                  ? t("magic.integration")
                  : INTEGRATIONS.find((i) => i.id === integrationFilter)?.name}
                <ChevronDown className="h-3 w-3 text-[#5A6380]" />
              </button>
              {showIntegrationDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 z-50 mt-1 max-h-64 w-56 overflow-y-auto rounded-lg border border-[#1E2438] bg-[#0C1017] py-1 shadow-xl"
                >
                  <button
                    onClick={() => {
                      setIntegrationFilter("all");
                      setShowIntegrationDropdown(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs transition-colors ${
                      integrationFilter === "all"
                        ? "bg-[#448AFF]/10 text-[#448AFF]"
                        : "text-[#A0A8C0] hover:bg-[#1E2438]"
                    }`}
                  >
                    {t("magic.filter_all")}
                  </button>
                  {INTEGRATIONS.map((integration) => (
                    <button
                      key={integration.id}
                      onClick={() => {
                        setIntegrationFilter(integration.id);
                        setShowIntegrationDropdown(false);
                      }}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors ${
                        integrationFilter === integration.id
                          ? "bg-[#448AFF]/10 text-[#448AFF]"
                          : "text-[#A0A8C0] hover:bg-[#1E2438]"
                      }`}
                    >
                      <span className="text-sm">{integration.icon}</span>
                      <span className="truncate">{integration.name}</span>
                      <span className="ml-auto text-[#5A6380]">
                        {integration.magicActions.length}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Actions List */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredActions.map((action) => {
              const isApproved = approved[action.key];
              const isRejected = rejected[action.key];
              const auto = isAutomatic(action.authority);

              return (
                <motion.div
                  key={action.key}
                  variants={item}
                  layout
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`rounded-xl border bg-[#0C1017] p-5 transition-all ${
                    isApproved
                      ? "border-[#00D4AA]/20"
                      : isRejected
                        ? "border-[#FF6B6B]/20"
                        : "border-[#1E2438] hover:border-[#2A3450]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Integration badge */}
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-sm">{action.integrationIcon}</span>
                        <span className="text-xs font-medium text-[#5A6380] truncate">
                          {action.integrationName}
                        </span>
                      </div>

                      {/* Trigger */}
                      <p className="mb-1 text-xs text-[#A0A8C0]">
                        <span className="text-[#5A6380]">{t("magic.trigger")}:</span>{" "}
                        {action.trigger}
                      </p>

                      {/* Action description */}
                      <p className="text-sm font-semibold text-[#F0F2F8]">
                        {action.action}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-3 shrink-0">
                      {/* Authority badge */}
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${
                          auto
                            ? "bg-[#00D4AA]/10 text-[#00D4AA]"
                            : action.authority.toLowerCase().includes("decide")
                              ? "bg-[#FFB300]/10 text-[#FFB300]"
                              : "bg-[#E040FB]/10 text-[#E040FB]"
                        }`}
                      >
                        {action.authority}
                      </span>

                      {/* Action buttons */}
                      {isApproved ? (
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: [1.15, 1] }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center gap-1.5 rounded-lg bg-[#00D4AA]/10 px-3 py-1.5 text-xs font-medium text-[#00D4AA]"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {t("magic.approved")}
                        </motion.div>
                      ) : isRejected ? (
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: [1.15, 1] }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center gap-1.5 rounded-lg bg-[#FF6B6B]/10 px-3 py-1.5 text-xs font-medium text-[#FF6B6B]"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          {t("magic.rejected")}
                        </motion.div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(action.key)}
                            className="flex items-center gap-1.5 rounded-lg bg-[#00D4AA]/10 px-3 py-1.5 text-xs font-medium text-[#00D4AA] transition-all hover:bg-[#00D4AA]/20 active:scale-95"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {t("magic.approve")}
                          </button>
                          <button
                            onClick={() => handleReject(action.key)}
                            className="flex items-center gap-1.5 rounded-lg border border-[#FF6B6B]/20 px-3 py-1.5 text-xs font-medium text-[#FF6B6B] transition-all hover:bg-[#FF6B6B]/10 active:scale-95"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            {t("magic.reject")}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex items-center justify-center gap-6 rounded-xl border border-[#1E2438] bg-[#0C1017] p-4"
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#00D4AA]" />
            <span className="text-sm text-[#A0A8C0]">
              <span className="font-semibold text-[#00D4AA]">{approvedCount}</span>{" "}
              {t("magic.approved_count")}
            </span>
          </div>
          <div className="h-4 w-px bg-[#1E2438]" />
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#FFB300]" />
            <span className="text-sm text-[#A0A8C0]">
              <span className="font-semibold text-[#FFB300]">{pendingCount}</span>{" "}
              {t("magic.pending")}
            </span>
          </div>
          <div className="h-4 w-px bg-[#1E2438]" />
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#448AFF]" />
            <span className="text-sm text-[#A0A8C0]">
              <span className="font-semibold text-[#448AFF]">{automaticCount}</span>{" "}
              {t("magic.automatic")}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
