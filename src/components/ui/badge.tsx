import React from "react";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement>;

export function Badge({ className = "", ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 ${className}`}
      {...props}
    />
  );
}
