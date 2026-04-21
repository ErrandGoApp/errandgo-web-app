import React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Compass,
  Home,
  RefreshCcw,
  SearchX,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

type ErrandGoNotFoundPageProps = {
  title?: string;
  description?: string;
  homeHref?: string;
  dashboardHref?: string;
  supportHref?: string;
  className?: string;
};

function Surface({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "rounded-[28px] border-slate-200/80 shadow-[0_12px_40px_rgba(15,23,42,0.06)]",
        className
      )}
    >
      {children}
    </Card>
  );
}

function ActionLink({
  href,
  children,
  variant = "default",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "default" | "outline";
}) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-medium transition",
        variant === "default"
          ? "bg-slate-950 text-white hover:bg-slate-800"
          : "border border-slate-200 bg-white text-slate-900 hover:bg-slate-100"
      )}
    >
      {children}
    </a>
  );
}

export default function ErrandGoNotFoundPage({
  title = "This page could not be found.",
  description = "The page you are trying to access may have been moved, removed, or never existed in this workspace. Use one of the actions below to get back to a valid flow.",
  homeHref = "/",
  dashboardHref = "/dashboard",
  supportHref = "/support",
  className = "",
}: ErrandGoNotFoundPageProps) {
  return (
    <div className={cn("min-h-screen bg-[#f8fafc] text-slate-950", className)}>
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 md:px-6 lg:px-8">
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Surface className="overflow-hidden border-slate-200 bg-[radial-gradient(circle_at_top_left,#ffffff,#f8fafc_55%,#eef2ff)]">
              <CardContent className="p-6 md:p-8 lg:p-10">
                <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                  <div>
                    <Badge className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-700 shadow-none hover:bg-white">
                      Error 404
                    </Badge>

                    <div className="mt-5 flex h-16 w-16 items-center justify-center rounded-[24px] bg-slate-950 text-white shadow-sm">
                      <SearchX className="h-7 w-7" />
                    </div>

                    <h1 className="mt-6 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl md:leading-tight">
                      {title}
                    </h1>

                    <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                      {description}
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <ActionLink href={dashboardHref}>
                        <Compass className="mr-2 h-4 w-4" />
                        Back to dashboard
                      </ActionLink>

                      <ActionLink href={homeHref} variant="outline">
                        <Home className="mr-2 h-4 w-4" />
                        Go to homepage
                      </ActionLink>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
                      <ArrowLeft className="h-4 w-4" />
                      Check the URL or return to a known section.
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    <Surface className="bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-sm font-medium text-slate-500">
                              Workspace status
                            </div>
                            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                              Safe to continue
                            </div>
                            <div className="mt-2 text-sm leading-6 text-slate-600">
                              Your session is active. This is only a routing
                              error, not a failed transaction state.
                            </div>
                          </div>
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                            <ShieldCheck className="h-5 w-5" />
                          </div>
                        </div>
                      </CardContent>
                    </Surface>

                    <Surface className="bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-sm font-medium text-slate-500">
                              Suggested action
                            </div>
                            <div className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                              Reload or navigate
                            </div>
                            <div className="mt-2 text-sm leading-6 text-slate-600">
                              Return to the dashboard, refresh the page, or open
                              a supported route from your sidebar or navigation.
                            </div>
                          </div>
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                            <RefreshCcw className="h-5 w-5" />
                          </div>
                        </div>
                      </CardContent>
                    </Surface>
                  </div>
                </div>
              </CardContent>
            </Surface>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mt-6 grid gap-4 md:grid-cols-3"
          >
            {[
              {
                title: "Overview",
                text: "Return to your main workspace summary and recent activity.",
                href: dashboardHref,
              },
              {
                title: "Escrow flows",
                text: "Open protected transaction workflows and active payment states.",
                href: `${dashboardHref}/escrow`,
              },
              {
                title: "Need help?",
                text: "Open your support route if this broken link came from a shared page.",
                href: supportHref,
              },
            ].map((item) => (
              <Surface key={item.title} className="bg-white">
                <CardContent className="p-5">
                  <div className="text-base font-semibold text-slate-950">
                    {item.title}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.text}
                  </p>

                  <div className="mt-4">
                    {/* <Button asChild variant="outline" className="rounded-2xl">
                      <a href={item.href}>Open</a>
                    </Button> */}
                    <a
                      href={item.href}
                      className="inline-flex h-10 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
                    >
                      Open
                    </a>
                  </div>
                </CardContent>
              </Surface>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
