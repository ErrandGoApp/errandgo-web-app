import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  FileClock,
  Filter,
  HandCoins,
  Home,
  Layers3,
  Menu,
  Plus,
  RefreshCcw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  Wallet,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const navItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "escrow", label: "Escrow", icon: ShieldCheck },
  { id: "trades", label: "P2P Trades", icon: RefreshCcw },
  { id: "milestones", label: "Milestones", icon: Layers3 },
  { id: "payments", label: "Payments", icon: Wallet },
  { id: "requests", label: "Requests", icon: Briefcase },
  { id: "activity", label: "Activity", icon: FileClock },
  { id: "settings", label: "Settings", icon: Settings },
];

const initialEscrows = [
  {
    id: "ESC-1042",
    title: "Home appliance purchase",
    type: "Shopping",
    counterparty: "Aisha M.",
    amount: 250,
    status: "Funded",
    progress: 55,
    createdAt: "Today",
  },
  {
    id: "ESC-1038",
    title: "Airport pickup and delivery",
    type: "Errand",
    counterparty: "David O.",
    amount: 48,
    status: "In Progress",
    progress: 70,
    createdAt: "Yesterday",
  },
  {
    id: "ESC-1031",
    title: "Laptop repair service",
    type: "Service",
    counterparty: "FixLab",
    amount: 120,
    status: "Pending Confirmation",
    progress: 90,
    createdAt: "2 days ago",
  },
];

const initialTrades = [
  {
    id: "TRD-281",
    pair: "USDC / NGN",
    role: "Buyer",
    counterparty: "Sodiq T.",
    amount: 400,
    rate: "₦1,570 / USDC",
    status: "Awaiting Payment",
  },
  {
    id: "TRD-274",
    pair: "USDC / KWD",
    role: "Seller",
    counterparty: "Lina R.",
    amount: 180,
    rate: "0.31 KWD / USDC",
    status: "Completed",
  },
];

const initialMilestones = [
  {
    id: "MLS-011",
    project: "Kitchen renovation",
    completed: 2,
    total: 4,
    released: 650,
    remaining: 550,
  },
  {
    id: "MLS-008",
    project: "Content production package",
    completed: 1,
    total: 3,
    released: 200,
    remaining: 400,
  },
];

const initialPayments = [
  {
    id: "PAY-1004",
    title: "Escrow funding",
    amount: 250,
    status: "Completed",
    method: "Wallet",
  },
  {
    id: "PAY-1005",
    title: "Trade payment",
    amount: 400,
    status: "Awaiting Payment",
    method: "Bank",
  },
  {
    id: "PAY-1006",
    title: "Milestone release",
    amount: 200,
    status: "Completed",
    method: "Wallet",
  },
];

const initialRequests = [
  {
    id: "REQ-201",
    title: "Grocery pickup",
    category: "Errand",
    budget: 35,
    status: "Open",
  },
  {
    id: "REQ-202",
    title: "Document delivery",
    category: "Delivery",
    budget: 20,
    status: "Assigned",
  },
  {
    id: "REQ-203",
    title: "Home cleaning service",
    category: "Service",
    budget: 120,
    status: "Open",
  },
];

