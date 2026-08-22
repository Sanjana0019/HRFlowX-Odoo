import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

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
  iconColor,
  iconBg,
  accentColor = "indigo",
  onClick,
}: StatCardProps) {
  const accentBorderStyles = {
    indigo: "hover:border-indigo-500/40 hover:shadow-indigo-500/10",
    emerald: "hover:border-emerald-500/40 hover:shadow-emerald-500/10",
    amber: "hover:border-amber-500/40 hover:shadow-amber-500/10",
    rose: "hover:border-rose-500/40 hover:shadow-rose-500/10",
    purple: "hover:border-purple-500/40 hover:shadow-purple-500/10",
    blue: "hover:border-sky-500/40 hover:shadow-sky-500/10",
  };

  const defaultIconBgs = {
    indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    blue: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-5 sm:p-6 shadow-[var(--shadow-card)] transition-all duration-200",
        accentBorderStyles[accentColor],
        onClick && "cursor-pointer active:scale-[0.99]"
      )}
    >
      {/* Top Row: Title and Icon Badge */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
          {title}
        </span>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-110",
            iconBg || defaultIconBgs[accentColor]
          )}
        >
          <Icon className={cn("h-4.5 w-4.5", iconColor)} />
        </div>
      </div>

      {/* Main Metric Value */}
      <div className="flex items-baseline gap-2">
        <h4 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)] tabular-nums">
          {value}
        </h4>
        {change && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border",
              isPositive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
            )}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {change}
          </span>
        )}
      </div>

      {/* Subtitle / Description */}
      {description && (
        <p className="mt-2 text-xs text-[var(--foreground-subtle)] font-normal leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
