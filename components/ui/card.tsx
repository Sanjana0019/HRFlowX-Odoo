import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "subtle" | "outline" | "interactive";
}

export function Card({ className, variant = "default", ...props }: CardProps) {
  const variantStyles = {
    default: "bg-[var(--card)] border border-[var(--card-border)] shadow-[var(--shadow-card)]",
    glass: "glass-card backdrop-blur-xl",
    subtle: "bg-[var(--secondary)] border border-[var(--border-subtle)]",
    outline: "bg-transparent border border-[var(--border)]",
    interactive: "glass-card hover:border-[var(--card-border-hover)] cursor-pointer active:scale-[0.995]",
  };

  return (
    <div
      className={cn(
        "rounded-2xl text-[var(--card-foreground)] transition-all duration-200",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 p-5 sm:p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-base sm:text-lg font-bold tracking-tight text-[var(--foreground)] leading-tight",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-xs sm:text-sm text-[var(--foreground-muted)] font-normal leading-relaxed",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 sm:p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center p-5 sm:p-6 pt-0 border-t border-[var(--border)] mt-4",
        className
      )}
      {...props}
    />
  );
}
