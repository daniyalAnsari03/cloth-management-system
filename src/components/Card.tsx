import { type ReactNode } from "react";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ title, children, className = "", style }: CardProps) {
  return (
    <div
      className={`group/card rounded-xl border border-border bg-surface p-4 sm:p-5 lg:p-6 shadow-sm card-hover ${className}`}
      style={style}
    >
      {title && <h2 className="heading-section mb-4 text-text-primary">{title}</h2>}
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon?: ReactNode;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="group/stat flex items-center gap-3 sm:gap-4 rounded-xl border border-border bg-surface p-4 sm:p-5 shadow-sm card-hover cursor-default">
      {icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-500/10 text-gold-400 transition-all duration-300 group-hover/stat:scale-110 group-hover/stat:bg-gold-500/15">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm text-text-muted transition-colors duration-200 group-hover/stat:text-gold-400/80">{label}</p>
        <p className="stat-value text-text-primary truncate transition-colors duration-200 group-hover/stat:text-gold-400">{value}</p>
      </div>
    </div>
  );
}
