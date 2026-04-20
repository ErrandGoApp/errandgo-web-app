import React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className = "", ...props }: DivProps) {
  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)] ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }: DivProps) {
  return <div className={`p-6 ${className}`} {...props} />;
}

export function CardTitle({ className = "", ...props }: DivProps) {
  return (
    <h3
      className={`text-lg font-semibold tracking-tight text-slate-950 ${className}`}
      {...props}
    />
  );
}

export function CardDescription({ className = "", ...props }: DivProps) {
  return <p className={`text-sm text-slate-600 ${className}`} {...props} />;
}

export function CardContent({ className = "", ...props }: DivProps) {
  return <div className={`p-6 pt-0 ${className}`} {...props} />;
}
