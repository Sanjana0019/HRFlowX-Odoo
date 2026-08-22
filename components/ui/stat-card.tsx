import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  description?: string;
  iconColor?: string;
  iconBg?: string;
  accentColor?: "indigo" | "emerald" | "amber" | "rose" | "purple" | "blue";
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  description,
  iconColor = "text-indigo-400",
  iconBg = "bg-indigo-500/10 border-indigo-500/20",
  accentColor = "indigo",
  onClick,
}: StatCardProps) {
  const accentGlows = {
    indigo: "hover:border-indigo-500/40 hover:shadow-indigo-500/10",
    emerald: "hover:border-emerald-500/40 hover:shadow-emerald-500/10",
    amber: "hover:border-amber-500/40 hover:shadow-amber-500/10",
    rose: "hover:border-rose-500/40 hover:shadow-rose-500/10",
    purple: "hover:border-purple-500/40 hover:shadow-purple-500/10",
    blue: "hover:border-blue-500/40 hover:shadow-blue-500/10",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5",
        accentGlows[accentColor],
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl border", iconBg)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
        {change && (
          <span
            className={cn(
              "inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border",
              isPositive
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
            )}
          >
            {change}
          </span>
        )}
      </div>

      {description && <p className="mt-2 text-xs text-slate-400">{description}</p>}
    </div>
  );
}
