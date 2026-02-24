"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Plug,
  Building2,
  BarChart3,
  Zap,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  Globe,
  LogOut,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/i18n/useTranslation";
import { useLocale } from "@/i18n/LocaleContext";
import { locales } from "@/i18n/locales";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type NavItem = {
  id: string;
  labelKey: string;
  icon: React.ElementType;
};

type SidebarProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
};

// ---------------------------------------------------------------------------
// Navigation config
// ---------------------------------------------------------------------------

const NAV_MAIN: NavItem[] = [
  { id: "dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { id: "integrations", labelKey: "nav.integrations", icon: Plug },
  { id: "companies", labelKey: "nav.companies", icon: Building2 },
  { id: "kpis", labelKey: "nav.kpis", icon: BarChart3 },
  { id: "magic", labelKey: "nav.magic_actions", icon: Zap },
];

const NAV_SECONDARY: NavItem[] = [
  { id: "admin", labelKey: "nav.admin", icon: Shield },
  { id: "settings", labelKey: "nav.settings", icon: Settings },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Sidebar({
  currentPage,
  onNavigate,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();
  const [langOpen, setLangOpen] = useState(false);

  const currentLocaleObj = locales.find((l) => l.code === locale);

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={cn(
          "flex h-screen flex-col border-r border-[#1E2438] bg-[#0A0E17] transition-all duration-300 ease-in-out relative z-20",
          collapsed ? "w-[68px]" : "w-[260px]"
        )}
      >
        {/* ─── Brand ─── */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center gap-3 px-4 border-b border-[#1E2438]",
            collapsed && "justify-center px-0"
          )}
        >
          {/* Logo mark */}
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#00D4AA] to-[#448AFF] shadow-md shadow-[#00D4AA]/20">
            <span className="text-sm font-black text-[#06080F] tracking-tighter">
              NS
            </span>
          </div>

          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-[#F0F2F8] tracking-tight leading-none">
                Nova Solutions
              </span>
              <span className="text-[10px] text-[#5A6380] mt-0.5 leading-none">
                Business Intelligence
              </span>
            </div>
          )}
        </div>

        {/* ─── Navigation ─── */}
        <ScrollArea className="flex-1 py-3">
          <nav className="flex flex-col gap-1 px-3">
            {/* Main nav */}
            {NAV_MAIN.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <NavButton
                  key={item.id}
                  item={item}
                  isActive={isActive}
                  collapsed={collapsed}
                  onClick={() => onNavigate(item.id)}
                  t={t}
                />
              );
            })}

            {/* Separator */}
            <Separator className="my-2 bg-[#1E2438]" />

            {/* Secondary nav */}
            {NAV_SECONDARY.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <NavButton
                  key={item.id}
                  item={item}
                  isActive={isActive}
                  collapsed={collapsed}
                  onClick={() => onNavigate(item.id)}
                  t={t}
                />
              );
            })}
          </nav>
        </ScrollArea>

        {/* ─── Language Selector ─── */}
        <div className="shrink-0 px-3 pb-2">
          <DropdownMenu open={langOpen} onOpenChange={setLangOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[#A0A8C0] transition-all duration-200 hover:bg-[#141824] hover:text-[#F0F2F8]",
                      collapsed && "justify-center px-0"
                    )}
                  >
                    <Globe className="h-4 w-4 shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left text-xs font-medium truncate">
                          {currentLocaleObj?.flag} {currentLocaleObj?.name}
                        </span>
                      </>
                    )}
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="bg-[#141824] text-[#F0F2F8] border-[#1E2438]">
                  {t("nav.language")}
                </TooltipContent>
              )}
            </Tooltip>

            <DropdownMenuContent
              side={collapsed ? "right" : "top"}
              align="start"
              className="w-56 max-h-80 overflow-y-auto bg-[#0C1017] border-[#1E2438] p-1"
            >
              <DropdownMenuLabel className="text-[#5A6380] text-xs">
                {t("nav.language")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#1E2438]" />
              {locales.map((loc) => (
                <DropdownMenuItem
                  key={loc.code}
                  onClick={() => {
                    setLocale(loc.code);
                    setLangOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-md cursor-pointer text-xs",
                    locale === loc.code
                      ? "bg-[#00D4AA]/10 text-[#00D4AA]"
                      : "text-[#A0A8C0] hover:bg-[#141824] hover:text-[#F0F2F8]"
                  )}
                >
                  <span className="text-sm">{loc.flag}</span>
                  <span className="flex-1">{loc.name}</span>
                  {locale === loc.code && (
                    <Check className="h-3 w-3 text-[#00D4AA]" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ─── User Section ─── */}
        <div className="shrink-0 border-t border-[#1E2438] px-3 py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-all duration-200 hover:bg-[#141824] group",
                  collapsed && "justify-center px-0"
                )}
              >
                <Avatar size="default">
                  <AvatarFallback className="bg-gradient-to-br from-[#00D4AA] to-[#448AFF] text-[#06080F] text-xs font-bold">
                    HT
                  </AvatarFallback>
                </Avatar>

                {!collapsed && (
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="text-sm font-semibold text-[#F0F2F8] truncate leading-none">
                      Hugo Torres
                    </span>
                    <span className="text-[10px] text-[#5A6380] mt-0.5 leading-none">
                      Administrator
                    </span>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side={collapsed ? "right" : "top"}
              align="start"
              className="w-48 bg-[#0C1017] border-[#1E2438]"
            >
              <DropdownMenuLabel className="text-[#F0F2F8] text-xs">
                Hugo Torres
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#1E2438]" />
              <DropdownMenuItem
                className="text-[#A0A8C0] text-xs cursor-pointer hover:bg-[#141824] hover:text-[#F0F2F8]"
                onClick={() => onNavigate("settings")}
              >
                <Settings className="mr-2 h-3.5 w-3.5" />
                {t("nav.settings")}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#1E2438]" />
              <DropdownMenuItem className="text-[#FF6B6B] text-xs cursor-pointer hover:bg-[#FF6B6B]/10 hover:text-[#FF6B6B]">
                <LogOut className="mr-2 h-3.5 w-3.5" />
                {t("nav.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ─── Collapse Toggle ─── */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggleCollapse}
              className="absolute -right-3 top-20 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-[#1E2438] bg-[#0C1017] text-[#5A6380] transition-all duration-200 hover:border-[#00D4AA]/40 hover:text-[#00D4AA] hover:bg-[#0A0E17] shadow-lg"
            >
              {collapsed ? (
                <ChevronRight className="h-3 w-3" />
              ) : (
                <ChevronLeft className="h-3 w-3" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-[#141824] text-[#F0F2F8] border-[#1E2438] text-xs"
          >
            {collapsed ? t("sidebar.expand") || "Expand" : t("sidebar.collapse") || "Collapse"}
          </TooltipContent>
        </Tooltip>
      </aside>
    </TooltipProvider>
  );
}

// ---------------------------------------------------------------------------
// Nav Button sub-component
// ---------------------------------------------------------------------------

function NavButton({
  item,
  isActive,
  collapsed,
  onClick,
  t,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
  t: (key: string) => string;
}) {
  const Icon = item.icon;

  const button = (
    <button
      onClick={onClick}
      className={cn(
        "relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
        collapsed && "justify-center px-0",
        isActive
          ? "bg-[#00D4AA]/8 text-[#00D4AA]"
          : "text-[#A0A8C0] hover:bg-[#141824] hover:text-[#F0F2F8]"
      )}
    >
      {/* Active indicator bar */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-[#00D4AA]" />
      )}

      <Icon
        className={cn(
          "h-[18px] w-[18px] shrink-0 transition-colors duration-200",
          isActive
            ? "text-[#00D4AA]"
            : "text-[#5A6380] group-hover:text-[#F0F2F8]"
        )}
      />

      {!collapsed && (
        <span className="truncate">{t(item.labelKey)}</span>
      )}
    </button>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-[#141824] text-[#F0F2F8] border-[#1E2438] text-xs"
        >
          {t(item.labelKey)}
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
}
