import React from "react";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Tabs({ className = "", ...props }: DivProps) {
  return <div className={className} {...props} />;
}

export function TabsList({ className = "", ...props }: DivProps) {
  return (
    <div
      className={`inline-flex rounded-2xl bg-slate-100 p-1 ${className}`}
      {...props}
    />
  );
}

export function TabsTrigger({ className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-white ${className}`}
      {...props}
    />
  );
}
