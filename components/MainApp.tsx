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
  const { isAuthenticated, currentUser, activeView } = useStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!isAuthenticated || !currentUser) {
    return <AuthLanding />;
  }

  const isAdmin = currentUser.role === "admin" || currentUser.role === "hr";

  const renderActiveView = () => {
    // Strict Role-Based View Guard
    if (!isAdmin && activeView === "audit") {
      return (
        <div className="p-12 text-center space-y-4 rounded-3xl border border-rose-500/30 bg-rose-950/20 max-w-lg mx-auto mt-12">
          <div className="h-12 w-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-xl font-bold">
            ✕
          </div>
          <h2 className="text-lg font-bold text-white">Access Restricted</h2>
          <p className="text-xs text-slate-300">
            You do not have administrative privileges to view company-wide compliance audit logs.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-white hover:bg-slate-700"
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
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 antialiased overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Backdrop & Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-slate-950 shadow-2xl z-50">
            <Sidebar onCloseMobile={() => setIsMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Workspace Frame */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Global Cmd+K Search Command Palette */}
      <CommandPalette />
    </div>
  );
}
