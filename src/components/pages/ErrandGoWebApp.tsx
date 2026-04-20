import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const navItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "escrow", label: "Escrow", icon: ShieldCheck },
  { id: "trades", label: "P2P Trades", icon: RefreshCcw },
  { id: "milestones", label: "Milestones", icon: Layers3 },
  { id: "payments", label: "Payments", icon: Wallet },
  { id: "ramps", label: "On/Off Ramp", icon: CircleDollarSign },
  { id: "requests", label: "Requests", icon: Briefcase },
  { id: "activity", label: "Activity", icon: FileClock },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

type WorkspaceView =
  | "overview"
  | "escrow"
  | "trades"
  | "milestones"
  | "payments"
  | "ramps"
  | "requests"
  | "activity"
  | "settings"
  | "details";

type DetailEntityType =
  | "escrow"
  | "trade"
  | "milestone"
  | "payment"
  | "request"
  | "ramp";

type Escrow = {
  id: string;
  title: string;
  type: string;
  counterparty: string;
  amount: number;
  status: string;
  progress: number;
  createdAt: string;
};

type Trade = {
  id: string;
  pair: string;
  role: string;
  counterparty: string;
  amount: number;
  rate: string;
  status: string;
};

type Milestone = {
  id: string;
  project: string;
  completed: number;
  total: number;
  released: number;
  remaining: number;
};

type Payment = {
  id: string;
  title: string;
  amount: number;
  status: string;
  method: string;
};

type RequestItem = {
  id: string;
  title: string;
  category: string;
  budget: number;
  status: string;
};

type RampFlow = {
  id: string;
  type: string;
  source: string;
  destination: string;
  amount: number;
  receiveAmount: number;
  status: string;
  eta: string;
  fee: number;
  reference: string;
};

type RampAccount = {
  id: string;
  label: string;
  balance: number;
  available: number;
  currency: string;
  rail: string;
};

type ActivityItem = {
  id: number;
  text: string;
  time: string;
  tone: "success" | "default";
};

type Entity = Escrow | Trade | Milestone | Payment | RequestItem | RampFlow;

type ActionTuple = [
  string,
  React.ComponentType<{ className?: string }>,
  string
];

type CategoryTuple = [
  string,
  React.ComponentType<{ className?: string }>,
  string
];

function isEscrow(entity: Entity): entity is Escrow {
  return (
    "progress" in entity && "counterparty" in entity && "createdAt" in entity
  );
}

function isTrade(entity: Entity): entity is Trade {
  return "pair" in entity && "rate" in entity;
}

function isMilestone(entity: Entity): entity is Milestone {
  return "project" in entity && "released" in entity && "remaining" in entity;
}

function isPayment(entity: Entity): entity is Payment {
  return "method" in entity && "title" in entity && "status" in entity;
}

function isRequestItem(entity: Entity): entity is RequestItem {
  return "budget" in entity && "category" in entity;
}

function isRampFlow(entity: Entity): entity is RampFlow {
  return "reference" in entity && "eta" in entity && "receiveAmount" in entity;
}

const initialRampAccounts: RampAccount[] = [
  {
    id: "BAL-USD",
    label: "USD Wallet",
    balance: 8420,
    available: 7910,
    currency: "USD",
    rail: "Internal balance",
  },
  {
    id: "BAL-USDC",
    label: "USDC Balance",
    balance: 5260,
    available: 5260,
    currency: "USDC",
    rail: "Stellar wallet",
  },
  {
    id: "BAL-NGN",
    label: "NGN Settlement",
    balance: 3150000,
    available: 2950000,
    currency: "NGN",
    rail: "Local bank payout",
  },
];

const initialRampFlows: RampFlow[] = [
  {
    id: "RMP-401",
    type: "Onramp",
    source: "Bank transfer",
    destination: "USDC Wallet",
    amount: 1200,
    receiveAmount: 1190,
    status: "Pending Review",
    eta: "~5 mins",
    fee: 10,
    reference: "CIT-944201",
  },
  {
    id: "RMP-397",
    type: "Offramp",
    source: "USDC Wallet",
    destination: "KWD Bank Account",
    amount: 850,
    receiveAmount: 844,
    status: "In Progress",
    eta: "~12 mins",
    fee: 6,
    reference: "KWT-882110",
  },
  {
    id: "RMP-392",
    type: "Onramp",
    source: "Card",
    destination: "USD Wallet",
    amount: 300,
    receiveAmount: 294,
    status: "Completed",
    eta: "Completed",
    fee: 6,
    reference: "CRD-220144",
  },
];

