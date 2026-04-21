import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Wallet,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type LoginMethod = "wallet" | "google" | "email";
type PostLoginAction =
  | "create-escrow"
  | "start-trade"
  | "create-milestone"
  | "request-payment"
  | null;

type AuthState = {
  isAuthenticated: boolean;
  method: LoginMethod | null;
  email: string;
  displayName: string;
};

type QuickAction = {
  id: Exclude<PostLoginAction, null>;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const quickActions: QuickAction[] = [
  {
    id: "create-escrow",
    title: "Create escrow",
    description:
      "Start a protected transaction for services, errands, or purchases.",
    icon: ShieldCheck,
  },
  {
    id: "start-trade",
    title: "Start trade",
    description: "Open a peer-to-peer trade flow with clearer status tracking.",
    icon: Wallet,
  },
  {
    id: "create-milestone",
    title: "Milestone plan",
    description:
      "Set up phased delivery and structured release terms in minutes.",
    icon: Sparkles,
  },
  {
    id: "request-payment",
    title: "Request payment",
    description: "Send a direct payment request and keep the flow organized.",
    icon: CreditCard,
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Surface({
  children,
  className,
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

function ErrandGoMark() {
  return (
    <svg
      className="h-11 w-11 text-slate-900"
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
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
  );
}

function FeaturePill({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm">
      {children}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4">
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
        {value}
      </div>
    </div>
  );
}

function ActionTile({
  title,
  description,
  icon: Icon,
  locked,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  locked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-left transition hover:bg-white hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        {locked ? (
          <Badge className="rounded-full border border-amber-200 bg-amber-50 text-amber-700 shadow-none hover:bg-amber-50">
            Login required
          </Badge>
        ) : (
          <Badge className="rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-none hover:bg-emerald-50">
            Ready
          </Badge>
        )}
      </div>
      <div className="mt-4 text-base font-semibold text-slate-950">{title}</div>
      <div className="mt-2 text-sm leading-6 text-slate-600">{description}</div>
    </button>
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
            <div className="text-sm font-semibold text-slate-900">Done</div>
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

export default function GetStartedModal({
  open,
  onClose,
  onLogin,
  pendingAction,
}: {
  open: boolean;
  onClose: () => void;
  onLogin: (
    method: LoginMethod,
    payload?: { email?: string; password?: string }
  ) => void;
  pendingAction: PostLoginAction;
}) {
  const [email, setEmail] = useState("hello@errandgo.app");
  const [password, setPassword] = useState("password123");
  const [loadingMethod, setLoadingMethod] = useState<LoginMethod | null>(null);

  // if (!open) return null;

  const actionLabel =
    pendingAction === "create-escrow"
      ? "create an escrow"
      : pendingAction === "start-trade"
      ? "start a trade"
      : pendingAction === "create-milestone"
      ? "create a milestone plan"
      : pendingAction === "request-payment"
      ? "request a payment"
      : "continue";

  const simulate = (
    method: LoginMethod,
    payload?: { email?: string; password?: string }
  ) => {
    setLoadingMethod(method);
    window.setTimeout(() => {
      onLogin(method, payload);
      setLoadingMethod(null);
    }, 550);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-md sm:items-center sm:p-5"
      >
        <motion.div
          initial={{ y: 24, opacity: 0, scale: 0.985 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 18, opacity: 0, scale: 0.985 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl overflow-hidden rounded-t-[32px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:rounded-[34px]"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,#eef2ff_0%,#ffffff_58%,#ffffff_100%)]" />

          <div className="relative px-5 pb-5 pt-5 sm:px-8 sm:pb-8 sm:pt-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm">
                  <LockKeyhole className="h-3.5 w-3.5" />
                  Authentication required
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 sm:text-[30px]">
                  Sign in to {actionLabel}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                  This simulates the real auth flow and unlocks the workspace
                  actions once completed.
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

            <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-5">
                <div className="text-sm font-semibold text-slate-900">
                  Continue with a preferred option
                </div>
                <div className="mt-4 grid gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loadingMethod !== null}
                    className="h-12 justify-start rounded-2xl border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                    onClick={() => simulate("wallet")}
                  >
                    <Wallet className="mr-3 h-4.5 w-4.5" />
                    {loadingMethod === "wallet"
                      ? "Connecting wallet..."
                      : "Connect wallet"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={loadingMethod !== null}
                    className="h-12 justify-start rounded-2xl border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                    onClick={() => simulate("google")}
                  >
                    <Sparkles className="mr-3 h-4.5 w-4.5" />
                    {loadingMethod === "google"
                      ? "Signing in with Google..."
                      : "Use Google"}
                  </Button>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-5">
                <div className="text-sm font-semibold text-slate-900">
                  Or continue with email
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 rounded-2xl border-slate-200 pl-10"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      className="h-12 rounded-2xl border-slate-200"
                      placeholder="Enter password"
                    />
                  </div>

                  <Button
                    type="button"
                    disabled={loadingMethod !== null || !email || !password}
                    className="h-12 w-full rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
                    onClick={() => simulate("email", { email, password })}
                  >
                    {loadingMethod === "email" ? "Signing in..." : "Continue"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
