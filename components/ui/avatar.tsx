import React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  isOnline?: boolean;
}

export function Avatar({ src, name, size = "md", className, isOnline }: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);

  const getInitials = (n: string) => {
    if (!n) return "DF";
    const parts = n.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  const sizeClasses = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const indicatorSizes = {
    xs: "h-1.5 w-1.5",
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
    xl: "h-3.5 w-3.5",
  };

  return (
    <div className="relative inline-block flex-shrink-0">
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded-full font-semibold border border-slate-700 bg-gradient-to-br from-indigo-900 to-slate-800 text-slate-200 select-none",
          sizeClasses[size],
          className
        )}
      >
        {src && !hasError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={name}
            onError={() => setHasError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {isOnline !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-slate-900",
            isOnline ? "bg-emerald-500" : "bg-slate-500",
            indicatorSizes[size]
          )}
        />
      )}
    </div>
  );
}
