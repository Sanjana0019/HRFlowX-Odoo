"use client";

import React, { useState, useEffect } from "react";
import { Clock, CheckCircle2, LogOut, MapPin, Coffee, Sparkles, Building, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import confetti from "canvas-confetti";

export function LivePunchCard() {
  const { isPunchedIn, todayAttendance, punchIn, punchOut, currentEmployee } = useStore();
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [isOnBreak, setIsOnBreak] = useState<boolean>(false);
  const [location, setLocation] = useState<"Office" | "Remote">("Office");

  // Real-time ticking clock & duration calculation
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      );

      if (isPunchedIn && todayAttendance?.checkIn) {
        try {
          const [timePart, modifier] = todayAttendance.checkIn.split(" ");
          let [hours, minutes] = timePart.split(":").map(Number);
          if (modifier === "PM" && hours < 12) hours += 12;
          if (modifier === "AM" && hours === 12) hours = 0;

          const checkInDate = new Date();
          checkInDate.setHours(hours, minutes, 0, 0);

          const diffMs = Math.max(0, now.getTime() - checkInDate.getTime());
          const diffSecs = Math.floor(diffMs / 1000);
          const h = Math.floor(diffSecs / 3600);
          const m = Math.floor((diffSecs % 3600) / 60);
          const s = diffSecs % 60;

          const pad = (n: number) => n.toString().padStart(2, "0");
          setElapsedTime(`${pad(h)}h ${pad(m)}m ${pad(s)}s`);
        } catch {
          setElapsedTime("00h 00m 00s");
        }
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isPunchedIn, todayAttendance]);

  const handlePunchIn = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#10b981", "#38bdf8", "#ec4899"],
      });
    } catch {}
    punchIn(location);
  };

  const handlePunchOut = () => {
    punchOut();
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[var(--card-border)] bg-[var(--card)] p-6 sm:p-7 shadow-[var(--shadow-card)] space-y-6 glass-card">
      {/* Top Header: Live Status & Location Pill */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full shrink-0 ${
              isPunchedIn ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
            }`}
          />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
            {isPunchedIn ? "Active Shift In Progress" : "Shift Offline"}
          </span>
        </div>

        {/* Location selector */}
        <div className="flex items-center rounded-xl bg-[var(--secondary)] border border-[var(--border-subtle)] p-0.5 text-[11px] font-semibold">
          <button
            onClick={() => setLocation("Office")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              location === "Office"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-2xs font-bold"
                : "text-[var(--foreground-muted)]"
            }`}
          >
            <Building className="h-3 w-3" /> Office
          </button>
          <button
            onClick={() => setLocation("Remote")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              location === "Remote"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-2xs font-bold"
                : "text-[var(--foreground-muted)]"
            }`}
          >
            <Laptop className="h-3 w-3" /> Remote
          </button>
        </div>
      </div>

      {/* Clock Display */}
      <div className="text-center space-y-1.5 py-2">
        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-[var(--foreground)]">
          {currentTime || "09:00:00 AM"}
        </div>
        <p className="text-xs text-[var(--foreground-muted)] font-medium">{currentDate}</p>
      </div>

      {/* Timer / Shift Info Strip */}
      <div className="p-4 rounded-2xl bg-[var(--secondary)] border border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono">
        <div>
          <span className="text-[10px] text-[var(--foreground-subtle)] uppercase block font-sans">
            Shift Punch-In
          </span>
          <span className="font-bold text-[var(--foreground)]">
            {isPunchedIn && todayAttendance?.checkIn ? todayAttendance.checkIn : "Not Punched"}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-[var(--foreground-subtle)] uppercase block font-sans">
            Elapsed Duration
          </span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {isPunchedIn ? elapsedTime : "00h 00m 00s"}
          </span>
        </div>
      </div>

      {/* Primary Action Button */}
      <div>
        {isPunchedIn ? (
          <Button
            variant="destructive"
            size="lg"
            onClick={handlePunchOut}
            className="w-full font-bold shadow-md gap-2"
          >
            <LogOut className="h-4 w-4" />
            Check Out of Shift
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            onClick={handlePunchIn}
            className="w-full font-bold shadow-md gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Punch IN ({location}) →
          </Button>
        )}
      </div>
    </div>
  );
}
