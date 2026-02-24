"use client";

import { useState, useCallback } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { DashboardPage } from "@/components/pages/DashboardPage";
import { IntegrationsPage } from "@/components/pages/IntegrationsPage";
import { CompaniesPage } from "@/components/pages/CompaniesPage";
import { KPIsPage } from "@/components/pages/KPIsPage";
import { MagicActionsPage } from "@/components/pages/MagicActionsPage";
import { AdminPage } from "@/components/pages/AdminPage";
import { SettingsPage } from "@/components/pages/SettingsPage";

// ---------------------------------------------------------------------------
// Page registry — maps page IDs to their components and title keys
// ---------------------------------------------------------------------------

type PageEntry = {
  component: React.ComponentType;
  titleKey: string;
};

const PAGES: Record<string, PageEntry> = {
  dashboard: { component: DashboardPage, titleKey: "Dashboard" },
  integrations: { component: IntegrationsPage, titleKey: "Integrations" },
  companies: { component: CompaniesPage, titleKey: "Companies" },
  kpis: { component: KPIsPage, titleKey: "KPIs" },
  magic: { component: MagicActionsPage, titleKey: "Magic Actions" },
  admin: { component: AdminPage, titleKey: "Admin" },
  settings: { component: SettingsPage, titleKey: "Settings" },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AppShell() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const handleNavigate = useCallback((page: string) => {
    setCurrentPage(page);
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleToggleCollapse = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  // Resolve current page
  const entry = PAGES[currentPage] || PAGES.dashboard;
  const PageComponent = entry.component;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#06080F]">
      {/* ─── Sidebar ─── */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* ─── Main Content Area ─── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar
          pageTitle={entry.titleKey}
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px]">
            <PageComponent />
          </div>
        </main>
      </div>
    </div>
  );
}
