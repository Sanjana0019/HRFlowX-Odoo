import React from "react";
import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100">
      <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-xl shadow-indigo-500/25 animate-pulse">
          <Sparkles className="h-7 w-7 text-white" />
        </div>
        <div className="text-center space-y-1">
          <span className="text-sm font-extrabold tracking-tight text-white block">HRFlowX</span>
          <span className="text-xs text-slate-400 font-medium">Initializing enterprise workspace...</span>
        </div>
      </div>
    </div>
  );
}
