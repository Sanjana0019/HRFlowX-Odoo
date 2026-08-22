"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarDays,
  Receipt,
  BarChart3,
  UserCheck,
  Bell,
  Settings,
  Sun,
  Moon,
  Clock,
  Sparkles,
  LogOut,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";

export function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActiveView,
    currentUser,
    switchDemoRole,
    theme,
    toggleTheme,
    employees,
    isPunchedIn,
    punchIn,
    punchOut,
    logout,
  } = useStore();

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isCommandPaletteOpen) {
      setSearch("");
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "hr";

  const navigationItems = [
    { label: "Dashboard", icon: LayoutDashboard, view: "dashboard", category: "Navigation" },
    { label: "Attendance Records", icon: CalendarCheck, view: "attendance", category: "Navigation" },
    { label: "Leave Management", icon: CalendarDays, view: "leave", category: "Navigation" },
    { label: "Payroll & Payslips", icon: Receipt, view: "payroll", category: "Navigation" },
    { label: "My Profile", icon: UserIcon, view: "profile", category: "Navigation" },
    { label: "Notification Center", icon: Bell, view: "notifications", category: "Navigation" },
    { label: "Settings", icon: Settings, view: "settings", category: "Navigation" },
    ...(isAdmin
      ? [
          { label: "Employee Directory", icon: Users, view: "employees", category: "Admin Management" },
          { label: "HR Analytics & Reports", icon: BarChart3, view: "analytics", category: "Admin Management" },
        ]
      : []),
  ];

  const filteredNav = navigationItems.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const filteredEmployees = employees
    .filter(
      (e) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.department.toLowerCase().includes(search.toLowerCase()) ||
        e.designation.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 5);

  const handleSelectNav = (view: string) => {
    setActiveView(view);
    setIsCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={() => setIsCommandPaletteOpen(false)}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl z-10 animate-in zoom-in-95 duration-150">
        {/* Search input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/90">
          <Search className="h-5 w-5 text-indigo-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            placeholder="Type a command or search employees, pages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block rounded bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-400 border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {/* Quick Actions */}
          <div className="py-2">
            <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Quick Actions
            </p>
            {!isPunchedIn ? (
              <button
                onClick={() => {
                  punchIn();
                  setIsCommandPaletteOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm text-emerald-400 hover:bg-slate-800/80 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                <span>Punch In Now (Live Check-In)</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  punchOut();
                  setIsCommandPaletteOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm text-rose-400 hover:bg-slate-800/80 transition-colors"
              >
                <Clock className="h-4 w-4" />
                <span>Punch Out (End Shift)</span>
              </button>
            )}

            <button
              onClick={() => {
                switchDemoRole(isAdmin ? "employee" : "admin");
                setIsCommandPaletteOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm text-indigo-300 hover:bg-slate-800/80 transition-colors"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Switch to {isAdmin ? "Employee View (Alex Rivera)" : "Admin/HR View (Sarah Jenkins)"}</span>
            </button>

            <button
              onClick={() => {
                toggleTheme();
                setIsCommandPaletteOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm text-slate-300 hover:bg-slate-800/80 transition-colors"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-400" />}
              <span>Toggle Theme ({theme === "dark" ? "Light Mode" : "Dark Mode"})</span>
            </button>
          </div>

          {/* Navigation */}
          {filteredNav.length > 0 && (
            <div className="py-2">
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Navigation
              </p>
              {filteredNav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.view}
                    onClick={() => handleSelectNav(item.view)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors"
                  >
                    <Icon className="h-4 w-4 text-slate-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Employees Search */}
          {search && filteredEmployees.length > 0 && (
            <div className="py-2">
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Colleagues
              </p>
              {filteredEmployees.map((emp) => (
                <button
                  key={emp.employeeId}
                  onClick={() => {
                    setActiveView(isAdmin ? "employees" : "profile");
                    setIsCommandPaletteOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-sm text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar src={emp.avatar} name={emp.name} size="sm" />
                    <div>
                      <p className="font-medium text-white text-xs">{emp.name}</p>
                      <span className="text-[10px] text-slate-400">{emp.designation}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {emp.department}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Logout */}
          <div className="py-2">
            <button
              onClick={() => {
                logout();
                setIsCommandPaletteOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm text-rose-400 hover:bg-slate-800/80 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-800 bg-slate-900/60 text-[11px] text-slate-500">
          <span>HRFlowX HRMS Command Center</span>
          <span>Press ⌘K anytime to open</span>
        </div>
      </div>
    </div>
  );
}
