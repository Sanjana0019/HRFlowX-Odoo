import React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy" | "away";
  isOnline?: boolean;
}

export function Avatar({
  src,
  alt,
  name,
  fallback,
  size = "md",
  status,
  isOnline,
  className,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  const displayName = alt || name || "User Avatar";
  const effectiveStatus = status || (isOnline ? "online" : undefined);

  const sizeStyles = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const statusColors = {
    online: "bg-emerald-500 ring-[var(--card)]",
    offline: "bg-slate-400 ring-[var(--card)]",
    busy: "bg-rose-500 ring-[var(--card)]",
    away: "bg-amber-500 ring-[var(--card)]",
  };

  const statusSizes = {
    xs: "h-1.5 w-1.5 ring-1",
    sm: "h-2 w-2 ring-1.5",
    md: "h-2.5 w-2.5 ring-2",
    lg: "h-3 w-3 ring-2",
    xl: "h-3.5 w-3.5 ring-2",
  };

  const initials = fallback
    ? fallback
    : displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

  return (
    <div className={cn("relative inline-block shrink-0", className)} {...props}>
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 font-bold text-[var(--foreground)] shadow-xs select-none",
          sizeStyles[size]
        )}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={displayName}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {effectiveStatus && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full",
            statusSizes[size],
            statusColors[effectiveStatus]
          )}
        />
      )}
    </div>
  );
}