const initialActivity = [
  {
    id: 1,
    text: "Payment funded for ESC-1042",
    time: "5m ago",
    tone: "success",
  },
  {
    id: 2,
    text: "Milestone 2 released for MLS-011",
    time: "22m ago",
    tone: "default",
  },
  { id: 3, text: "Trade TRD-281 created", time: "1h ago", tone: "default" },
  {
    id: 4,
    text: "Delivery request updated by David O.",
    time: "3h ago",
    tone: "default",
  },
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function statusTone(status) {
  switch (status) {
    case "Completed":
    case "Funded":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "In Progress":
    case "Assigned":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Pending Confirmation":
    case "Awaiting Payment":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Open":
      return "bg-violet-50 text-violet-700 border-violet-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function Surface({ children, className = "" }) {
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

function Sidebar({ current, setCurrent, mobileOpen, setMobileOpen }) {
  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-[292px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 md:translate-x-0 md:z-30",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-semibold tracking-tight text-slate-950">
                ErrandGo
              </div>
              <div className="text-xs text-slate-500">Operations Workspace</div>
            </div>
          </div>
          <button
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <div className="rounded-[24px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,#f8fafc,white_55%,#eef2ff)] p-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              <Sparkles className="h-3.5 w-3.5" />
              Protected balance
            </div>
            <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              $8,420
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Escrow, trades, milestone releases, and payment requests in one
              clean control layer.
            </p>
          </div>

          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = current === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrent(item.id);
                    setMobileOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition",
                    active
                      ? "bg-slate-950 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-200 p-4">
          <div className="rounded-[24px] bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">
              Built for clarity
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Clean demo flows, realistic states, and ready-to-present UI for
              web and mobile.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

function Topbar({
  current,
  onOpenMenu,
  onOpenCreate,
  search,
  setSearch,
  filter,
  setFilter,
}) {
  const title =
    navItems.find((item) => item.id === current)?.label || "Overview";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="flex flex-col gap-4 px-4 py-4 md:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              className="rounded-2xl border border-slate-200 p-2.5 text-slate-700 md:hidden"
              onClick={onOpenMenu}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <div className="text-sm text-slate-500">Workspace</div>
              <div className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                {title}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-2xl">
              <Bell className="h-4.5 w-4.5" />
            </Button>
            <Button
              onClick={onOpenCreate}
              className="rounded-2xl bg-slate-950 px-4 text-white hover:bg-slate-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search escrows, trades, requests, counterparties"
              className="h-11 rounded-2xl border-slate-200 pl-10"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 items-center rounded-2xl border border-slate-200 bg-white px-3">
              <Filter className="mr-2 h-4 w-4 text-slate-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent text-sm text-slate-700 outline-none"
              >
                <option value="all">All status</option>
                <option value="open">Open / active</option>
                <option value="completed">Completed</option>
                <option value="attention">Needs attention</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function MetricCard({ title, value, subtext, icon: Icon, tone = "default" }) {
  const toneMap = {
    default: "bg-slate-100 text-slate-700",
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    violet: "bg-violet-50 text-violet-700",
  };

  return (
    <Surface>
      <CardContent className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-slate-500">{title}</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {value}
            </div>
            <div className="mt-2 text-sm leading-6 text-slate-600">
              {subtext}
            </div>
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl",
              toneMap[tone]
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Surface>
  );
}

function SectionHeader({ title, description, action }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h3 className="text-lg font-semibold tracking-tight text-slate-950 md:text-xl">
          {title}
        </h3>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

function ListCard({ title, meta = [], badge, right, children }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 md:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="truncate text-base font-semibold text-slate-950">
              {title}
            </div>
            {badge}
          </div>
          {meta.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
              {meta.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          ) : null}
          {children}
        </div>
        {right}
      </div>
    </div>
  );
}

function OverviewPage({
  escrows,
  trades,
  milestones,
  requests,
  activity,
  onAction,
}) {
  const totals = useMemo(() => {
    const protectedValue =
      escrows.reduce((sum, x) => sum + x.amount, 0) +
      trades.reduce((sum, x) => sum + x.amount, 0);
    return {
      protectedValue,
      activeEscrows: escrows.filter((x) => x.status !== "Completed").length,
      liveTrades: trades.filter((x) => x.status !== "Completed").length,
      openRequests: requests.filter((x) => x.status !== "Completed").length,
    };
  }, [escrows, trades, requests]);

  return (
    <div className="space-y-6">
      <Surface className="overflow-hidden border-slate-200 bg-[radial-gradient(circle_at_top_left,#ffffff,#f8fafc_55%,#eef2ff)]">
        <CardContent className="p-6 md:p-8">
          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
            <div>
              <Badge className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-700 shadow-none hover:bg-white">
                Premium demo workspace
              </Badge>
              <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl md:leading-tight">
                Clean escrow, trade, payment, and request management in one
                seamless workflow.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                A web-optimized and mobile-optimized dashboard designed to make
                transaction operations feel clear, calm, and reliable from
                creation to completion.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  onClick={() => onAction("newEscrow")}
                  className="rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-800"
                >
                  Create escrow
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onAction("newTrade")}
                  className="rounded-2xl px-5"
                >
                  Start trade
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <MetricCard
                title="Protected value"
                value={money(totals.protectedValue)}
                subtext="Escrow and trade value currently represented in the demo workspace."
                icon={ShieldCheck}
                tone="blue"
              />
              <MetricCard
                title="Active escrow"
                value={String(totals.activeEscrows)}
                subtext="Transactions currently in funded, in-progress, or confirmation state."
                icon={Briefcase}
                tone="emerald"
              />
              <MetricCard
                title="Live trades"
                value={String(totals.liveTrades)}
                subtext="Peer-to-peer trade flows that are still open or awaiting payment."
                icon={RefreshCcw}
                tone="violet"
              />
              <MetricCard
                title="Open requests"
                value={String(totals.openRequests)}
                subtext="Requests available to coordinate, assign, or convert into protected flows."
                icon={Truck}
                tone="default"
              />
            </div>
          </div>
        </CardContent>
      </Surface>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Surface>
          <CardContent className="p-5 md:p-6">
            <SectionHeader
              title="Priority queue"
              description="The most important active transactions and payment flows in one view."
              action={
                <Button variant="ghost" className="rounded-2xl">
                  See all
                </Button>
              }
            />
            <div className="space-y-4">
              {escrows.slice(0, 2).map((item) => (
                <ListCard
                  key={item.id}
                  title={item.title}
                  meta={[
                    item.id,
                    item.type,
                    item.counterparty,
                    money(item.amount),
                  ]}
                  badge={
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-xs font-medium",
                        statusTone(item.status)
                      )}
                    >
                      {item.status}
                    </span>
                  }
                  right={
                    <Button className="rounded-2xl bg-white text-slate-900 shadow-none border border-slate-200 hover:bg-slate-100">
                      Open
                    </Button>
                  }
                >
                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
                      <span>Progress</span>
                      <span>{item.progress}%</span>
                    </div>
                    <Progress
                      value={item.progress}
                      className="h-2 rounded-full"
                    />
                  </div>
                </ListCard>
              ))}
              {trades.slice(0, 1).map((item) => (
                <ListCard
                  key={item.id}
                  title={item.pair}
                  meta={[
                    item.id,
                    item.role,
                    item.counterparty,
                    money(item.amount),
                    item.rate,
                  ]}
                  badge={
                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-xs font-medium",
                        statusTone(item.status)
                      )}
                    >
                      {item.status}
                    </span>
                  }
                  right={
                    <Button className="rounded-2xl bg-white text-slate-900 shadow-none border border-slate-200 hover:bg-slate-100">
                      Open
                    </Button>
                  }
                />
              ))}
            </div>
          </CardContent>
        </Surface>

        <div className="space-y-6">
          <Surface>
            <CardContent className="p-5 md:p-6">
              <SectionHeader
                title="Quick actions"
                description="Start the most common flows with fewer steps."
              />
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["New escrow", ShieldCheck, "newEscrow"],
                  ["New trade", RefreshCcw, "newTrade"],
                  ["Milestone plan", Layers3, "newMilestone"],
                  ["Payment request", HandCoins, "newPayment"],
                ].map(([label, Icon, action]) => (
                  <button
                    key={label}
                    onClick={() => onAction(action)}
                    className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-left transition hover:bg-white hover:shadow-sm"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="mt-4 text-sm font-semibold text-slate-950">
                      {label}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Surface>

          <Surface>
            <CardContent className="p-5 md:p-6">
              <SectionHeader
                title="Recent activity"
                description="Important changes across escrow, payments, and requests."
              />
              <div className="space-y-4">
                {activity.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-[20px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl",
                        item.tone === "success"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-white text-slate-700"
                      )}
                    >
                      <CheckCircle2 className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {item.text}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {item.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Surface>
        </div>
      </div>

      <Surface>
        <CardContent className="p-5 md:p-6">
          <SectionHeader
            title="Milestone releases"
            description="Track structured payouts and staged delivery progress."
            action={
              <Button
                variant="outline"
                className="rounded-2xl"
                onClick={() => onAction("newMilestone")}
              >
                New plan
              </Button>
            }
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {milestones.map((item) => {
              const progress = Math.round((item.completed / item.total) * 100);
              return (
                <div
                  key={item.id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-base font-semibold text-slate-950">
                        {item.project}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        {item.id}
                      </div>
                    </div>
                    <Badge className="rounded-full bg-white text-slate-700 shadow-none border border-slate-200 hover:bg-white">
                      {item.completed}/{item.total} complete
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2 rounded-full" />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white p-4">
                      <div className="text-sm text-slate-500">Released</div>
                      <div className="mt-1 text-lg font-semibold text-slate-950">
                        {money(item.released)}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white p-4">
                      <div className="text-sm text-slate-500">Remaining</div>
                      <div className="mt-1 text-lg font-semibold text-slate-950">
                        {money(item.remaining)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Surface>
    </div>
  );
}

function EscrowPage({ escrows, onAction, onConfirmReceipt, onAdvanceEscrow }) {
  return (
    <Surface>
      <CardContent className="p-5 md:p-6">
        <SectionHeader
          title="Escrow transactions"
          description="Protected transactions for errands, services, shopping, and delivery flows."
          action={
            <Button
              onClick={() => onAction("newEscrow")}
              className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create escrow
            </Button>
          }
        />
        <div className="space-y-4">
          {escrows.map((item) => (
            <ListCard
              key={item.id}
              title={item.title}
              meta={[
                item.id,
                item.type,
                item.counterparty,
                money(item.amount),
                item.createdAt,
              ]}
              badge={
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs font-medium",
                    statusTone(item.status)
                  )}
                >
                  {item.status}
                </span>
              }
              right={
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="rounded-2xl">
                    Details
                  </Button>
                  {item.status === "Pending Confirmation" ? (
                    <Button
                      className="rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700"
                      onClick={() => onConfirmReceipt(item.id)}
                    >
                      Confirm receipt
                    </Button>
                  ) : item.status !== "Completed" ? (
                    <Button
                      className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                      onClick={() => onAdvanceEscrow(item.id)}
                    >
                      Advance status
                    </Button>
                  ) : (
                    <Button variant="outline" className="rounded-2xl">
                      View summary
                    </Button>
                  )}
                </div>
              }
            >
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>Progress</span>
                  <span>{item.progress}%</span>
                </div>
                <Progress value={item.progress} className="h-2 rounded-full" />
              </div>
            </ListCard>
          ))}
        </div>
      </CardContent>
    </Surface>
  );
}

function TradesPage({ trades, onAction, onAdvanceTrade }) {
  return (
    <Surface>
      <CardContent className="p-5 md:p-6">
        <SectionHeader
          title="Peer-to-peer trades"
          description="Clean trade flows with realistic status transitions and buyer-seller visibility."
          action={
            <Button
              onClick={() => onAction("newTrade")}
              className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              New trade
            </Button>
          }
        />
        <div className="space-y-4">
          {trades.map((item) => (
            <ListCard
              key={item.id}
              title={item.pair}
              meta={[
                item.id,
                item.role,
                item.counterparty,
                money(item.amount),
                item.rate,
              ]}
              badge={
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs font-medium",
                    statusTone(item.status)
                  )}
                >
                  {item.status}
                </span>
              }
              right={
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" className="rounded-2xl">
                    Open trade
                  </Button>
                  {item.status !== "Completed" ? (
                    <Button
                      className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                      onClick={() => onAdvanceTrade(item.id)}
                    >
                      Update trade
                    </Button>
                  ) : null}
                </div>
              }
            />
          ))}
        </div>
      </CardContent>
    </Surface>
  );
}

function MilestonesPage({ milestones, onAction, onReleaseMilestone }) {
  return (
    <Surface>
      <CardContent className="p-5 md:p-6">
        <SectionHeader
          title="Milestone plans"
          description="Structured payout plans for staged work delivery and release confirmation."
          action={
            <Button
              onClick={() => onAction("newMilestone")}
              className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              New milestone plan
            </Button>
          }
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {milestones.map((item) => {
            const progress = Math.round((item.completed / item.total) * 100);
            return (
              <div
                key={item.id}
                className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-slate-950">
                      {item.project}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">{item.id}</div>
                  </div>
                  <Badge className="rounded-full border border-slate-200 bg-white text-slate-700 shadow-none hover:bg-white">
                    {item.completed}/{item.total}
                  </Badge>
                </div>
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2 rounded-full" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-white p-4">
                    <div className="text-slate-500">Released</div>
                    <div className="mt-1 font-semibold text-slate-950">
                      {money(item.released)}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-white p-4">
                    <div className="text-slate-500">Remaining</div>
                    <div className="mt-1 font-semibold text-slate-950">
                      {money(item.remaining)}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => onReleaseMilestone(item.id)}
                  className="mt-4 w-full rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                >
                  Release next milestone
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Surface>
  );
}

function PaymentsPage({ payments, onAction, onAdvancePayment }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.82fr]">
      <Surface>
        <CardContent className="p-5 md:p-6">
          <SectionHeader
            title="Payments"
            description="Funding, settlement, and releases across all transaction types."
          />
          <div className="space-y-4">
            {payments.map((item) => (
              <ListCard
                key={item.id}
                title={item.title}
                meta={[item.id, money(item.amount), item.method]}
                badge={
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-medium",
                      statusTone(item.status)
                    )}
                  >
                    {item.status}
                  </span>
                }
                right={
                  item.status !== "Completed" ? (
                    <Button
                      className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                      onClick={() => onAdvancePayment(item.id)}
                    >
                      Complete
                    </Button>
                  ) : (
                    <Button variant="outline" className="rounded-2xl">
                      Receipt
                    </Button>
                  )
                }
              />
            ))}
          </div>
        </CardContent>
      </Surface>

      <Surface>
        <CardContent className="p-5 md:p-6">
          <SectionHeader
            title="Payment tools"
            description="Start related actions quickly without leaving the page."
          />
          <div className="grid gap-3">
            {[
              ["Request payment", HandCoins, "newPayment"],
              ["Fund escrow", ShieldCheck, "newEscrow"],
              ["Release milestone", Layers3, "newMilestone"],
              ["Create trade", RefreshCcw, "newTrade"],
            ].map(([label, Icon, action]) => (
              <button
                key={label}
                onClick={() => onAction(action)}
                className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-slate-50 p-4 text-left transition hover:bg-white"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-slate-900">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  {label}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            ))}
          </div>
        </CardContent>
      </Surface>
    </div>
  );
}

function RequestsPage({ requests, onAction, onAdvanceRequest }) {
  return (
    <div className="space-y-6">
      <Surface>
        <CardContent className="p-5 md:p-6">
          <SectionHeader
            title="Request categories"
            description="Start request-led flows for delivery, shopping, services, and local errands."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              [
                "Errand request",
                Truck,
                "Create local task flows with protected payment terms.",
              ],
              [
                "Shopping request",
                Store,
                "Manage assisted purchases with clearer settlement steps.",
              ],
              [
                "Service request",
                Briefcase,
                "Turn service agreements into escrow or milestone flows.",
              ],
              [
                "Payment request",
                CreditCard,
                "Request direct payment with cleaner follow-through.",
              ],
            ].map(([title, Icon, desc]) => (
              <button
                key={title}
                onClick={() => onAction("newEscrow")}
                className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-left transition hover:bg-white"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4 text-base font-semibold text-slate-950">
                  {title}
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-600">
                  {desc}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Surface>

      <Surface>
        <CardContent className="p-5 md:p-6">
          <SectionHeader
            title="Active requests"
            description="Current request objects shown with demo progression states."
            action={
              <Button
                onClick={() => onAction("newRequest")}
                className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
              >
                <Plus className="mr-2 h-4 w-4" />
                New request
              </Button>
            }
          />
          <div className="space-y-4">
            {requests.map((item) => (
              <ListCard
                key={item.id}
                title={item.title}
                meta={[item.id, item.category, money(item.budget)]}
                badge={
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-medium",
                      statusTone(item.status)
                    )}
                  >
                    {item.status}
                  </span>
                }
                right={
                  <Button
                    className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                    onClick={() => onAdvanceRequest(item.id)}
                  >
                    Advance
                  </Button>
                }
              />
            ))}
          </div>
        </CardContent>
      </Surface>
    </div>
  );
}

function ActivityPage({ activity }) {
  return (
    <Surface>
      <CardContent className="p-5 md:p-6">
        <SectionHeader
          title="Activity feed"
          description="Recent workspace events generated by the interactive demo flows."
        />
        <div className="space-y-4">
          {activity.map((item) => (
            <div
              key={item.id}
              className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
            >
              <div className="text-sm font-medium text-slate-900">
                {item.text}
              </div>
              <div className="mt-1 text-sm text-slate-500">{item.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Surface>
  );
}

function SettingsPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Surface>
        <CardContent className="p-5 md:p-6">
          <SectionHeader
            title="Profile"
            description="Presentation-ready identity details for the demo workspace."
          />
          <div className="space-y-4">
            {[
              ["Display name", "Amina Yusuf"],
              ["Region", "Kuwait"],
              ["Primary wallet", "0xA9f...4C82"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
              >
                <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                  {label}
                </div>
                <div className="mt-2 text-sm font-medium text-slate-900">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Surface>

      <Surface>
        <CardContent className="p-5 md:p-6">
          <SectionHeader
            title="Preferences"
            description="Default operating settings shown in a simplified premium layout."
          />
          <div className="space-y-4 text-sm text-slate-600">
            <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
              Notifications enabled for escrow updates, trade actions, and
              milestone releases.
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
              Preferred settlement currency: USDC.
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
              Two-step confirmation enabled for releases above $500.
            </div>
          </div>
        </CardContent>
      </Surface>
    </div>
  );
}

function CreateModal({ open, onClose, type, onCreate }) {
  const [form, setForm] = useState({
    title: "",
    counterparty: "",
    amount: "",
    category: "Service",
    notes: "",
  });

  if (!open) return null;

  const labels = {
    newEscrow: "Create escrow",
    newTrade: "Create trade",
    newMilestone: "Create milestone plan",
    newPayment: "Request payment",
    newRequest: "Create request",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      >
        <motion.div
          initial={{ y: 24, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl rounded-t-[30px] border border-slate-200 bg-white p-5 shadow-2xl sm:rounded-[32px] sm:p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm text-slate-500">New item</div>
              <h3 className="text-2xl font-semibold tracking-tight text-slate-950">
                {labels[type] || "Create item"}
              </h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-2xl"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Title
              </label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter title"
                className="h-12 rounded-2xl"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Counterparty
              </label>
              <Input
                value={form.counterparty}
                onChange={(e) =>
                  setForm({ ...form, counterparty: e.target.value })
                }
                placeholder="Enter counterparty"
                className="h-12 rounded-2xl"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Amount
              </label>
              <Input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00"
                className="h-12 rounded-2xl"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category
              </label>
              <div className="flex h-12 items-center rounded-2xl border border-input bg-transparent px-3">
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full bg-transparent text-sm outline-none"
                >
                  <option>Service</option>
                  <option>Errand</option>
                  <option>Shopping</option>
                  <option>Trade</option>
                  <option>Delivery</option>
                </select>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Notes
              </label>
              <Textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={5}
                placeholder="Add terms, milestones, or delivery notes"
                className="rounded-2xl"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" className="rounded-2xl" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
              onClick={() => {
                onCreate(form);
                onClose();
                setForm({
                  title: "",
                  counterparty: "",
                  amount: "",
                  category: "Service",
                  notes: "",
                });
              }}
            >
              Save and continue
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Toast({ message, onClose }) {
  if (!message) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-[24px] border border-emerald-200 bg-white p-4 shadow-2xl"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-900">
              Action completed
            </div>
            <div className="mt-1 text-sm leading-6 text-slate-600">
              {message}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-xl"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ErrandGoPremiumWorkspace() {
  const [current, setCurrent] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("newEscrow");
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [escrows, setEscrows] = useState(initialEscrows);
  const [trades, setTrades] = useState(initialTrades);
  const [milestones, setMilestones] = useState(initialMilestones);
  const [payments, setPayments] = useState(initialPayments);
  const [requests, setRequests] = useState(initialRequests);
  const [activity, setActivity] = useState(initialActivity);

  const pushActivity = (text) => {
    setActivity((prev) => [
      { id: Date.now(), text, time: "Just now", tone: "default" },
      ...prev,
    ]);
  };

  const openCreate = (type = "newEscrow") => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleCreate = (form) => {
    if (modalType === "newTrade") {
      const trade = {
        id: `TRD-${300 + trades.length}`,
        pair: "USDC / NGN",
        role: "Buyer",
        counterparty: form.counterparty || "New counterparty",
        amount: Number(form.amount || 0),
        rate: "₦1,560 / USDC",
        status: "Awaiting Payment",
      };
      setTrades((prev) => [trade, ...prev]);
      setToast("New peer-to-peer trade created.");
      pushActivity(`Trade ${trade.id} created`);
      setCurrent("trades");
      return;
    }

    if (modalType === "newMilestone") {
      const milestone = {
        id: `MLS-${20 + milestones.length}`,
        project: form.title || "New milestone project",
        completed: 0,
        total: 3,
        released: 0,
        remaining: Number(form.amount || 0),
      };
      setMilestones((prev) => [milestone, ...prev]);
      setToast("Milestone payment plan created.");
      pushActivity(`Milestone plan ${milestone.id} created`);
      setCurrent("milestones");
      return;
    }

    if (modalType === "newPayment") {
      const payment = {
        id: `PAY-${1100 + payments.length}`,
        title: form.title || "Payment request",
        amount: Number(form.amount || 0),
        status: "Awaiting Payment",
        method: "Wallet",
      };
      setPayments((prev) => [payment, ...prev]);
      setToast("Payment request created successfully.");
      pushActivity(`Payment request ${payment.id} created`);
      setCurrent("payments");
      return;
    }

    if (modalType === "newRequest") {
      const request = {
        id: `REQ-${240 + requests.length}`,
        title: form.title || "New request",
        category: form.category,
        budget: Number(form.amount || 0),
        status: "Open",
      };
      setRequests((prev) => [request, ...prev]);
      setToast("Request created successfully.");
      pushActivity(`Request ${request.id} created`);
      setCurrent("requests");
      return;
    }

    const escrow = {
      id: `ESC-${1100 + escrows.length}`,
      title: form.title || "New escrow transaction",
      type: form.category,
      counterparty: form.counterparty || "New counterparty",
      amount: Number(form.amount || 0),
      status: "Funded",
      progress: 25,
      createdAt: "Just now",
    };
    setEscrows((prev) => [escrow, ...prev]);
    setToast("Escrow transaction created successfully.");
    pushActivity(`Escrow ${escrow.id} created`);
    setCurrent("escrow");
  };

  const handleConfirmReceipt = (id) => {
    setEscrows((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Completed", progress: 100 } : item
      )
    );
    setToast(`Payment receipt confirmed for ${id}.`);
    pushActivity(`Receipt confirmed for ${id}`);
  };

  const handleAdvanceEscrow = (id) => {
    setEscrows((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (item.status === "Funded")
          return { ...item, status: "In Progress", progress: 70 };
        if (item.status === "In Progress")
          return { ...item, status: "Pending Confirmation", progress: 92 };
        return item;
      })
    );
    setToast(`Escrow ${id} advanced to the next stage.`);
    pushActivity(`Escrow ${id} moved to the next stage`);
  };

  const handleAdvanceTrade = (id) => {
    setTrades((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (item.status === "Awaiting Payment")
          return { ...item, status: "Completed" };
        return item;
      })
    );
    setToast(`Trade ${id} updated successfully.`);
    pushActivity(`Trade ${id} updated`);
  };

  const handleReleaseMilestone = (id) => {
    setMilestones((prev) =>
      prev.map((item) => {
        if (item.id !== id || item.completed >= item.total) return item;
        const stepValue = Math.round(
          (item.released + item.remaining) / item.total
        );
        return {
          ...item,
          completed: item.completed + 1,
          released: item.released + stepValue,
          remaining: Math.max(0, item.remaining - stepValue),
        };
      })
    );
    setToast(`Next milestone released for ${id}.`);
    pushActivity(`Milestone released for ${id}`);
  };

  const handleAdvancePayment = (id) => {
    setPayments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Completed" } : item
      )
    );
    setToast(`Payment ${id} marked as completed.`);
    pushActivity(`Payment ${id} completed`);
  };

  const handleAdvanceRequest = (id) => {
    setRequests((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (item.status === "Open") return { ...item, status: "Assigned" };
        if (item.status === "Assigned") return { ...item, status: "Completed" };
        return item;
      })
    );
    setToast(`Request ${id} advanced successfully.`);
    pushActivity(`Request ${id} advanced`);
  };

  const filteredEscrows = useMemo(
    () =>
      escrows.filter((item) =>
        matchesSearchAndFilter(
          item.title + item.counterparty + item.type,
          item.status,
          search,
          filter
        )
      ),
    [escrows, search, filter]
  );
  const filteredTrades = useMemo(
    () =>
      trades.filter((item) =>
        matchesSearchAndFilter(
          item.pair + item.counterparty + item.role,
          item.status,
          search,
          filter
        )
      ),
    [trades, search, filter]
  );
  const filteredMilestones = useMemo(
    () =>
      milestones.filter((item) =>
        matchesSearchAndFilter(
          item.project + item.id,
          item.completed === item.total ? "Completed" : "In Progress",
          search,
          filter
        )
      ),
    [milestones, search, filter]
  );
  const filteredPayments = useMemo(
    () =>
      payments.filter((item) =>
        matchesSearchAndFilter(
          item.title + item.method + item.id,
          item.status,
          search,
          filter
        )
      ),
    [payments, search, filter]
  );
  const filteredRequests = useMemo(
    () =>
      requests.filter((item) =>
        matchesSearchAndFilter(
          item.title + item.category + item.id,
          item.status,
          search,
          filter
        )
      ),
    [requests, search, filter]
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-950">
      <Sidebar
        current={current}
        setCurrent={setCurrent}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="md:pl-[292px]">
        <Topbar
          current={current}
          onOpenMenu={() => setMobileOpen(true)}
          onOpenCreate={() => openCreate("newEscrow")}
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
        />

        <main className="px-4 py-6 md:px-8 md:py-8">
          {current === "overview" && (
            <OverviewPage
              escrows={filteredEscrows}
              trades={filteredTrades}
              milestones={filteredMilestones}
              requests={filteredRequests}
              activity={activity}
              onAction={openCreate}
            />
          )}
          {current === "escrow" && (
            <EscrowPage
              escrows={filteredEscrows}
              onAction={openCreate}
              onConfirmReceipt={handleConfirmReceipt}
              onAdvanceEscrow={handleAdvanceEscrow}
            />
          )}
          {current === "trades" && (
            <TradesPage
              trades={filteredTrades}
              onAction={openCreate}
              onAdvanceTrade={handleAdvanceTrade}
            />
          )}
          {current === "milestones" && (
            <MilestonesPage
              milestones={filteredMilestones}
              onAction={openCreate}
              onReleaseMilestone={handleReleaseMilestone}
            />
          )}
          {current === "payments" && (
            <PaymentsPage
              payments={filteredPayments}
              onAction={openCreate}
              onAdvancePayment={handleAdvancePayment}
            />
          )}
          {current === "requests" && (
            <RequestsPage
              requests={filteredRequests}
              onAction={openCreate}
              onAdvanceRequest={handleAdvanceRequest}
            />
          )}
          {current === "activity" && <ActivityPage activity={activity} />}
          {current === "settings" && <SettingsPage />}
        </main>
      </div>

      <CreateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        onCreate={handleCreate}
      />
      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}

function matchesSearchAndFilter(text, status, search, filter) {
  const normalizedText = String(text).toLowerCase();
  const normalizedSearch = search.trim().toLowerCase();
  const normalizedStatus = String(status).toLowerCase();

  const matchesSearch =
    !normalizedSearch || normalizedText.includes(normalizedSearch);

  const matchesFilter =
    filter === "all"
      ? true
      : filter === "completed"
      ? normalizedStatus === "completed"
      : filter === "attention"
      ? normalizedStatus.includes("awaiting") ||
        normalizedStatus.includes("pending")
      : normalizedStatus !== "completed";

  return matchesSearch && matchesFilter;
}
