"use client";

import React, { useState } from "react";
import {
  Settings,
  Clock,
  Key,
  Shield,
  RotateCcw,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SettingsView() {
  const { resetToDefaultData, currentUser, switchDemoRole } = useStore();
  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "hr";

  const [companyName, setCompanyName] = useState("HRFlowX Technologies Inc.");
  const [shiftStart, setShiftStart] = useState("09:00 AM");
  const [shiftEnd, setShiftEnd] = useState("06:00 PM");
  const [gracePeriod, setGracePeriod] = useState("15");
  const [paidQuota, setPaidQuota] = useState("24");
  const [sickQuota, setSickQuota] = useState("10");

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetData = () => {
    if (confirm("Reset HRFlowX to initial seed demo data? All local edits will be refreshed.")) {
      resetToDefaultData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Settings className="h-6 w-6 text-indigo-400" />
          System Settings & Enterprise Policies
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Configure work shifts, grace periods, leave quotas, and test accounts.
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          Settings updated successfully!
        </div>
      )}

      {resetSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-purple-500/10 border border-purple-500/30 p-3 text-xs text-purple-400">
          <CheckCircle2 className="h-4 w-4" />
          HRFlowX database reset to factory demo records.
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shift Configuration */}
          <Card>
            <CardHeader className="pb-4 border-b border-slate-800">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-400" />
                Standard Working Shifts
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Shift Start Time
                  </label>
                  <Input
                    value={shiftStart}
                    onChange={(e) => setShiftStart(e.target.value)}
                    disabled={!isAdmin}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Shift End Time
                  </label>
                  <Input
                    value={shiftEnd}
                    onChange={(e) => setShiftEnd(e.target.value)}
                    disabled={!isAdmin}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Punctuality Grace Period (Minutes)
                </label>
                <Input
                  type="number"
                  value={gracePeriod}
                  onChange={(e) => setGracePeriod(e.target.value)}
                  disabled={!isAdmin}
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Punches within {gracePeriod} mins of shift start are marked as On-Time.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Leave Policies */}
          <Card>
            <CardHeader className="pb-4 border-b border-slate-800">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-400" />
                Annual Leave Allocations
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Paid Leave Quota (Days)
                  </label>
                  <Input
                    type="number"
                    value={paidQuota}
                    onChange={(e) => setPaidQuota(e.target.value)}
                    disabled={!isAdmin}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                    Sick Leave Quota (Days)
                  </label>
                  <Input
                    type="number"
                    value={sickQuota}
                    onChange={(e) => setSickQuota(e.target.value)}
                    disabled={!isAdmin}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Credentials & Testing */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-4 border-b border-slate-800">
              <CardTitle className="text-base flex items-center gap-2">
                <Key className="h-4 w-4 text-purple-400" />
                Demo Testing Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Arjun Sharma (Employee)</span>
                    <Badge variant="blue" size="sm">Software Engineer</Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 font-mono">
                    Login ID: HXAS20230001<br />
                    Email: employee@hrflowx.io<br />
                    Password: password123
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Priya Mehta (HR Admin)</span>
                    <Badge variant="purple" size="sm">HR Director</Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 font-mono">
                    Login ID: HXPM20220001<br />
                    Email: admin@hrflowx.io<br />
                    Password: admin123
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleResetData}
                  className="gap-2 text-xs"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset Store to Factory Demo Data
                </Button>

                {isAdmin && (
                  <Button type="submit" variant="primary" size="sm" className="gap-1.5 font-semibold">
                    Save System Settings
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
