"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { Navbar } from "@/components/common/Navbar";
import { Sidebar } from "@/components/common/Sidebar";
import { CommandPalette } from "@/components/common/CommandPalette";
import { AuthLanding } from "@/components/auth/AuthLanding";

// Employee Views
import { EmployeeDashboard } from "@/components/employee/EmployeeDashboard";
import { AttendanceView } from "@/components/employee/AttendanceView";
import { LeaveManagementView } from "@/components/employee/LeaveManagementView";
import { PayrollView } from "@/components/employee/PayrollView";
import { ProfileView } from "@/components/employee/ProfileView";

// Admin Views
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { EmployeeManagementView } from "@/components/admin/EmployeeManagementView";
import { AttendanceMasterView } from "@/components/admin/AttendanceMasterView";
import { LeaveApprovalsView } from "@/components/admin/LeaveApprovalsView";
import { PayrollMasterView } from "@/components/admin/PayrollMasterView";
import { AnalyticsView } from "@/components/admin/AnalyticsView";

// Shared Upgraded Views
import { CompanySettingsView } from "@/components/company/CompanySettingsView";
import { DocumentsVaultView } from "@/components/documents/DocumentsVaultView";
import { GoalsPerformanceView } from "@/components/goals/GoalsPerformanceView";
import { AnnouncementsView } from "@/components/announcements/AnnouncementsView";
import { HolidaysView } from "@/components/holidays/HolidaysView";
import { AssetManagementView } from "@/components/assets/AssetManagementView";
import { SupportHelpView } from "@/components/support/SupportHelpView";
import { AuditLogsView } from "@/components/audit/AuditLogsView";
import { NotificationCenterView } from "@/components/common/NotificationCenterView";
import { SettingsView } from "@/components/common/SettingsView";

export function MainApp() {
  const { isAuthenticated, currentUser, activeView, setActiveView } = useStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!isAuthenticated || !currentUser) {
    return <AuthLanding />;
  }

  const isAdmin = currentUser.role === "admin" || currentUser.role === "hr";

  const renderActiveView = () => {
    // Strict Role-Based View Guard
    if (!isAdmin && activeView === "audit") {
      return (
        <div className="p-10 text-center space-y-4 rounded-3xl border border-rose-500/20 bg-rose-500/5 max-w-lg mx-auto mt-12">
          <div className="h-12 w-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto text-xl font-bold">
            ✕
          </div>
          <h2 className="text-lg font-bold text-[var(--foreground)]">Access Restricted</h2>
          <p className="text-xs text-[var(--foreground-muted)]">
            You do not have administrative privileges to view company-wide compliance audit logs.
          </p>
          <button
            onClick={() => setActiveView("dashboard")}
            className="px-4 py-2 rounded-xl bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-xs font-semibold text-[var(--foreground)] border border-[var(--border)] cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      );
    }

    switch (activeView) {
      case "dashboard":
        return isAdmin ? <AdminDashboard /> : <EmployeeDashboard />;
      case "employees":
        return <EmployeeManagementView />;
      case "attendance":
        return isAdmin ? <AttendanceMasterView /> : <AttendanceView />;
      case "leave":
        return isAdmin ? <LeaveApprovalsView /> : <LeaveManagementView />;
      case "payroll":
        return isAdmin ? <PayrollMasterView /> : <PayrollView />;
      case "analytics":
        return <AnalyticsView />;
      case "company":
        return <CompanySettingsView />;
      case "documents":
        return <DocumentsVaultView />;
      case "goals":
        return <GoalsPerformanceView />;
      case "announcements":
        return <AnnouncementsView />;
      case "holidays":
        return <HolidaysView />;
      case "assets":
        return <AssetManagementView />;
      case "support":
        return <SupportHelpView />;
      case "audit":
        return <AuditLogsView />;
      case "profile":
        return <ProfileView />;
      case "notifications":
        return <NotificationCenterView />;
      case "settings":
        return <SettingsView />;
      default:
        return isAdmin ? <AdminDashboard /> : <EmployeeDashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[var(--background)] text-[var(--foreground)] antialiased overflow-hidden selection:bg-indigo-500 selection:text-white transition-colors">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fade-in">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-72 h-full bg-[var(--background)] shadow-2xl">
            <Sidebar onCloseMobile={() => setIsMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Navbar onToggleSidebar={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="max-w-7xl mx-auto w-full animate-fade-in">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Command Palette Overlay */}
      <CommandPalette />
    </div>
  );
}
