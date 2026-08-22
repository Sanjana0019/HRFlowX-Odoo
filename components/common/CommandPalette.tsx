"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Users,
  Clock,
  CreditCard,
  Building,
  CalendarDays,
  FileText,
  HelpCircle,
  Laptop,
  FolderLock,
  ArrowRight,
  ShieldCheck,
  Command,
  X,
  Target,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setActiveView,
    employees,
    currentUser,
    switchDemoRole,
    isPunchedIn,
    punchIn,
    punchOut,
  } = useStore();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "hr";

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === "Escape" && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  // Reset search when opened
  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isCommandPaletteOpen]);

  // Action & Navigation Items
  const staticItems = useMemo(() => {
    return [
      {
        id: "nav-dashboard",
        category: "Navigation",
        title: "Executive & Team Dashboard",
        icon: LayoutDashboard,
        action: () => setActiveView("dashboard"),
      },
      {
        id: "nav-employees",
        category: "Navigation",
        title: "Workforce Directory & Org Roster",
        icon: Users,
        action: () => setActiveView("employees"),
      },
      {
        id: "nav-attendance",
        category: "Navigation",
        title: "Biometric Timesheets & Punch Clock",
        icon: Clock,
        action: () => setActiveView("attendance"),
      },
      {
        id: "nav-leave",
        category: "Navigation",
        title: "Time Off & Leave Balance Manager",
        icon: CalendarDays,
        action: () => setActiveView("leave"),
      },
      {
        id: "nav-payroll",
        category: "Navigation",
        title: "Compensation & Monthly Payslips",
        icon: CreditCard,
        action: () => setActiveView("payroll"),
      },
      {
        id: "nav-goals",
        category: "Navigation",
        title: "Company Goals & Team OKRs",
        icon: Target,
        action: () => setActiveView("goals"),
      },
      {
        id: "nav-documents",
        category: "Navigation",
        title: "Documents Vault & Policies",
        icon: FolderLock,
        action: () => setActiveView("documents"),
      },
      {
        id: "nav-assets",
        category: "Navigation",
        title: "IT Hardware Assets Vault",
        icon: Laptop,
        action: () => setActiveView("assets"),
      },
      {
        id: "act-punch",
        category: "Quick Actions",
        title: isPunchedIn ? "Punch Out of Shift" : "Punch IN to Current Shift",
        icon: Clock,
        action: () => (isPunchedIn ? punchOut() : punchIn()),
      },
      {
        id: "act-role",
        category: "Quick Actions",
        title: `Switch Demo Persona to ${isAdmin ? "Arjun Sharma (Employee)" : "Priya Mehta (HR Admin)"}`,
        icon: ShieldCheck,
        action: () => switchDemoRole(isAdmin ? "employee" : "admin"),
      },
    ];
  }, [isAdmin, isPunchedIn, setActiveView, switchDemoRole, punchIn, punchOut]);

  // Dynamic filtered results
  const filteredResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return staticItems;

    const matchedStatic = staticItems.filter((i) =>
      i.title.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
    );

    const matchedEmployees = employees
      .filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.employeeId.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          e.designation.toLowerCase().includes(q)
      )
      .map((e) => ({
        id: `emp-${e.id}`,
        category: "Employees",
        title: `${e.name} — ${e.designation} (${e.department})`,
        subtitle: e.employeeId,
        avatar: e.avatar,
        action: () => setActiveView("employees"),
      }));

    return [...matchedStatic, ...matchedEmployees];
  }, [query, staticItems, employees, setActiveView]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-xl transition-opacity"
        onClick={() => setIsCommandPaletteOpen(false)}
      />

      {/* Command Window */}
      <div className="relative w-full max-w-2xl rounded-2xl sm:rounded-3xl glass-modal p-0 shadow-[var(--shadow-modal)] z-10 overflow-hidden border border-[var(--border)]">
        {/* Search Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)] bg-[var(--card)]">
          <Search className="h-4.5 w-4.5 text-[var(--foreground-subtle)] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, employee name, ID, or view..."
            className="w-full bg-transparent text-sm sm:text-base text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none font-medium"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-mono rounded-md bg-[var(--secondary)] text-[var(--foreground-subtle)] border border-[var(--border)]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-[var(--border-subtle)]">
          {filteredResults.length === 0 ? (
            <div className="p-10 text-center space-y-2 text-[var(--foreground-muted)]">
              <Sparkles className="h-7 w-7 text-indigo-400 mx-auto opacity-60" />
              <p className="text-xs font-semibold text-[var(--foreground)]">No matching results found</p>
              <p className="text-[11px] text-[var(--foreground-subtle)]">
                Try searching for "Arjun", "Priya", "Attendance", or "Payroll"
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {filteredResults.map((item, idx) => {
                const Icon = (item as any).icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      item.action();
                      setIsCommandPaletteOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-colors text-left cursor-pointer ${
                      idx === selectedIndex
                        ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                        : "hover:bg-[var(--secondary)] text-[var(--foreground)] font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {(item as any).avatar ? (
                        <Avatar src={(item as any).avatar} alt={item.title} size="xs" />
                      ) : Icon ? (
                        <div className="h-7 w-7 rounded-lg bg-[var(--secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--foreground-muted)]">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                      ) : null}
                      <div className="truncate">
                        <span className="truncate block">{item.title}</span>
                        {(item as any).subtitle && (
                          <span className="text-[10px] font-mono text-[var(--foreground-subtle)] block">
                            {(item as any).subtitle}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--foreground-subtle)] bg-[var(--secondary)] px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-[var(--foreground-subtle)] opacity-60" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--background-subtle)] border-t border-[var(--border)] text-[10px] text-[var(--foreground-subtle)]">
          <div className="flex items-center gap-3">
            <span>Navigation: <kbd className="font-mono">↑↓</kbd></span>
            <span>Select: <kbd className="font-mono">↵</kbd></span>
          </div>
          <span className="font-mono">HRFlowX Spotlight</span>
        </div>
      </div>
    </div>
  );
}
