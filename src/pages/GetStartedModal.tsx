import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";

import { useOutletContext } from "react-router";
import { ArrowRight, LockKeyhole, Mail, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";

type LoginMethod = "wallet" | "google" | "email";

type AuthOutletContext = {
  onAuthSuccess: () => void;
  onAuthClose: () => void;
  onLogin: (
    method: LoginMethod,
    payload?: { email?: string; password?: string }
  ) => void;
};

export default function GetStartedModal() {
  const { onAuthSuccess, onAuthClose, onLogin } =
    useOutletContext<AuthOutletContext>();
  const [email, setEmail] = useState("hello@errandgo.app");
  const [password, setPassword] = useState("password123");
  const [loadingMethod, setLoadingMethod] = useState<LoginMethod | null>(null);
  const navigate = useNavigate();
  const handleClose = () => {
    navigate("/");
    onAuthClose();
  };

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

  const GoogleIcon = FcGoogle as unknown as React.FC<
    React.SVGProps<SVGSVGElement>
  >;

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
                  Authenticate to continue
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                  Authentication is required to access this feature. Sign in to
                  continue.
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                onClick={handleClose}
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
                    onClick={() => {
                      simulate("wallet");
                      onAuthSuccess();
                    }}
                  >
                    {/* <img
                      className="h-auto w-8 rounded-full "
                      src="../../public/cryptoIcons/Stellar.svg"
                      alt=""
                    /> */}

                    <img
                      className="h-auto w-8 rounded-full"
                      src="/cryptoIcons/Stellar.svg"
                      // alt="Stellar"
                    />

                    {loadingMethod === "wallet"
                      ? "Connecting wallet..."
                      : "Connect wallet"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={loadingMethod !== null}
                    className="h-12 justify-start rounded-2xl border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                    onClick={() => {
                      simulate("google");
                      onAuthSuccess();
                    }}
                  >
                    <GoogleIcon className="h-5 w-5 mr-[5px]" />

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
                    onClick={() => {
                      simulate("email", { email, password });
                      onAuthSuccess();
                    }}
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
