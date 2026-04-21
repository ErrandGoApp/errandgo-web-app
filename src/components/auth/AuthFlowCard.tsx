import React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function AuthFlowCard({
  badge,
  title,
  description,
  step,
  total,
  children,
}: {
  badge: string;
  title: string;
  description: string;
  step: number;
  total: number;
  children: React.ReactNode;
}) {
  const progress = Math.max(0, Math.min(100, Math.round((step / total) * 100)));

  return (
    <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col px-5 py-6 sm:px-7 sm:py-8">
      <div className="rounded-[30px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,#ffffff,#f8fafc_58%,#eef2ff)] p-6 shadow-[0_18px_60px_rgba(15,23,42,0.06)] sm:p-8">
        <Badge className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-700 shadow-none hover:bg-white">
          {badge}
        </Badge>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-[34px]">
              {title}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-[15px]">
              {description}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Step
            </div>
            <div className="mt-1 text-base font-semibold text-slate-950">
              {step} / {total}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 rounded-full" />
        </div>

        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
