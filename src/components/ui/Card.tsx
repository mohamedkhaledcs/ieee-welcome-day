import clsx from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

const paddingStyles = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  className,
  hover = false,
  padding = "md",
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        "glass-card rounded-2xl shadow-card",
        paddingStyles[padding],
        hover &&
          "transition-all duration-300 hover:border-accent-blue/30 hover:shadow-glow hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function CardHeader({ title, subtitle, className }: CardHeaderProps) {
  return (
    <div className={clsx("mb-4", className)}>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {subtitle && (
        <p className="mt-1 text-sm text-foreground-muted">{subtitle}</p>
      )}
    </div>
  );
}
