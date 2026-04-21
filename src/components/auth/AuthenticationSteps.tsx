import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthFlowCard } from "./AuthFlowCard";

type AccountType = "personal" | "business";

type AuthForm = {
  email: string;
  password: string;
  username: string;
  accountType: AccountType;
};

function StepActions({
  onBack,
  onNext,
  nextLabel,
  isNextDisabled,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  isNextDisabled?: boolean;
}) {
  return (
    <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-slate-500">
        You can extend this route with additional onboarding steps later.
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        {onBack ? (
          <Button
            variant="outline"
            className="rounded-2xl px-5"
            onClick={onBack}
          >
            Back
          </Button>
        ) : null}
        <Button
          className="rounded-2xl bg-slate-950 px-5 text-white hover:bg-slate-800"
          onClick={onNext}
          disabled={isNextDisabled}
        >
          {nextLabel}
        </Button>
      </div>
    </div>
  );
}

export default function AuthenticationSteps() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<AuthForm>({
    email: "",
    password: "",
    username: "",
    accountType: "personal",
  });

  const usernameError = useMemo(() => {
    if (!form.username) return "";
    const valid = /^[a-z0-9._-]{3,20}$/i.test(form.username);
    return valid
      ? ""
      : "Use 3–20 letters, numbers, dots, underscores, or hyphens.";
  }, [form.username]);

  const canContinueStep1 =
    form.email.trim().length > 4 && form.password.trim().length >= 8;
  const canContinueStep2 = form.username.trim().length >= 3 && !usernameError;

  if (step === 1) {
    return (
      <AuthFlowCard
        badge="Authentication"
        title="Sign in to continue"
        description="Use a dedicated route for access while keeping the workspace visible in the background. This gives you room for a richer first-time journey without losing product context."
        step={1}
        total={3}
      >
        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              className="h-12 rounded-2xl border-slate-200"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              className="h-12 rounded-2xl border-slate-200"
            />
            <p className="text-xs text-slate-500">
              Use at least 8 characters for this demo flow.
            </p>
          </div>
        </div>

        <StepActions
          onNext={() => setStep(2)}
          nextLabel="Continue"
          isNextDisabled={!canContinueStep1}
        />
      </AuthFlowCard>
    );
  }

  if (step === 2) {
    return (
      <AuthFlowCard
        badge="Profile setup"
        title="Choose your username"
        description="Reserve a clean public identity for your workspace. This step belongs naturally on a route because it can expand over time with availability checks, profile details, or organization setup."
        step={2}
        total={3}
      >
        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="e.g. shola.workspace"
              value={form.username}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, username: e.target.value }))
              }
              className="h-12 rounded-2xl border-slate-200"
            />
            <p
              className={
                usernameError
                  ? "text-xs text-amber-600"
                  : "text-xs text-slate-500"
              }
            >
              {usernameError ||
                "This can be used across your profile, requests, and transaction activity."}
            </p>
          </div>
        </div>

        <StepActions
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
          nextLabel="Continue"
          isNextDisabled={!canContinueStep2}
        />
      </AuthFlowCard>
    );
  }

  return (
    <AuthFlowCard
      badge="Account setup"
      title="Select your account type"
      description="Choose the workspace profile that fits how you plan to use the platform. This stays modular so you can easily append more onboarding steps without turning the flow into an oversized in-page modal."
      step={3}
      total={3}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            key: "personal" as const,
            title: "Personal account",
            description:
              "Ideal for individuals managing errands, direct payments, escrow, and peer-to-peer activity.",
          },
          {
            key: "business" as const,
            title: "Business account",
            description:
              "Best for teams, merchants, service operators, and structured payout or settlement workflows.",
          },
        ].map((item) => {
          const active = form.accountType === item.key;
          return (
            <button
              type="button"
              key={item.key}
              onClick={() =>
                setForm((prev) => ({ ...prev, accountType: item.key }))
              }
              className={
                active
                  ? "rounded-[26px] border border-slate-950 bg-slate-950 p-5 text-left text-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] transition"
                  : "rounded-[26px] border border-slate-200 bg-white p-5 text-left text-slate-950 transition hover:border-slate-300 hover:bg-slate-50"
              }
            >
              <div className="text-base font-semibold tracking-tight">
                {item.title}
              </div>
              <p
                className={
                  active
                    ? "mt-2 text-sm leading-6 text-white/72"
                    : "mt-2 text-sm leading-6 text-slate-600"
                }
              >
                {item.description}
              </p>
            </button>
          );
        })}
      </div>

      <StepActions
        onBack={() => setStep(2)}
        onNext={() => navigate("/app", { replace: true })}
        nextLabel="Enter workspace"
      />
    </AuthFlowCard>
  );
}
