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
  ArrowRight,
  TrendingUp,
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
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between glass-navbar px-4 sm:px-6 transition-colors">
        {/* Left Section: Brand & Sidebar Toggle */}
        <div className="flex items-center gap-3.5">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl bg-[var(--secondary)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] border border-[var(--border)] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-4.5 w-4.5" />
            </button>
          )}

          <div
            onClick={() => setActiveView("dashboard")}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-sm shadow-indigo-500/20 transition-transform duration-200 group-hover:scale-105">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-extrabold tracking-tight text-[var(--foreground)]">
                  HRFlowX
                </span>
                <span className="hidden sm:inline-flex px-1.5 py-0.2 text-[9px] font-bold rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                  v2.4
                </span>
              </div>
              <span className="hidden md:block text-[10px] text-[var(--foreground-subtle)] font-medium leading-none">
                Human Resource Management
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search / Command Palette Bar */}
        <div className="hidden lg:flex items-center max-w-sm w-full mx-6">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between gap-3 px-3.5 py-2 rounded-xl bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] border border-[var(--border)] text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-all cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-[var(--foreground-subtle)]" />
              <span>Search people, timesheets, payroll...</span>
            </div>
            <kbd className="inline-flex items-center gap-0.5 rounded-md bg-[var(--card)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--foreground-subtle)] border border-[var(--border)]">
              <Command className="h-2.5 w-2.5" /> K
            </kbd>
          </button>
        </div>

        {/* Right Section: Punch Widget, Theme, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Systray Punch In/Out Widget */}
          <div className="hidden sm:flex items-center rounded-xl bg-[var(--card)] border border-[var(--border)] p-1 shadow-2xs">
            <div className="flex items-center gap-2 px-2.5 py-1">
              <span
                className={`h-2 w-2 rounded-full shrink-0 ${
                  isPunchedIn ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                }`}
              />
              <span className="text-[11px] font-semibold text-[var(--foreground)]">
                {isPunchedIn ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                    Since {punchInTime || "08:54 AM"}
                  </span>
                ) : (
                  <span className="text-[var(--foreground-muted)]">Offline</span>
                )}
              </span>
            </div>

            <Button
              variant={isPunchedIn ? "outline" : "primary"}
              size="xs"
              onClick={() => (isPunchedIn ? punchOut() : punchIn("Office"))}
              className="text-[11px] font-semibold"
            >
              {isPunchedIn ? "Check Out →" : "Check IN →"}
            </Button>
          </div>

          {/* Search Trigger for Mobile/Tablet */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex lg:hidden h-9 w-9 items-center justify-center rounded-xl bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] border border-[var(--border)] transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="h-9 w-9 rounded-xl bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] border border-[var(--border)] flex items-center justify-center transition-colors cursor-pointer"
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
          </button>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative h-9 w-9 rounded-xl bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] border border-[var(--border)] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-[var(--card)]">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-modal p-4 shadow-[var(--shadow-elevated)] z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[var(--foreground)]">Notifications</span>
                    {unreadNotificationsCount > 0 && (
                      <Badge variant="purple" size="xs">
                        {unreadNotificationsCount} new
                      </Badge>
                    )}
                  </div>
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="divide-y divide-[var(--border-subtle)] max-h-80 overflow-y-auto mt-2">
                  {notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-3 rounded-xl transition-colors cursor-pointer ${
                        !n.read ? "bg-indigo-500/5 hover:bg-indigo-500/10" : "hover:bg-[var(--secondary)]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-[var(--foreground)] leading-snug">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-[var(--foreground-subtle)] shrink-0 font-mono">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--foreground-muted)] mt-1 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[var(--border)] text-center">
                  <button
                    onClick={() => {
                      setIsNotifOpen(false);
                      setActiveView("notifications");
                    }}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    View all notifications center →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl bg-[var(--secondary)] hover:bg-[var(--secondary-hover)] border border-[var(--border)] transition-all cursor-pointer"
            >
              <Avatar
                src={currentUser?.avatar || currentEmployee?.avatar}
                alt={currentUser?.name || "User"}
                size="sm"
                status={isPunchedIn ? "online" : "offline"}
              />
              <div className="hidden xl:block text-left leading-tight">
                <span className="text-xs font-bold text-[var(--foreground)] block truncate max-w-[110px]">
                  {currentUser?.name || "Arjun Sharma"}
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium capitalize">
                  {isAdmin ? "HR Admin" : "Employee"}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-[var(--foreground-subtle)] ml-0.5" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-modal p-2 shadow-[var(--shadow-elevated)] z-50 animate-fade-in space-y-1">
                <div className="p-3 border-b border-[var(--border)]">
                  <p className="text-xs font-bold text-[var(--foreground)]">{currentUser?.name || "Arjun Sharma"}</p>
                  <p className="text-[11px] text-[var(--foreground-subtle)] truncate">{currentUser?.email}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant={isAdmin ? "purple" : "blue"} size="xs">
                      {isAdmin ? "Administrator" : "Staff Member"}
                    </Badge>
                    <span className="text-[10px] font-mono text-[var(--foreground-subtle)]">
                      {currentUser?.employeeId}
                    </span>
                  </div>
                </div>

                <div className="p-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setIsProfileModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors text-left cursor-pointer"
                  >
                    <User className="h-3.5 w-3.5 text-indigo-500" />
                    <span>View Full Profile Drawer</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      switchDemoRole(isAdmin ? "employee" : "admin");
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-colors text-left cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <Shield className="h-3.5 w-3.5" />
                      <span>Switch to {isAdmin ? "Employee" : "Admin"} View</span>
                    </span>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-purple-500/15">
                      Demo
                    </span>
                  </button>
                </div>

                <div className="pt-1 border-t border-[var(--border)]">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out Session</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Employee Detail Modal */}
      {currentEmployee && (
        <EmployeeDetailModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          employee={currentEmployee}
        />
      )}
    </>
  );
}
