import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ErrandGoWebApp from "@/components/pages/ErrandGoWebApp";

function AuthRouteChrome({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/45 px-0 pb-0 pt-0 backdrop-blur-md sm:items-center sm:p-6"
      >
        <motion.div
          initial={{ y: 28, opacity: 0, scale: 0.985 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.985 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex h-[92vh] w-full max-w-6xl overflow-hidden rounded-t-[32px] border border-white/60 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.28)] sm:h-[min(880px,92vh)] sm:rounded-[36px]"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_left,#eef2ff_0%,#ffffff_58%,#ffffff_100%)]" />

          <div className="relative grid h-full w-full lg:grid-cols-[420px_minmax(0,1fr)]">
            <aside className="hidden border-r border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(248,250,252,0.96)_100%)] p-8 lg:flex lg:flex-col">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5" />
                Protected access
              </div>

              <h1 className="mt-6 text-[34px] font-semibold leading-tight tracking-tight text-slate-950">
                Continue securely into your ErrandGo workspace.
              </h1>

              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">
                The application remains active in the background while this
                route handles access, first-time setup, and account onboarding
                in a focused flow.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Dedicated route support for multi-step onboarding",
                  "Persistent workspace visible behind the overlay",
                  "Clean separation between access flow and product workspace",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-[22px] border border-slate-200 bg-white/90 p-4"
                  >
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <Sparkles className="h-4.5 w-4.5" />
                    </div>
                    <p className="text-sm leading-6 text-slate-600">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-auto rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_18px_60px_rgba(15,23,42,0.18)]">
                <div className="text-sm font-semibold tracking-tight">
                  Route-based authentication overlay
                </div>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  This pattern is ideal when the flow needs additional steps
                  such as username setup, account type selection, recovery, or
                  future workspace gating.
                </p>
              </div>
            </aside>

            <section className="relative flex h-full min-h-0 flex-col">
              <div className="flex items-center justify-between border-b border-slate-200/80 px-5 py-4 sm:px-7">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    className="rounded-2xl px-3 text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                    onClick={onClose}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to workspace
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
            </section>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ErrandGoWorkspaceShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthRoute = location.pathname === "/auth";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8fafc]">
      <div
        aria-hidden={isAuthRoute}
        className={isAuthRoute ? "pointer-events-none select-none" : undefined}
      >
        <div
          className={
            isAuthRoute
              ? "scale-[0.995] blur-[8px] saturate-[0.88] transition duration-300"
              : "transition duration-300"
          }
        >
          <ErrandGoWebApp />
        </div>

        {isAuthRoute ? (
          <div className="pointer-events-none absolute inset-0 bg-white/18" />
        ) : null}
      </div>

      {isAuthRoute ? (
        <AuthRouteChrome onClose={() => navigate("/", { replace: true })}>
          <Outlet />
        </AuthRouteChrome>
      ) : null}
    </div>
  );
}
