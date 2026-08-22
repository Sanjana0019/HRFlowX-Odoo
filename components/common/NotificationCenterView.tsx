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
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case "leave_rejected":
        return <Clock className="h-4 w-4 text-rose-400" />;
      case "leave_requested":
        return <CalendarDays className="h-4 w-4 text-amber-400" />;
      case "payroll_ready":
        return <Receipt className="h-4 w-4 text-indigo-400" />;
      case "attendance_alert":
        return <CalendarCheck className="h-4 w-4 text-teal-400" />;
      default:
        return <Sparkles className="h-4 w-4 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Bell className="h-6 w-6 text-indigo-400" />
            Notifications & System Alerts
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-time feed of leave updates, attendance reminders, and payroll distributions.
          </p>
        </div>

        {unreadNotificationsCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllNotificationsAsRead}
            className="gap-2 text-xs"
          >
            <CheckCheck className="h-4 w-4" />
            Mark All as Read ({unreadNotificationsCount})
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Inbox Feed</CardTitle>
            <Badge variant="purple" size="sm">
              {notifications.length} Total
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 rounded-xl bg-slate-800/80 p-1 border border-slate-700/80">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                filter === "all"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All Alerts
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                filter === "unread"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Unread ({unreadNotificationsCount})
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-slate-800/60">
            {filteredNotifs.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-40 text-indigo-400" />
                <p className="text-sm font-medium text-slate-400">All caught up!</p>
                <p className="text-xs text-slate-500 mt-0.5">No unread notifications at this time.</p>
              </div>
            ) : (
              filteredNotifs.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markNotificationAsRead(n.id)}
                  className={`flex items-start justify-between gap-4 p-4.5 transition-colors cursor-pointer ${
                    !n.read
                      ? "bg-indigo-950/20 hover:bg-indigo-950/40"
                      : "hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-slate-700/80 shadow-sm">
                      {getIconForType(n.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-xs font-bold ${!n.read ? "text-white" : "text-slate-300"}`}>
                          {n.title}
                        </h4>
                        {!n.read && (
                          <span className="h-2 w-2 rounded-full bg-indigo-500" />
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                      <span className="text-[10px] text-slate-500 mt-2 block font-mono">
                        {n.timestamp}
                      </span>
                    </div>
                  </div>

                  <Badge variant="outline" size="sm" className="capitalize text-[10px] flex-shrink-0">
                    {n.type.replace("_", " ")}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
