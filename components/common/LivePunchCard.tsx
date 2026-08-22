"use client";

import React, { useState, useEffect } from "react";
import { Clock, CheckCircle2, LogOut, MapPin, Coffee, Sparkles } from "lucide-react";
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
        // Calculate seconds elapsed from checkIn time today
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
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#10b981", "#38bdf8", "#ec4899"],
      });
    } catch {
      // ignore
    }
    punchIn(location);
  };

  const handlePunchOut = () => {
    punchOut();
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 p-6 shadow-xl backdrop-blur-md">
      {/* Background ambient lighting */}
      <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left info */}
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Live Attendance Punch Engine
            </p>
          </div>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
            {currentTime || "--:--:--"}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{currentDate}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {isPunchedIn ? (
              <Badge variant="success" size="md" className="gap-1.5 px-3 py-1 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Punched In at {todayAttendance?.checkIn}
              </Badge>
            ) : todayAttendance?.checkOut ? (
              <Badge variant="default" size="md" className="gap-1.5 px-3 py-1">
                <LogOut className="h-3.5 w-3.5 text-amber-400" />
                Shift Ended at {todayAttendance.checkOut}
              </Badge>
            ) : (
              <Badge variant="warning" size="md" className="gap-1.5 px-3 py-1">
                <Clock className="h-3.5 w-3.5" />
                Not Checked In Yet
              </Badge>
            )}

            {isPunchedIn && (
              <div className="flex items-center gap-1.5 rounded-lg bg-slate-800/80 px-3 py-1 border border-slate-700/60 text-xs font-mono text-emerald-400 font-semibold shadow-inner">
                <Clock className="h-3.5 w-3.5 text-emerald-400" />
                Working: {elapsedTime}
              </div>
            )}
          </div>
        </div>

        {/* Right action buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {!isPunchedIn ? (
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              {/* Location toggle */}
              <div className="flex items-center rounded-xl bg-slate-800/80 border border-slate-700/80 p-1">
                <button
                  type="button"
                  onClick={() => setLocation("Office")}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    location === "Office"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <MapPin className="h-3 w-3" />
                  Office
                </button>
                <button
                  type="button"
                  onClick={() => setLocation("Remote")}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    location === "Remote"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Remote
                </button>
              </div>

              <Button
                variant="emerald"
                size="lg"
                onClick={handlePunchIn}
                className="gap-2 shadow-emerald-500/20 font-semibold"
              >
                <Sparkles className="h-4 w-4 animate-bounce" />
                PUNCH IN NOW
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Button
                variant={isOnBreak ? "warning" : "secondary"}
                size="md"
                onClick={() => setIsOnBreak(!isOnBreak)}
                className="gap-1.5"
              >
                <Coffee className="h-4 w-4" />
                {isOnBreak ? "Resume Work" : "Take Break"}
              </Button>

              <Button
                variant="destructive"
                size="md"
                onClick={handlePunchOut}
                className="gap-2 font-semibold"
              >
                <LogOut className="h-4 w-4" />
                PUNCH OUT
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