const initialEscrows: Escrow[] = [
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

const initialTrades: Trade[] = [
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

const initialMilestones: Milestone[] = [
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

const initialPayments: Payment[] = [
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

const initialRequests: RequestItem[] = [
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

const initialActivity: ActivityItem[] = [
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

const overviewQuickActions: ActionTuple[] = [
  ["New escrow", ShieldCheck, "newEscrow"],
  ["New trade", RefreshCcw, "newTrade"],
  ["Milestone plan", Layers3, "newMilestone"],
  ["Request payment", HandCoins, "newPayment"],
];

const paymentActions: ActionTuple[] = [
  ["Request payment", HandCoins, "newPayment"],
  ["Fund escrow", ShieldCheck, "newEscrow"],
  ["Release milestone", Layers3, "newMilestone"],
  ["Create trade", RefreshCcw, "newTrade"],
  ["Start onramp", CircleDollarSign, "newOnramp"],
  ["Start offramp", Wallet, "newOfframp"],
];

const requestCategories: CategoryTuple[] = [
  [
    "Errand request",
    Truck,
    "Create local task flows with protected payment terms.",
  ],
  [
    "Shopping request",
    Store,
    "Manage assisted purchases with clearer settlement terms.",
  ],
  [
    "Service request",
    Briefcase,
    "Turn service agreements into escrow or milestone workflows.",
  ],
  [
    "Payment request",
    CreditCard,
    "Send direct payment requests with faster follow-through.",
  ],
];

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function statusTone(status: string) {
  switch (status) {
    case "Completed":
    case "Funded":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "In Progress":
    case "Assigned":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Pending Confirmation":
    case "Awaiting Payment":
    case "Pending Review":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Open":
      return "bg-violet-50 text-violet-700 border-violet-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function matchesSearchAndFilter(
  haystack: string,
  status: string,
  search: string,
  filter: string
) {
  const normalizedHaystack = haystack.toLowerCase();
  const normalizedSearch = search.trim().toLowerCase();

  const matchesSearch = normalizedSearch
    ? normalizedHaystack.includes(normalizedSearch)
    : true;

  const normalizedStatus = status.toLowerCase();

  const matchesFilter =
    filter === "all"
      ? true
      : filter === "completed"
      ? normalizedStatus === "completed"
      : filter === "open"
      ? normalizedStatus !== "completed"
      : filter === "attention"
      ? ["pending confirmation", "awaiting payment", "pending review"].includes(
          normalizedStatus
        )
      : true;

  return matchesSearch && matchesFilter;
}

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

function Sidebar({
  current,
  setCurrent,
  mobileOpen,
  setMobileOpen,
}: {
  current: string;
  setCurrent: (value: WorkspaceView) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
}) {
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
              <div className="text-xs text-slate-500">Payments & Services</div>
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
              <ShieldCheck className="h-3.5 w-3.5" />
              Protected balance
            </div>
            <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              2,420 USDC
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Manage service payments, escrow, milestone releases, and transfers
              from one secure platform.
            </p>
          </div>

          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon as React.ComponentType<{
                className?: string;
              }>;
              const active = current === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrent(item.id as WorkspaceView);
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
              Secure by design
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Track transactions clearly, review updates quickly, and keep every
              payment flow organized.
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
}: {
  current: string;
  onOpenMenu: () => void;
  onOpenCreate: () => void;
  search: string;
  setSearch: (v: string) => void;
  filter: string;
  setFilter: (v: string) => void;
}) {
  const title =
    navItems.find((item) => item.id === current)?.label ||
    (current === "details" ? "Details" : "Overview");

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
              placeholder="Search escrows, trades, requests, or references"
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
                <option value="all">All statuses</option>
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

function MetricCard({
  title,
  value,
  subtext,
  icon: Icon,
  tone = "default",
}: {
  title: string;
  value: string;
  subtext: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "default" | "blue" | "emerald" | "violet";
}) {
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

function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
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

function ListCard({
  title,
  meta = [],
  badge,
  right,
  children,
}: {
  title: string;
  meta?: string[];
  badge?: React.ReactNode;
  right?: React.ReactNode;
  children?: React.ReactNode;
}) {
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
  onOpenDetails,
}: {
  escrows: Escrow[];
  trades: Trade[];
  milestones: Milestone[];
  requests: RequestItem[];
  activity: ActivityItem[];
  onAction: (type: string) => void;
  onOpenDetails: (entityType: DetailEntityType, entityId: string) => void;
}) {
  const totals = useMemo(() => {
    const protectedValue =
      escrows.reduce((sum: number, x: Escrow) => sum + x.amount, 0) +
      trades.reduce((sum: number, x: Trade) => sum + x.amount, 0);

    return {
      protectedValue,
      activeEscrows: escrows.filter((x: Escrow) => x.status !== "Completed")
        .length,
      liveTrades: trades.filter((x: Trade) => x.status !== "Completed").length,
      openRequests: requests.filter(
        (x: RequestItem) => x.status !== "Completed"
      ).length,
    };
  }, [escrows, trades, requests]);

  return (
    <div className="space-y-6">
      <Surface className="overflow-hidden border-slate-200 bg-[radial-gradient(circle_at_top_left,#ffffff,#f8fafc_55%,#eef2ff)]">
        <CardContent className="p-6 md:p-8">
          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
            <div>
              <Badge className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-700 shadow-none hover:bg-white">
                Transaction workspace
              </Badge>
              <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl md:leading-tight">
                Manage escrow, payments, trades, and service requests in one
                seamless workflow.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                Track every transaction from creation to completion with a
                clear, secure, and reliable operating view.
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
                  Create trade
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <MetricCard
                title="Protected value"
                value={money(totals.protectedValue)}
                subtext="Total value currently held across escrow and trade activity."
                icon={ShieldCheck}
                tone="blue"
              />
              <MetricCard
                title="Active escrows"
                value={String(totals.activeEscrows)}
                subtext="Transactions currently in funded, in-progress, or confirmation stages."
                icon={Briefcase}
                tone="emerald"
              />
              <MetricCard
                title="Open trades"
                value={String(totals.liveTrades)}
                subtext="Peer-to-peer trades that are active or awaiting payment."
                icon={RefreshCcw}
                tone="violet"
              />
              <MetricCard
                title="Open requests"
                value={String(totals.openRequests)}
                subtext="Requests available to review, assign, or convert into active transactions."
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
              description="Review the most important active transactions and payment activity in one place."
              action={
                <Button variant="ghost" className="rounded-2xl">
                  View all
                </Button>
              }
            />
            <div className="space-y-4">
              {escrows.slice(0, 2).map((item: Escrow) => (
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
                    <Button
                      className="rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-none hover:bg-slate-100"
                      onClick={() => onOpenDetails("escrow", item.id)}
                    >
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

              {trades.slice(0, 1).map((item: Trade) => (
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
                    <Button
                      className="rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-none hover:bg-slate-100"
                      onClick={() => onOpenDetails("trade", item.id)}
                    >
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
                description="Start the most common workflows in fewer steps."
              />
              <div className="grid grid-cols-2 gap-3">
                {overviewQuickActions.map(([label, Icon, action]) => {
                  const ActionIcon = Icon;
                  return (
                    <button
                      key={label}
                      onClick={() => onAction(action)}
                      className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-left transition hover:bg-white hover:shadow-sm"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
                        <ActionIcon className="h-4.5 w-4.5" />
                      </div>
                      <div className="mt-4 text-sm font-semibold text-slate-950">
                        {label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Surface>

          <Surface>
            <CardContent className="p-5 md:p-6">
              <SectionHeader
                title="Recent activity"
                description="Stay up to date with important changes across transactions and requests."
              />
              <div className="space-y-4">
                {activity.slice(0, 4).map((item: ActivityItem) => (
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
            description="Track phased payouts and delivery progress across ongoing work."
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
            {milestones.map((item: Milestone) => {
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
                    <Badge className="rounded-full border border-slate-200 bg-white text-slate-700 shadow-none hover:bg-white">
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

                  <div className="mt-4 flex gap-3">
                    <Button
                      onClick={() => onOpenDetails("milestone", item.id)}
                      variant="outline"
                      className="flex-1 rounded-2xl"
                    >
                      Details
                    </Button>
                    <Button
                      onClick={() => onAction("newMilestone")}
                      className="flex-1 rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                    >
                      Create new
                    </Button>
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

function EscrowPage({
  escrows,
  onAction,
  onConfirmReceipt,
  onAdvanceEscrow,
  onOpenDetails,
}: {
  escrows: Escrow[];
  onAction: (type: string) => void;
  onConfirmReceipt: (id: string) => void;
  onAdvanceEscrow: (id: string) => void;
  onOpenDetails: (entityType: "escrow", entityId: string) => void;
}) {
  return (
    <Surface>
      <CardContent className="p-5 md:p-6">
        <SectionHeader
          title="Escrow transactions"
          description="Manage protected transactions for errands, services, shopping, and delivery."
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
          {escrows.map((item: Escrow) => (
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
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={() => onOpenDetails("escrow", item.id)}
                  >
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
                    <Button
                      variant="outline"
                      className="rounded-2xl"
                      onClick={() => onOpenDetails("escrow", item.id)}
                    >
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

function TradesPage({
  trades,
  onAction,
  onAdvanceTrade,
  onOpenDetails,
}: {
  trades: Trade[];
  onAction: (type: string) => void;
  onAdvanceTrade: (id: string) => void;
  onOpenDetails: (entityType: "trade", entityId: string) => void;
}) {
  return (
    <Surface>
      <CardContent className="p-5 md:p-6">
        <SectionHeader
          title="Peer-to-peer trades"
          description="Track trade activity, counterparties, rates, and settlement progress."
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
          {trades.map((item: Trade) => (
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
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={() => onOpenDetails("trade", item.id)}
                  >
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

function MilestonesPage({
  milestones,
  onAction,
  onReleaseMilestone,
  onOpenDetails,
}: {
  milestones: Milestone[];
  onAction: (type: string) => void;
  onReleaseMilestone: (id: string) => void;
  onOpenDetails: (entityType: "milestone", entityId: string) => void;
}) {
  return (
    <Surface>
      <CardContent className="p-5 md:p-6">
        <SectionHeader
          title="Milestone plans"
          description="Set up staged payouts and track progress across structured work."
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
          {milestones.map((item: Milestone) => {
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

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-2xl"
                    onClick={() => onOpenDetails("milestone", item.id)}
                  >
                    Details
                  </Button>
                  <Button
                    onClick={() => onReleaseMilestone(item.id)}
                    className="flex-1 rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                  >
                    Release next milestone
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Surface>
  );
}

function PaymentsPage({
  payments,
  onAction,
  onAdvancePayment,
  onOpenDetails,
}: {
  payments: Payment[];
  onAction: (type: string) => void;
  onAdvancePayment: (id: string) => void;
  onOpenDetails: (entityType: "payment", entityId: string) => void;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.82fr]">
      <Surface>
        <CardContent className="p-5 md:p-6">
          <SectionHeader
            title="Payments"
            description="Track funding, settlement, and releases across transaction activity."
          />
          <div className="space-y-4">
            {payments.map((item: Payment) => (
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
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="rounded-2xl"
                      onClick={() => onOpenDetails("payment", item.id)}
                    >
                      Details
                    </Button>
                    {item.status !== "Completed" ? (
                      <Button
                        className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                        onClick={() => onAdvancePayment(item.id)}
                      >
                        Complete
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="rounded-2xl"
                        onClick={() => onOpenDetails("payment", item.id)}
                      >
                        Receipt
                      </Button>
                    )}
                  </div>
                }
              />
            ))}
          </div>
        </CardContent>
      </Surface>

      <Surface>
        <CardContent className="p-5 md:p-6">
          <SectionHeader
            title="Payment actions"
            description="Start related payment flows directly from this section."
          />
          <div className="grid gap-3">
            {paymentActions.map(([label, Icon, action]) => {
              const ActionIcon = Icon;
              return (
                <button
                  key={label}
                  onClick={() => onAction(action)}
                  className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-slate-50 p-4 text-left transition hover:bg-white"
                >
                  <span className="flex items-center gap-3 text-sm font-semibold text-slate-900">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
                      <ActionIcon className="h-4.5 w-4.5" />
                    </span>
                    {label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              );
            })}
          </div>
        </CardContent>
      </Surface>
    </div>
  );
}

function RampPage({
  rampAccounts,
  rampFlows,
  onAction,
  onAdvanceRamp,
  onOpenDetails,
}: {
  rampAccounts: RampAccount[];
  rampFlows: RampFlow[];
  onAction: (type: string) => void;
  onAdvanceRamp: (id: string) => void;
  onOpenDetails: (entityType: "ramp", entityId: string) => void;
}) {
  const totalWalletValue = rampAccounts.reduce(
    (sum: number, item: RampAccount) => {
      if (item.currency === "USD" || item.currency === "USDC") {
        return sum + item.available;
      }
      if (item.currency === "NGN") {
        return sum + item.available / 1500;
      }
      return sum;
    },
    0
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Available liquidity"
          value={money(Math.round(totalWalletValue))}
          subtext="Funds currently available for wallet activity, funding, and payout flows."
          icon={CircleDollarSign}
          tone="blue"
        />
        <MetricCard
          title="Open ramp flows"
          value={String(
            rampFlows.filter((item: RampFlow) => item.status !== "Completed")
              .length
          )}
          subtext="Transfers currently awaiting review, processing, or settlement."
          icon={Wallet}
          tone="emerald"
        />
        <MetricCard
          title="Supported rails"
          value="6"
          subtext="Card, bank transfer, stablecoin deposit, wallet transfer, and local payout options."
          icon={CreditCard}
          tone="violet"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Surface>
          <CardContent className="p-5 md:p-6">
            <SectionHeader
              title="Onramp & offramp"
              description="Review inbound and outbound transfers with fees, references, and settlement status."
              action={
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={() => onAction("newOnramp")}
                  >
                    Start onramp
                  </Button>
                  <Button
                    className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                    onClick={() => onAction("newOfframp")}
                  >
                    Start offramp
                  </Button>
                </div>
              }
            />
            <div className="space-y-4">
              {rampFlows.map((item: RampFlow) => (
                <ListCard
                  key={item.id}
                  title={`${item.type} • ${money(item.amount)}`}
                  meta={[
                    item.id,
                    item.source,
                    item.destination,
                    `Fee ${money(item.fee)}`,
                    item.reference,
                    item.eta,
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
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="rounded-2xl"
                        onClick={() => onOpenDetails("ramp", item.id)}
                      >
                        Details
                      </Button>
                      {item.status !== "Completed" ? (
                        <Button
                          className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                          onClick={() => onAdvanceRamp(item.id)}
                        >
                          Advance flow
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          className="rounded-2xl"
                          onClick={() => onOpenDetails("ramp", item.id)}
                        >
                          Receipt
                        </Button>
                      )}
                    </div>
                  }
                >
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white p-4">
                      <div className="text-sm text-slate-500">Send</div>
                      <div className="mt-1 font-semibold text-slate-950">
                        {money(item.amount)}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white p-4">
                      <div className="text-sm text-slate-500">Receive</div>
                      <div className="mt-1 font-semibold text-slate-950">
                        {money(item.receiveAmount)}
                      </div>
                    </div>
                  </div>
                </ListCard>
              ))}
            </div>
          </CardContent>
        </Surface>

        <div className="space-y-6">
          <Surface>
            <CardContent className="p-5 md:p-6">
              <SectionHeader
                title="Balance pockets"
                description="Review the balances used across wallet, settlement, and payout activity."
              />
              <div className="space-y-3">
                {rampAccounts.map((item: RampAccount) => (
                  <div
                    key={item.id}
                    className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-950">
                          {item.label}
                        </div>
                        <div className="mt-1 text-sm text-slate-500">
                          {item.rail}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-slate-950">
                          {item.currency === "NGN"
                            ? `${item.available.toLocaleString()} NGN`
                            : money(item.available)}
                        </div>
                        <div className="text-xs text-slate-500">Available</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Surface>

          <Surface>
            <CardContent className="p-5 md:p-6">
              <SectionHeader
                title="How it works"
                description="Understand the transfer flow from quote to settlement."
              />
              <div className="space-y-3 text-sm leading-6 text-slate-600">
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                  1. Select onramp or offramp, choose the source and destination
                  rail, and enter the amount.
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                  2. Review the quote, including fees, reference ID, expected
                  receive amount, and estimated completion time.
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                  3. Track the flow from Pending Review to In Progress to
                  Completed as balances and activity update.
                </div>
              </div>
            </CardContent>
          </Surface>
        </div>
      </div>
    </div>
  );
}

function RequestsPage({
  requests,
  onAction,
  onAdvanceRequest,
  onOpenDetails,
}: {
  requests: RequestItem[];
  onAction: (type: string) => void;
  onAdvanceRequest: (id: string) => void;
  onOpenDetails: (entityType: "request", entityId: string) => void;
}) {
  return (
    <div className="space-y-6">
      <Surface>
        <CardContent className="p-5 md:p-6">
          <SectionHeader
            title="Request categories"
            description="Start request-based workflows for delivery, shopping, services, and local tasks."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {requestCategories.map(([title, Icon, desc]) => {
              const ActionIcon = Icon;
              return (
                <button
                  key={title}
                  onClick={() => onAction("newEscrow")}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-left transition hover:bg-white"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
                    <ActionIcon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 text-base font-semibold text-slate-950">
                    {title}
                  </div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">
                    {desc}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Surface>

      <Surface>
        <CardContent className="p-5 md:p-6">
          <SectionHeader
            title="Active requests"
            description="Review open and assigned requests before they move into completion."
          />
          <div className="space-y-4">
            {requests.map((item: RequestItem) => (
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
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="rounded-2xl"
                      onClick={() => onOpenDetails("request", item.id)}
                    >
                      Details
                    </Button>
                    <Button
                      className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                      onClick={() => onAdvanceRequest(item.id)}
                    >
                      Advance
                    </Button>
                  </div>
                }
              />
            ))}
          </div>
        </CardContent>
      </Surface>
    </div>
  );
}

function ActivityPage({ activity }: { activity: ActivityItem[] }) {
  return (
    <Surface>
      <CardContent className="p-5 md:p-6">
        <SectionHeader
          title="Activity feed"
          description="Monitor recent updates across transactions, releases, and requests."
        />
        <div className="space-y-4">
          {activity.map((item: ActivityItem) => (
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
            description="Manage your account details and primary workspace identity."
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
            description="Review your default notification, settlement, and approval preferences."
          />
          <div className="space-y-4 text-sm text-slate-600">
            <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
              Notifications are enabled for escrow updates, trades, milestone
              releases, and transfer settlements.
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
              Preferred settlement currency: USDC.
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
              Two-step confirmation is enabled for releases above $500.
            </div>
          </div>
        </CardContent>
      </Surface>
    </div>
  );
}

function DetailStat({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4">
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-950">{value}</div>
    </div>
  );
}

function DetailSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Surface>
      <CardContent className="p-5 md:p-6">
        <SectionHeader title={title} description={description} />
        {children}
      </CardContent>
    </Surface>
  );
}

function DetailsPage({
  details,
  escrows,
  trades,
  milestones,
  payments,
  requests,
  rampFlows,
  onBack,
  onOpenCreate,
  onAdvanceEscrow,
  onConfirmReceipt,
  onAdvanceTrade,
  onReleaseMilestone,
  onAdvancePayment,
  onAdvanceRequest,
  onAdvanceRamp,
}: {
  details: {
    entityType: DetailEntityType;
    entityId: string;
  };
  escrows: Escrow[];
  trades: Trade[];
  milestones: Milestone[];
  payments: Payment[];
  requests: RequestItem[];
  rampFlows: RampFlow[];
  onBack: () => void;
  onOpenCreate: (type: string) => void;
  onAdvanceEscrow: (id: string) => void;
  onConfirmReceipt: (id: string) => void;
  onAdvanceTrade: (id: string) => void;
  onReleaseMilestone: (id: string) => void;
  onAdvancePayment: (id: string) => void;
  onAdvanceRequest: (id: string) => void;
  onAdvanceRamp: (id: string) => void;
}) {
  const entity = useMemo<Entity | null>(() => {
    switch (details.entityType) {
      case "escrow":
        return escrows.find((e) => e.id === details.entityId) || null;
      case "trade":
        return trades.find((e) => e.id === details.entityId) || null;
      case "milestone":
        return milestones.find((e) => e.id === details.entityId) || null;
      case "payment":
        return payments.find((e) => e.id === details.entityId) || null;
      case "request":
        return requests.find((e) => e.id === details.entityId) || null;
      case "ramp":
        return rampFlows.find((e) => e.id === details.entityId) || null;
      default:
        return null;
    }
  }, [details, escrows, trades, milestones, payments, requests, rampFlows]);

  if (!entity) {
    return (
      <Surface>
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col items-start gap-4">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
              <FileClock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Record not found
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                This record may have been removed or is no longer available in
                the current workspace.
              </p>
            </div>
            <Button
              onClick={onBack}
              className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
            >
              Back to workspace
            </Button>
          </div>
        </CardContent>
      </Surface>
    );
  }

  const meta = {
    escrow: {
      label: "Escrow details",
      icon: ShieldCheck,
      accent: "bg-blue-50 text-blue-700",
    },
    trade: {
      label: "Trade details",
      icon: RefreshCcw,
      accent: "bg-violet-50 text-violet-700",
    },
    milestone: {
      label: "Milestone details",
      icon: Layers3,
      accent: "bg-amber-50 text-amber-700",
    },
    payment: {
      label: "Payment details",
      icon: Wallet,
      accent: "bg-emerald-50 text-emerald-700",
    },
    request: {
      label: "Request details",
      icon: Briefcase,
      accent: "bg-slate-100 text-slate-700",
    },
    ramp: {
      label: "Transfer details",
      icon: CircleDollarSign,
      accent: "bg-cyan-50 text-cyan-700",
    },
  }[details.entityType];

  const Icon = meta.icon as React.ComponentType<{ className?: string }>;

  let headerTitle = "";
  if (isEscrow(entity)) headerTitle = entity.title;
  else if (isTrade(entity)) headerTitle = entity.pair;
  else if (isMilestone(entity)) headerTitle = entity.project;
  else if (isPayment(entity)) headerTitle = entity.title;
  else if (isRequestItem(entity)) headerTitle = entity.title;
  else if (isRampFlow(entity)) headerTitle = `${entity.type} transfer`;

  const headerId = entity.id;
  const entityStatus =
    isEscrow(entity) ||
    isTrade(entity) ||
    isPayment(entity) ||
    isRequestItem(entity) ||
    isRampFlow(entity)
      ? entity.status
      : null;

  return (
    <div className="space-y-6">
      <Surface className="overflow-hidden border-slate-200 bg-[radial-gradient(circle_at_top_left,#ffffff,#f8fafc_55%,#eef2ff)]">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <Button
                variant="ghost"
                className="mb-4 rounded-2xl px-0 text-slate-500 hover:bg-transparent hover:text-slate-900"
                onClick={onBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              <Badge className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-700 shadow-none hover:bg-white">
                {meta.label}
              </Badge>

              <div className="mt-4 flex items-start gap-4">
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-[22px]",
                    meta.accent
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <div className="min-w-0">
                  <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl md:leading-tight">
                    {headerTitle}
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="text-sm text-slate-500">{headerId}</span>
                    {entityStatus ? (
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-xs font-medium",
                          statusTone(entityStatus)
                        )}
                      >
                        {entityStatus}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:w-[360px]">
              {isEscrow(entity) && (
                <>
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={() => onOpenCreate("newEscrow")}
                  >
                    New escrow
                  </Button>
                  {entity.status === "Pending Confirmation" ? (
                    <Button
                      className="rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700"
                      onClick={() => onConfirmReceipt(entity.id)}
                    >
                      Confirm receipt
                    </Button>
                  ) : entity.status !== "Completed" ? (
                    <Button
                      className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                      onClick={() => onAdvanceEscrow(entity.id)}
                    >
                      Advance status
                    </Button>
                  ) : (
                    <Button
                      className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                      onClick={onBack}
                    >
                      Done
                    </Button>
                  )}
                </>
              )}

              {isTrade(entity) && (
                <>
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={() => onOpenCreate("newTrade")}
                  >
                    New trade
                  </Button>
                  {entity.status !== "Completed" ? (
                    <Button
                      className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                      onClick={() => onAdvanceTrade(entity.id)}
                    >
                      Update trade
                    </Button>
                  ) : (
                    <Button
                      className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                      onClick={onBack}
                    >
                      Done
                    </Button>
                  )}
                </>
              )}

              {isMilestone(entity) && (
                <>
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={() => onOpenCreate("newMilestone")}
                  >
                    New plan
                  </Button>
                  <Button
                    className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                    onClick={() => onReleaseMilestone(entity.id)}
                  >
                    Release next milestone
                  </Button>
                </>
              )}

              {isPayment(entity) && (
                <>
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={() => onOpenCreate("newPayment")}
                  >
                    New payment
                  </Button>
                  {entity.status !== "Completed" ? (
                    <Button
                      className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                      onClick={() => onAdvancePayment(entity.id)}
                    >
                      Complete payment
                    </Button>
                  ) : (
                    <Button
                      className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                      onClick={onBack}
                    >
                      Done
                    </Button>
                  )}
                </>
              )}

              {isRequestItem(entity) && (
                <>
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={() => onOpenCreate("newEscrow")}
                  >
                    Create related flow
                  </Button>
                  <Button
                    className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                    onClick={() => onAdvanceRequest(entity.id)}
                  >
                    Advance request
                  </Button>
                </>
              )}

              {isRampFlow(entity) && (
                <>
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={() =>
                      onOpenCreate(
                        entity.type === "Onramp" ? "newOnramp" : "newOfframp"
                      )
                    }
                  >
                    New {entity.type.toLowerCase()}
                  </Button>
                  {entity.status !== "Completed" ? (
                    <Button
                      className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                      onClick={() => onAdvanceRamp(entity.id)}
                    >
                      Advance flow
                    </Button>
                  ) : (
                    <Button
                      className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                      onClick={onBack}
                    >
                      Done
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Surface>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DetailSection
          title="Overview"
          description="Core information and transaction context."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {isEscrow(entity) && (
              <>
                <DetailStat label="Type" value={entity.type} />
                <DetailStat label="Counterparty" value={entity.counterparty} />
                <DetailStat label="Amount" value={money(entity.amount)} />
                <DetailStat label="Created" value={entity.createdAt} />
              </>
            )}

            {isTrade(entity) && (
              <>
                <DetailStat label="Role" value={entity.role} />
                <DetailStat label="Counterparty" value={entity.counterparty} />
                <DetailStat label="Amount" value={money(entity.amount)} />
                <DetailStat label="Rate" value={entity.rate} />
              </>
            )}

            {isMilestone(entity) && (
              <>
                <DetailStat
                  label="Completed"
                  value={`${entity.completed}/${entity.total}`}
                />
                <DetailStat label="Released" value={money(entity.released)} />
                <DetailStat label="Remaining" value={money(entity.remaining)} />
                <DetailStat
                  label="Progress"
                  value={`${Math.round(
                    (entity.completed / entity.total) * 100
                  )}%`}
                />
              </>
            )}

            {isPayment(entity) && (
              <>
                <DetailStat label="Method" value={entity.method} />
                <DetailStat label="Amount" value={money(entity.amount)} />
                <DetailStat label="Reference" value={entity.id} />
                <DetailStat label="Status" value={entity.status} />
              </>
            )}

            {isRequestItem(entity) && (
              <>
                <DetailStat label="Category" value={entity.category} />
                <DetailStat label="Budget" value={money(entity.budget)} />
                <DetailStat label="Reference" value={entity.id} />
                <DetailStat label="Status" value={entity.status} />
              </>
            )}

            {isRampFlow(entity) && (
              <>
                <DetailStat label="Type" value={entity.type} />
                <DetailStat label="Source" value={entity.source} />
                <DetailStat label="Destination" value={entity.destination} />
                <DetailStat label="Reference" value={entity.reference} />
                <DetailStat label="Send amount" value={money(entity.amount)} />
                <DetailStat
                  label="Receive amount"
                  value={money(entity.receiveAmount)}
                />
                <DetailStat label="Fee" value={money(entity.fee)} />
                <DetailStat label="ETA" value={entity.eta} />
              </>
            )}
          </div>
        </DetailSection>

        <div className="space-y-6">
          {isEscrow(entity) ? (
            <DetailSection
              title="Progress"
              description="Track how far this item has moved through its current workflow."
            >
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
                  <span>Completion</span>
                  <span>{entity.progress}%</span>
                </div>
                <Progress
                  value={entity.progress}
                  className="h-2 rounded-full"
                />
              </div>
            </DetailSection>
          ) : null}

          <DetailSection
            title="Timeline"
            description="Recent status context for this item."
          >
            <div className="space-y-3">
              <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                Record created and added to the workspace.
              </div>
              {entityStatus && entityStatus !== "Completed" ? (
                <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  Current status: {entityStatus}.
                </div>
              ) : (
                <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-700">
                  This item has been completed successfully.
                </div>
              )}
            </div>
          </DetailSection>
        </div>
      </div>
    </div>
  );
}

function CreateModal({
  open,
  onClose,
  type,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  type: string;
  onCreate: (form: {
    title: string;
    counterparty: string;
    amount: string;
    category: string;
    notes: string;
  }) => void;
}) {
  const [form, setForm] = useState({
    title: "",
    counterparty: "",
    amount: "",
    category: "Service",
    notes: "",
  });

  if (!open) return null;

  const labels: Record<string, string> = {
    newEscrow: "Create escrow",
    newTrade: "Create trade",
    newMilestone: "Create milestone plan",
    newPayment: "Request payment",
    newOnramp: "Start onramp",
    newOfframp: "Start offramp",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-md sm:items-center sm:p-5"
      >
        <motion.div
          initial={{ y: 28, opacity: 0, scale: 0.985 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.985 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-3xl overflow-hidden rounded-t-[32px] border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:rounded-[34px]"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,#eef2ff_0%,#ffffff_58%,#ffffff_100%)]" />

          <div className="relative">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 pb-5 pt-5 sm:px-8 sm:pb-6 sm:pt-7">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  New transaction
                </div>

                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 sm:text-[30px]">
                  {labels[type] || "Create item"}
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Enter the required details below to create and continue this
                  flow.
                </p>
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

            <div className="max-h-[calc(100vh-180px)] overflow-y-auto px-5 py-5 sm:px-8 sm:py-7">
              <div className="grid gap-6">
                <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-slate-900">
                      Transaction details
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Add the core information needed to set up this record.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Title
                      </label>
                      <Input
                        value={form.title}
                        onChange={(e) =>
                          setForm({ ...form, title: e.target.value })
                        }
                        placeholder="e.g. Home appliance purchase"
                        className="h-12 rounded-2xl border-slate-200 bg-white shadow-none"
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
                        placeholder="Enter name or business"
                        className="h-12 rounded-2xl border-slate-200 bg-white shadow-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Amount
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                          $
                        </span>
                        <Input
                          type="number"
                          value={form.amount}
                          onChange={(e) =>
                            setForm({ ...form, amount: e.target.value })
                          }
                          placeholder="0.00"
                          className="h-12 rounded-2xl border-slate-200 bg-white pl-8 shadow-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Category / rail
                      </label>
                      <div className="flex h-12 items-center rounded-2xl border border-slate-200 bg-white px-3">
                        <select
                          value={form.category}
                          onChange={(e) =>
                            setForm({ ...form, category: e.target.value })
                          }
                          className="w-full bg-transparent text-sm text-slate-700 outline-none"
                        >
                          <option>Service</option>
                          <option>Errand</option>
                          <option>Shopping</option>
                          <option>Trade</option>
                          <option>Delivery</option>
                          <option>Bank transfer</option>
                          <option>Card</option>
                          <option>Bank account</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-4 sm:p-5">
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-slate-900">
                      Additional notes
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Include any terms, delivery details, settlement
                      instructions, or milestone notes.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Notes
                    </label>
                    <Textarea
                      value={form.notes}
                      onChange={(e) =>
                        setForm({ ...form, notes: e.target.value })
                      }
                      rows={6}
                      placeholder="Add any relevant details for this transaction"
                      className="min-h-[140px] rounded-[24px] border-slate-200 bg-slate-50/60 shadow-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-5">
              <p className="text-sm text-slate-500">
                You can review and update this later from the workspace.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  className="rounded-2xl border-slate-200 px-5"
                  onClick={onClose}
                >
                  Cancel
                </Button>

                <Button
                  className="rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-800"
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
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
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
            <div className="text-sm font-semibold text-slate-900">Success</div>
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

export default function ErrandGoWebApp() {
  const [current, setCurrent] = useState<WorkspaceView>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("newEscrow");
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [details, setDetails] = useState<{
    entityType: DetailEntityType;
    entityId: string;
  } | null>(null);

  const [rampAccounts, setRampAccounts] =
    useState<RampAccount[]>(initialRampAccounts);
  const [rampFlows, setRampFlows] = useState<RampFlow[]>(initialRampFlows);
  const [escrows, setEscrows] = useState<Escrow[]>(initialEscrows);
  const [trades, setTrades] = useState<Trade[]>(initialTrades);
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [requests, setRequests] = useState<RequestItem[]>(initialRequests);
  const [activity, setActivity] = useState<ActivityItem[]>(initialActivity);

  const pushActivity = (text: string) => {
    setActivity((prev) => [
      { id: Date.now(), text, time: "Just now", tone: "default" },
      ...prev,
    ]);
  };

  const openCreate = (type = "newEscrow") => {
    setModalType(type);
    setModalOpen(true);
  };

  const openDetails = (entityType: DetailEntityType, entityId: string) => {
    setDetails({ entityType, entityId });
    setCurrent("details");
  };

  const closeDetails = () => {
    setDetails(null);
    setCurrent("overview");
  };

  const handleCreate = (form: {
    title: string;
    counterparty: string;
    amount: string;
    category: string;
    notes: string;
  }) => {
    if (modalType === "newTrade") {
      const trade: Trade = {
        id: `TRD-${300 + trades.length}`,
        pair: "USDC / NGN",
        role: "Buyer",
        counterparty: form.counterparty || "New counterparty",
        amount: Number(form.amount || 0),
        rate: "₦1,560 / USDC",
        status: "Awaiting Payment",
      };
      setTrades((prev) => [trade, ...prev]);
      setToast("Trade created successfully.");
      pushActivity(`Trade ${trade.id} created`);
      setCurrent("trades");
      return;
    }

    if (modalType === "newMilestone") {
      const milestone: Milestone = {
        id: `MLS-${20 + milestones.length}`,
        project: form.title || "New milestone plan",
        completed: 0,
        total: 3,
        released: 0,
        remaining: Number(form.amount || 0),
      };
      setMilestones((prev) => [milestone, ...prev]);
      setToast("Milestone plan created successfully.");
      pushActivity(`Milestone plan ${milestone.id} created`);
      setCurrent("milestones");
      return;
    }

    if (modalType === "newPayment") {
      const payment: Payment = {
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

    if (modalType === "newOnramp" || modalType === "newOfframp") {
      const isOnramp = modalType === "newOnramp";
      const amount = Number(form.amount || 0);
      const fee = Math.max(4, Math.round(amount * (isOnramp ? 0.01 : 0.0075)));
      const receiveAmount = Math.max(0, amount - fee);

      const flow: RampFlow = {
        id: `RMP-${420 + rampFlows.length}`,
        type: isOnramp ? "Onramp" : "Offramp",
        source: isOnramp ? form.category || "Bank transfer" : "USDC Wallet",
        destination: isOnramp ? "USDC Wallet" : form.category || "Bank account",
        amount,
        receiveAmount,
        status: "Pending Review",
        eta: isOnramp ? "~5 mins" : "~12 mins",
        fee,
        reference: `${isOnramp ? "ONR" : "OFF"}-${Math.floor(
          100000 + Math.random() * 900000
        )}`,
      };

      setRampFlows((prev) => [flow, ...prev]);

      if (isOnramp) {
        setRampAccounts((prev) =>
          prev.map((item) =>
            item.id === "BAL-USDC"
              ? {
                  ...item,
                  balance: item.balance + receiveAmount,
                  available: item.available + receiveAmount,
                }
              : item
          )
        );
      } else {
        setRampAccounts((prev) =>
          prev.map((item) => {
            if (item.id === "BAL-USDC") {
              return {
                ...item,
                balance: Math.max(0, item.balance - amount),
                available: Math.max(0, item.available - amount),
              };
            }
            if (item.id === "BAL-USD") {
              return {
                ...item,
                balance: item.balance + receiveAmount,
                available: item.available + receiveAmount,
              };
            }
            return item;
          })
        );
      }

      setToast(`${flow.type} created successfully.`);
      pushActivity(`${flow.type} ${flow.id} created`);
      setCurrent("ramps");
      return;
    }

    const escrow: Escrow = {
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
    setToast("Escrow created successfully.");
    pushActivity(`Escrow ${escrow.id} created`);
    setCurrent("escrow");
  };

  const handleConfirmReceipt = (id: string) => {
    setEscrows((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Completed", progress: 100 } : item
      )
    );
    setToast(`Receipt confirmed for ${id}.`);
    pushActivity(`Receipt confirmed for ${id}`);
  };

  const handleAdvanceEscrow = (id: string) => {
    setEscrows((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (item.status === "Funded") {
          return { ...item, status: "In Progress", progress: 70 };
        }
        if (item.status === "In Progress") {
          return { ...item, status: "Pending Confirmation", progress: 92 };
        }
        return item;
      })
    );
    setToast(`Escrow ${id} moved to the next stage.`);
    pushActivity(`Escrow ${id} moved to the next stage`);
  };

  const handleAdvanceTrade = (id: string) => {
    setTrades((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (item.status === "Awaiting Payment") {
          return { ...item, status: "Completed" };
        }
        return item;
      })
    );
    setToast(`Trade ${id} updated successfully.`);
    pushActivity(`Trade ${id} updated`);
  };

  const handleReleaseMilestone = (id: string) => {
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
    setToast(`Milestone released for ${id}.`);
    pushActivity(`Milestone released for ${id}`);
  };

  const handleAdvancePayment = (id: string) => {
    setPayments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Completed" } : item
      )
    );
    setToast(`Payment ${id} marked as completed.`);
    pushActivity(`Payment ${id} completed`);
  };

  const handleAdvanceRamp = (id: string) => {
    setRampFlows((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (item.status === "Pending Review") {
          return { ...item, status: "In Progress", eta: "~6 mins" };
        }
        if (item.status === "In Progress") {
          return { ...item, status: "Completed", eta: "Completed" };
        }
        return item;
      })
    );
    setToast(`Ramp flow ${id} updated successfully.`);
    pushActivity(`Ramp flow ${id} updated`);
  };

  const handleAdvanceRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (item.status === "Open") return { ...item, status: "Assigned" };
        if (item.status === "Assigned") return { ...item, status: "Completed" };
        return item;
      })
    );
    setToast(`Request ${id} updated successfully.`);
    pushActivity(`Request ${id} updated`);
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

  const filteredRampFlows = useMemo(
    () =>
      rampFlows.filter((item) =>
        matchesSearchAndFilter(
          item.type + item.source + item.destination + item.reference,
          item.status,
          search,
          filter
        )
      ),
    [rampFlows, search, filter]
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
          onOpenCreate={() =>
            openCreate(current === "ramps" ? "newOnramp" : "newEscrow")
          }
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
              onOpenDetails={openDetails}
            />
          )}

          {current === "escrow" && (
            <EscrowPage
              escrows={filteredEscrows}
              onAction={openCreate}
              onConfirmReceipt={handleConfirmReceipt}
              onAdvanceEscrow={handleAdvanceEscrow}
              onOpenDetails={openDetails}
            />
          )}

          {current === "trades" && (
            <TradesPage
              trades={filteredTrades}
              onAction={openCreate}
              onAdvanceTrade={handleAdvanceTrade}
              onOpenDetails={openDetails}
            />
          )}

          {current === "milestones" && (
            <MilestonesPage
              milestones={filteredMilestones}
              onAction={openCreate}
              onReleaseMilestone={handleReleaseMilestone}
              onOpenDetails={openDetails}
            />
          )}

          {current === "payments" && (
            <PaymentsPage
              payments={filteredPayments}
              onAction={openCreate}
              onAdvancePayment={handleAdvancePayment}
              onOpenDetails={openDetails}
            />
          )}

          {current === "ramps" && (
            <RampPage
              rampAccounts={rampAccounts}
              rampFlows={filteredRampFlows}
              onAction={openCreate}
              onAdvanceRamp={handleAdvanceRamp}
              onOpenDetails={openDetails}
            />
          )}

          {current === "requests" && (
            <RequestsPage
              requests={filteredRequests}
              onAction={openCreate}
              onAdvanceRequest={handleAdvanceRequest}
              onOpenDetails={openDetails}
            />
          )}

          {current === "activity" && <ActivityPage activity={activity} />}

          {current === "settings" && <SettingsPage />}

          {current === "details" && details && (
            <DetailsPage
              details={details}
              escrows={escrows}
              trades={trades}
              milestones={milestones}
              payments={payments}
              requests={requests}
              rampFlows={rampFlows}
              onBack={closeDetails}
              onOpenCreate={openCreate}
              onAdvanceEscrow={handleAdvanceEscrow}
              onConfirmReceipt={handleConfirmReceipt}
              onAdvanceTrade={handleAdvanceTrade}
              onReleaseMilestone={handleReleaseMilestone}
              onAdvancePayment={handleAdvancePayment}
              onAdvanceRequest={handleAdvanceRequest}
              onAdvanceRamp={handleAdvanceRamp}
            />
          )}
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
