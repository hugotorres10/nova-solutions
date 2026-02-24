"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Clock,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "@/i18n/useTranslation";
import { COMPANIES, MOCK_ALERTS, type Alert } from "@/lib/data";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TopBarProps = {
  pageTitle: string;
  currentPage: string;
  onNavigate?: (page: string) => void;
};

// ---------------------------------------------------------------------------
// Alert type icon + color mapping
// ---------------------------------------------------------------------------

const ALERT_CONFIG: Record<
  Alert["type"],
  { icon: React.ElementType; color: string; bg: string }
> = {
  urgent: {
    icon: AlertTriangle,
    color: "text-[#FF6B6B]",
    bg: "bg-[#FF6B6B]/10",
  },
  important: {
    icon: AlertCircle,
    color: "text-[#FFB300]",
    bg: "bg-[#FFB300]/10",
  },
  info: {
    icon: Info,
    color: "text-[#448AFF]",
    bg: "bg-[#448AFF]/10",
  },
  success: {
    icon: CheckCircle2,
    color: "text-[#00D4AA]",
    bg: "bg-[#00D4AA]/10",
  },
};

// ---------------------------------------------------------------------------
// Time formatting helper
// ---------------------------------------------------------------------------

function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `${diffMin}m`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TopBar({ pageTitle, currentPage, onNavigate }: TopBarProps) {
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadAlerts = MOCK_ALERTS.filter((a) => !a.read);
  const unreadCount = unreadAlerts.length;

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Page title mapping: use section title keys for the page header
  const PAGE_TITLES: Record<string, string> = {
    dashboard: t("dashboard.welcome"),
    integrations: t("integrations.title"),
    companies: t("companies.title"),
    kpis: t("kpis.title"),
    magic: t("magic.title"),
    admin: t("admin.title"),
    settings: t("settings.title"),
  };

  const resolvedTitle = PAGE_TITLES[currentPage] || pageTitle;

  return (
    <TooltipProvider delayDuration={200}>
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#1E2438] bg-[#0A0E17]/80 backdrop-blur-sm px-6 z-10">
        {/* ─── Left: Page Title ─── */}
        <div className="flex items-center gap-4 min-w-0">
          <h1 className="text-lg font-semibold text-[#F0F2F8] truncate">
            {resolvedTitle}
          </h1>
        </div>

        {/* ─── Right: Actions ─── */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div
            className={cn(
              "relative flex items-center transition-all duration-300 ease-in-out",
              searchFocused ? "w-72" : "w-52"
            )}
          >
            <Search className="absolute left-3 h-3.5 w-3.5 text-[#5A6380] pointer-events-none" />
            <Input
              placeholder={t("common.search") + "..."}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="h-9 w-full rounded-lg border-[#1E2438] bg-[#0C1017] pl-9 pr-3 text-xs text-[#F0F2F8] placeholder:text-[#5A6380] focus-visible:ring-[#00D4AA]/30 focus-visible:border-[#00D4AA]/40 transition-all"
            />
          </div>

          {/* Company Pills */}
          <div className="hidden md:flex items-center gap-1.5">
            {COMPANIES.map((company) => (
              <Tooltip key={company.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onNavigate?.("companies")}
                    className="flex items-center gap-1.5 rounded-full border border-[#1E2438] bg-[#0C1017] px-2.5 py-1 text-[10px] font-medium text-[#A0A8C0] transition-all duration-200 hover:border-[color:var(--c)] hover:text-[color:var(--c)]"
                    style={
                      { "--c": company.color } as React.CSSProperties
                    }
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: company.color }}
                    />
                    <span className="truncate max-w-[80px]">
                      {company.name.replace("Empresa ", "")}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="bg-[#141824] text-[#F0F2F8] border-[#1E2438] text-xs"
                >
                  {company.name} &mdash; {company.sector}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Separator */}
          <div className="h-5 w-px bg-[#1E2438] hidden md:block" />

          {/* Notifications Bell */}
          <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
            <DropdownMenuTrigger asChild>
              <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#1E2438] bg-[#0C1017] text-[#A0A8C0] transition-all duration-200 hover:border-[#2A3450] hover:text-[#F0F2F8] hover:bg-[#141824]">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF6B6B] px-1 text-[9px] font-bold text-white shadow-md shadow-[#FF6B6B]/30">
                    {unreadCount}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="bottom"
              align="end"
              className="w-80 bg-[#0C1017] border-[#1E2438] p-0"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E2438]">
                <DropdownMenuLabel className="p-0 text-[#F0F2F8] text-xs font-semibold">
                  {t("dashboard.recent_alerts")}
                </DropdownMenuLabel>
                {unreadCount > 0 && (
                  <Badge className="bg-[#FF6B6B]/10 text-[#FF6B6B] border-none text-[10px] px-1.5 py-0">
                    {unreadCount}
                  </Badge>
                )}
              </div>

              {/* Alert list */}
              <div className="max-h-72 overflow-y-auto">
                {MOCK_ALERTS.slice(0, 6).map((alert) => {
                  const config = ALERT_CONFIG[alert.type];
                  const AlertIcon = config.icon;
                  const company = COMPANIES.find(
                    (c) => c.id === alert.company
                  );

                  return (
                    <div
                      key={alert.id}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 border-b border-[#1E2438]/50 transition-colors hover:bg-[#141824] cursor-pointer",
                        !alert.read && "bg-[#0A0E17]"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg mt-0.5",
                          config.bg
                        )}
                      >
                        <AlertIcon
                          className={cn("h-3.5 w-3.5", config.color)}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-[#F0F2F8] truncate">
                            {alert.title}
                          </span>
                          {!alert.read && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#00D4AA] shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] text-[#5A6380] mt-0.5 line-clamp-2 leading-relaxed">
                          {alert.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {company && (
                            <span
                              className="text-[9px] font-medium"
                              style={{ color: company.color }}
                            >
                              {company.icon} {company.name.replace("Empresa ", "")}
                            </span>
                          )}
                          <span className="text-[9px] text-[#5A6380]">
                            {formatRelativeTime(alert.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-[#1E2438]">
                <button
                  onClick={() => {
                    setNotifOpen(false);
                    onNavigate?.("dashboard");
                  }}
                  className="w-full text-center text-[10px] font-medium text-[#00D4AA] hover:text-[#00D4AA]/80 transition-colors"
                >
                  {t("dashboard.recent_alerts")} &rarr;
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Separator */}
          <div className="h-5 w-px bg-[#1E2438]" />

          {/* Clock */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 rounded-lg border border-[#1E2438] bg-[#0C1017] px-3 py-1.5 select-none">
                <Clock className="h-3.5 w-3.5 text-[#5A6380]" />
                <span className="text-xs font-mono text-[#A0A8C0] tabular-nums">
                  {currentTime.toLocaleTimeString("pt-PT", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="bg-[#141824] text-[#F0F2F8] border-[#1E2438] text-xs"
            >
              {currentTime.toLocaleDateString("pt-PT", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  );
}
