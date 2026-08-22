"use client";

import React, { useState } from "react";
import {
  Bell,
  Search,
  Moon,
  Sun,
  Shield,
  User,
  LogOut,
  Sparkles,
  Command,
  Clock,
  CheckCircle2,
  Plane,
  X,
  Menu,
  ChevronDown,
  Building,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmployeeDetailModal } from "@/components/employee/EmployeeDetailModal";

export function Navbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const {
    currentUser,
    currentEmployee,
    logout,
    switchDemoRole,
    theme,
    toggleTheme,
    unreadNotificationsCount,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setIsCommandPaletteOpen,
    setActiveView,
    isPunchedIn,
    punchInTime,
    punchIn,
    punchOut,
    company,
  } = useStore();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "hr";

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 sm:px-6 backdrop-blur-xl transition-colors">
        {/* Left Section: Brand & Sidebar Toggle */}
        <div className="flex items-center gap-3.5">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <div
            onClick={() => setActiveView("dashboard")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-all">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                  HRFlowX
                </span>
                <span className="text-[10px] rounded-full bg-indigo-500/20 text-indigo-300 font-mono px-1.5 py-0.5 border border-indigo-500/30">
                  PRO
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium block leading-none">
                {company.name || "Human Resource Management System"}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Global Command Palette Quick Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-xs text-slate-400 hover:border-slate-700 hover:bg-slate-800/60 transition-all shadow-inner"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span>Search employees, timesheets, payroll, policies...</span>
            </div>
            <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-slate-700">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Section: Punch Systray, Notifications, Role, Avatar */}
        <div className="flex items-center gap-3">
          {/* CHECK IN / CHECK OUT SYSTRAY WIDGET MATCHING EXCALIDRAW WIREFRAME 2 */}
          <div className="flex items-center gap-2 rounded-2xl bg-slate-900/90 border border-slate-800/90 p-1.5 shadow-sm">
            {/* Status Dot */}
            <div className="flex items-center gap-1.5 pl-2 pr-1">
              {isPunchedIn ? (
                <span className="flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </span>
              ) : (
                <span className="flex h-3 w-3 items-center justify-center rounded-full bg-rose-500/20 border border-rose-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                </span>
              )}
              <span className="hidden xl:inline text-[11px] font-medium text-slate-300">
                {isPunchedIn ? `Since ${punchInTime || "09:00 AM"}` : "Shift Offline"}
              </span>
            </div>

            {isPunchedIn ? (
              <button
                onClick={punchOut}
                className="px-3 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all hover:scale-105"
              >
                Check Out →
              </button>
            ) : (
              <button
                onClick={() => punchIn("Office")}
                className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-sm text-xs font-semibold transition-all hover:scale-105"
              >
                Check IN →
              </button>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative rounded-xl p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Bell className="h-4 w-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-4 z-50 text-xs animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">Notifications Center</span>
                    <Badge variant="purple" size="sm">{notifications.length}</Badge>
                  </div>
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 divide-y divide-slate-800/40">
                  {notifications.slice(0, 8).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`pt-2 p-2 rounded-xl transition-colors cursor-pointer ${
                        !n.read ? "bg-indigo-950/30 border-l-2 border-indigo-500" : "hover:bg-slate-800/40"
                      }`}
                    >
                      <p className="font-semibold text-white">{n.title}</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">{n.message}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block font-mono">{n.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown with Status Dot */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-800/60 transition-colors"
            >
              <div className="relative">
                <Avatar
                  src={currentEmployee?.avatar}
                  name={currentEmployee?.name || "User"}
                  size="sm"
                  isOnline={isPunchedIn}
                />
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-2 z-50 text-xs animate-in fade-in">
                <div className="p-3 border-b border-slate-800 mb-1">
                  <p className="font-bold text-white text-sm">{currentEmployee?.name}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{currentEmployee?.employeeId}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <Badge variant={isAdmin ? "purple" : "blue"} size="sm">
                      {isAdmin ? "HR Administrator" : "Employee"}
                    </Badge>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 text-left font-medium"
                >
                  <User className="h-3.5 w-3.5 text-indigo-400" />
                  My Profile
                </button>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    switchDemoRole(isAdmin ? "employee" : "admin");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 text-left font-medium"
                >
                  <Shield className="h-3.5 w-3.5 text-purple-400" />
                  Switch to {isAdmin ? "Employee View" : "Admin View"}
                </button>

                <div className="border-t border-slate-800 my-1 pt-1">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-left font-semibold"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Profile Modal */}
      {isProfileModalOpen && currentEmployee && (
        <EmployeeDetailModal
          employee={currentEmployee}
          onClose={() => setIsProfileModalOpen(false)}
          isReadOnly={false}
        />
      )}
    </>
  );
}
