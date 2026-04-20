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
            <svg
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-gray-800 "
              viewBox="0 0 130 130"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M71.1407 13.8977C84.7778 6.41644 102.07 9.74383 113.715 19.2483C119.466 24.1573 123.517 30.8469 125.858 37.9875C126.016 38.425 126.173 38.8629 126.335 39.3137C127.477 43.0025 127.612 46.5785 127.632 50.4309C127.636 50.9306 127.64 51.4307 127.645 51.9455C127.532 64.0959 121.536 74.2533 115.464 84.3615C115.093 84.9855 114.723 85.6096 114.353 86.2336C109.839 93.7795 104.835 101.033 99.7461 108.199C99.2954 108.834 98.8462 109.47 98.3975 110.107C96.9167 112.205 95.4122 114.284 93.876 116.343C93.6755 116.614 93.4753 116.886 93.2686 117.165C92.6995 117.925 92.1166 118.672 91.5274 119.416C91.3611 119.64 91.1948 119.864 91.0235 120.094C90.5311 120.695 90.5311 120.695 89.4786 121.54C88.1172 121.671 88.117 121.672 86.6807 121.141C85.6367 120.197 84.8491 119.108 84.0323 117.967C83.7914 117.644 83.55 117.321 83.3018 116.988C82.5541 115.979 81.8187 114.962 81.084 113.945C80.6442 113.345 80.2035 112.746 79.7627 112.148C78.4539 110.36 77.1678 108.557 75.8868 106.749C75.6558 106.424 75.4245 106.099 75.1866 105.765C72.6446 102.185 70.1407 98.5828 67.7413 94.9055C67.4591 94.4757 67.4588 94.4757 67.1709 94.0373C65.8922 92.0545 66.1622 91.9505 65.5626 91.261C65.1631 91.151 65.2298 91.1665 64.8887 91.1711C61.7654 91.2112 58.6421 91.2413 55.5186 91.261C53.913 91.2714 52.3077 91.2861 50.7022 91.3088C49.1522 91.3306 47.602 91.3417 46.0518 91.3469C45.461 91.3506 44.87 91.3586 44.2793 91.3694C43.4504 91.3839 42.622 91.3859 41.793 91.385C41.0859 91.3916 41.0857 91.3909 40.3643 91.3977C38.7219 91.0836 38.13 90.4562 37.1084 89.1584C36.8836 87.7346 36.8836 87.7344 37.1084 86.3606C37.8548 85.4152 38.4358 84.8971 39.5069 84.3615C40.1147 84.3246 40.7242 84.313 41.3331 84.3137C41.7176 84.3131 42.1029 84.3123 42.4991 84.3117C42.9222 84.3132 43.3453 84.3142 43.7813 84.3156C44.4482 84.3156 44.4485 84.3157 45.129 84.3156C46.6041 84.3159 48.0796 84.3194 49.5547 84.3225C50.5752 84.3232 51.5958 84.324 52.6163 84.3244C55.0316 84.3258 57.447 84.3282 59.8624 84.3322C62.6119 84.3367 65.3618 84.339 68.1114 84.341C73.768 84.3452 79.4245 84.3526 85.0811 84.3615C84.9368 84.1688 84.7923 83.9761 84.6436 83.7776C84.4581 83.5251 84.2732 83.2721 84.0821 83.0119C83.8966 82.7615 83.7107 82.5112 83.5196 82.2531C83.0824 81.5631 83.1524 81.7567 82.5528 80.9572C82.253 80.5575 82.5531 80.9566 82.1534 80.5569C81.3539 79.7574 80.5299 79.3718 79.6094 78.7893C75.6615 76.409 71.7872 75.9067 67.2374 75.9094C66.8613 75.908 66.4851 75.9069 66.0977 75.9055C65.2854 75.9026 64.4725 75.9001 63.6602 75.8987C62.375 75.8958 61.0899 75.8894 59.8047 75.8821C56.1518 75.8611 52.4988 75.8423 48.8458 75.8362C46.6081 75.8321 44.3705 75.8197 42.1329 75.803C41.2807 75.798 40.4284 75.7962 39.5762 75.7971C38.3866 75.798 37.1974 75.7896 36.0079 75.7785C35.6554 75.7812 35.3026 75.7836 34.9395 75.7864C32.5528 75.7497 32.5525 75.7497 31.3057 74.8039C30.3031 73.3912 30.1385 72.5094 30.3126 70.7688C30.8996 69.9029 30.8997 69.9027 31.9112 69.1701C33.1342 69.0207 34.2111 68.9675 35.4327 68.9885C35.7875 68.9883 36.1423 68.9878 36.5079 68.9875C37.6804 68.9886 38.853 69.0014 40.0254 69.0139C40.8388 69.0169 41.6525 69.0191 42.4659 69.0207C44.6056 69.0268 46.7452 69.0421 48.8848 69.0598C51.0687 69.0762 53.2536 69.084 55.4376 69.092C59.722 69.1092 64.0067 69.1365 68.2911 69.1701C67.8565 68.53 67.4188 67.8917 66.9805 67.2541C66.7373 66.8984 66.4938 66.5425 66.2432 66.176C63.7097 62.7908 59.6591 61.3832 55.6202 60.5539C54.0767 60.3453 52.5598 60.3201 51.0059 60.3244C50.6846 60.3237 50.3633 60.3233 50.0323 60.3225C49.3381 60.3209 48.6435 60.3197 47.9493 60.3196C46.4729 60.3182 44.9959 60.3101 43.5196 60.302C40.7741 60.2868 38.0288 60.2738 35.2833 60.2746C33.37 60.2749 31.4562 60.266 29.543 60.2502C28.8148 60.246 28.0866 60.2452 27.3584 60.2483C26.341 60.2521 25.324 60.2439 24.3067 60.2326C24.006 60.2367 23.7053 60.2402 23.3956 60.2444C21.8822 60.2142 21.2443 60.0962 20.1309 59.0364C19.3814 57.7398 19.2677 57.0516 19.5186 55.5774C20.2649 54.657 20.8603 54.1067 21.917 53.5783C22.7907 53.5416 23.6657 53.5318 24.5401 53.5334C24.8092 53.5334 25.0783 53.5335 25.3555 53.5334C26.2467 53.5337 27.1381 53.5362 28.0293 53.5393C28.6465 53.54 29.2637 53.5408 29.8809 53.5412C31.5069 53.5428 33.1329 53.5466 34.7588 53.551C36.4175 53.5551 38.0767 53.5568 39.7354 53.5588C42.9906 53.5631 46.2458 53.5699 49.501 53.5783C49.4976 53.1214 49.4948 52.6644 49.4913 52.1936C49.4884 51.5827 49.4851 50.9714 49.4825 50.3606C49.4787 49.9106 49.4785 49.9102 49.4747 49.4514C49.4386 38.3652 54.155 28.5012 61.794 20.6721C64.3649 18.1223 67.1499 16.1825 70.2901 14.4006C70.5708 14.2348 70.8514 14.0686 71.1407 13.8977ZM96.8604 32.175C92.1363 29.7519 85.1824 29.7772 80.4668 32.2024C80.1323 32.4025 79.8071 32.597 79.4825 32.7912C77.3838 33.9431 75.6953 35.2849 74.0362 37.0139C69.6333 42.1492 68.31 47.3414 68.6885 53.9797C69.4417 58.6852 71.6614 63.6731 75.5196 66.6135C75.7795 66.8034 76.0319 66.9877 76.2842 67.1721C80.258 70.5254 84.9728 71.8802 90.1749 71.6477C94.6714 71.258 99.9585 69.146 103.02 65.6477C103.308 65.2146 103.589 64.7946 103.869 64.3742C105.355 62.2029 106.822 60.0706 107.646 57.5539C107.721 57.2903 107.794 57.0344 107.867 56.7785C108.901 53.3704 108.943 49.9226 108.441 46.4084C106.811 41.0287 103.67 36.4805 98.9346 33.4211C98.5736 33.2071 98.2225 32.9989 97.8721 32.7912C97.5282 32.5816 97.1942 32.3785 96.8604 32.175Z"
                fill="currentColor"
              />
              <path
                d="M8.52137 53.3632C9.08334 53.3566 9.08334 53.3566 9.65666 53.3499C11.3783 53.3682 12.452 53.4353 13.9667 54.3017C14.7587 55.2352 14.9827 55.5831 14.9427 56.7862C14.9435 57.182 14.9435 57.182 14.9443 57.5858C14.6171 58.7412 14.0347 59.2219 13.1188 59.9844C11.6014 60.308 10.0695 60.2255 8.52137 60.2093C8.10343 60.2188 7.68549 60.2284 7.25489 60.2382C4.20734 60.2323 4.20734 60.2323 2.85112 59.0459C2.19901 57.732 2.05348 57.0342 2.32486 55.5869C4.0335 53.1749 5.79885 53.2939 8.52137 53.3632Z"
                fill="currentColor"
              />
              <path
                d="M19.5137 68.9706C19.9126 68.9644 20.3114 68.9582 20.7224 68.9519C23.6083 68.9673 23.6083 68.9673 24.9731 69.8826C25.534 70.8088 25.727 71.2955 25.7102 72.3687C25.7143 72.6325 25.7184 72.8964 25.7227 73.1682C25.3845 74.4414 25.0189 74.8241 23.9112 75.5669C22.4423 75.8062 20.9989 75.7898 19.5137 75.7668C19.1148 75.773 18.716 75.7791 18.305 75.7855C15.4191 75.77 15.4191 75.77 14.0543 74.8548C13.4934 73.9286 13.3004 73.4419 13.3172 72.3687C13.311 71.9729 13.311 71.9729 13.3047 71.5691C14.1165 68.5128 16.9216 68.9304 19.5137 68.9706Z"
                fill="currentColor"
              />
            </svg>
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
              <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-slate-800 md:text-5xl md:leading-tight">
                Manage service payments, escrow, milestone releases, and
                transfers from one secure platform.
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
              ["Display name", "Taylor Jackson"],
              ["Region", "UAE"],
              ["Primary wallet", "GEA9f...4C82"],
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
