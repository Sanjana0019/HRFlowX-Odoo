"use client";

import React, { useState } from "react";
import {
  Bell,
  CheckCheck,
  CalendarDays,
  CalendarCheck,
  Receipt,
  Sparkles,
  Info,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NotificationType } from "@/types";

export function NotificationCenterView() {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationsCount,
    setActiveView,
  } = useStore();

  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifs = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    return true;
  });

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case "leave_approved":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "leave_rejected":
        return <Clock className="h-4 w-4 text-rose-500" />;
      case "leave_requested":
        return <CalendarDays className="h-4 w-4 text-amber-500" />;
      case "payroll_ready":
        return <Receipt className="h-4 w-4 text-indigo-500" />;
      case "attendance_alert":
        return <CalendarCheck className="h-4 w-4 text-teal-500" />;
      default:
        return <Sparkles className="h-4 w-4 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2.5">
            <Bell className="h-6 w-6 text-indigo-500" />
            Notification Inbox & Activity Alerts
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-0.5">
            Review status changes for timesheets, leave approvals, payroll statements, and policy announcements.
          </p>
        </div>

        {unreadNotificationsCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllNotificationsAsRead}
            className="gap-1.5 font-semibold text-xs"
          >
            <CheckCheck className="h-4 w-4" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex p-1 rounded-2xl bg-[var(--secondary)] border border-[var(--border-subtle)] max-w-xs">
        <button
          onClick={() => setFilter("all")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            filter === "all"
              ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
              : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
            filter === "unread"
              ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
              : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          }`}
        >
          <span>Unread</span>
          {unreadNotificationsCount > 0 && (
            <Badge variant="purple" size="xs">
              {unreadNotificationsCount}
            </Badge>
          )}
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                !n.read
                  ? "bg-[var(--card)] border-indigo-500/30 shadow-[var(--shadow-card)]"
                  : "bg-[var(--card)] border-[var(--card-border)] opacity-80 hover:opacity-100"
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--secondary)] border border-[var(--border-subtle)] shrink-0">
                {getIconForType(n.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-[var(--foreground)]">
                    {n.title}
                  </span>
                  <span className="text-[10px] text-[var(--foreground-subtle)] font-mono shrink-0">
                    {n.timestamp}
                  </span>
                </div>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                  {n.message}
                </p>
              </div>

              {!n.read && (
                <div className="h-2 w-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
              )}
            </div>
          ))
        ) : (
          <div className="p-12 text-center space-y-2 rounded-2xl bg-[var(--card)] border border-[var(--card-border)] text-[var(--foreground-muted)]">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
            <p className="text-sm font-bold text-[var(--foreground)]">Inbox is All Caught Up</p>
            <p className="text-xs text-[var(--foreground-subtle)]">No unread notifications at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
