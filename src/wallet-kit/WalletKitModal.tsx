import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Download,
  QrCode,
  ScanLine,
  Wallet,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { WalletKitService } from "./services/global-service";

import { useStates } from "../contexts/StatesContext";
import { walletModules } from "./services/wallet-kit.service";

type WalletModule = {
  productId: string;
  productName: string;
  productUrl: string;
  productIcon: string;
  isAvailable: () => Promise<boolean>;
};

export default function WalletKitModal(): React.ReactElement | null {
  const [isAvailableMap, setIsAvailableMap] = useState<Map<string, boolean>>(
    new Map()
  );
  const [loadingWallet, setLoadingWallet] = useState<string | null>(null);

  const {
    walletKitIsOpen,
    setWalletKitIsOpen,
    setUserKey,
    setNetwork,
    setWalletApp,
  } = useStates();

  const stellarWalletKitOptions = walletModules;

  useEffect(() => {
    let isMounted = true;

    const loadAvailability = async () => {
      try {
        const results = await Promise.all(
          stellarWalletKitOptions.map((option) => option.isAvailable())
        );

        if (!isMounted) return;

        const nextMap = new Map<string, boolean>();
        results.forEach((isAvailable, index) => {
          nextMap.set(stellarWalletKitOptions[index].productName, isAvailable);
        });

        setIsAvailableMap(nextMap);
      } catch (error) {
        console.error("Failed to resolve wallet availability:", error);
      }
    };

    void loadAvailability();

    return () => {
      isMounted = false;
    };
  }, [stellarWalletKitOptions]);

  const closeHandler = () => {
    setWalletKitIsOpen(false);
    setLoadingWallet(null);
  };

  const handleDownload = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleWalletClick = async (option: WalletModule) => {
    const isInstalled = isAvailableMap.get(option.productName) ?? false;

    setLoadingWallet(option.productId);

    try {
      if (isInstalled) {
        await WalletKitService.login(option.productId, setUserKey, setNetwork);
        setWalletApp(option.productId);
        closeHandler();
        return;
      }

      handleDownload(option.productUrl);
      setWalletApp(option.productId);
    } catch (error) {
      console.error(`Failed wallet action for ${option.productName}:`, error);
    } finally {
      setLoadingWallet(null);
    }
  };

  if (!walletKitIsOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="wallet-kit-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeHandler}
        className="fixed inset-0 z-100 flex h-dvh items-end justify-center overflow-x-hidden overflow-y-auto bg-slate-950/55 p-0 backdrop-blur-md sm:items-center sm:p-5"
      >
        <motion.div
          initial={{ y: 24, opacity: 0, scale: 0.985 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 18, opacity: 0, scale: 0.985 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          onClick={(event) => event.stopPropagation()}
          className="relative flex max-h-dvh w-full min-w-0 max-w-5xl flex-col overflow-hidden rounded-t-[32px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] sm:max-h-[calc(100dvh-2.5rem)] sm:rounded-[34px]"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top_left,#eef2ff_0%,#ffffff_58%,#ffffff_100%)]" />

          <div className="relative flex-1 overflow-x-hidden overflow-y-auto px-5 pb-5 pt-5 sm:px-8 sm:pb-8 sm:pt-7">
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm">
                  <Wallet className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Stellar wallet connection</span>
                </div>

                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 sm:text-[30px]">
                  Connect a wallet to continue
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Choose an installed Stellar wallet from the list, or scan the
                  WalletConnect QR code on the right when that flow is enabled.
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 shrink-0 rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                onClick={closeHandler}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
              <div className="min-w-0 rounded-[28px] border border-slate-200 bg-slate-50/80 p-5">
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900">
                      Available wallets
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      Connect instantly if installed, or install a supported
                      wallet first.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3">
                  {stellarWalletKitOptions.map((option) => {
                    const isInstalled =
                      isAvailableMap.get(option.productName) ?? false;
                    const isLoading = loadingWallet === option.productId;

                    return (
                      <button
                        key={option.productId}
                        type="button"
                        onClick={() => void handleWalletClick(option)}
                        disabled={loadingWallet !== null}
                        className="group w-full min-w-0 rounded-[24px] border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:border-slate-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
                            <img
                              className="h-10 w-10 rounded-xl object-cover"
                              src={option.productIcon}
                              alt={option.productName}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex min-w-0 items-center gap-2">
                              <p className="truncate text-sm font-semibold text-slate-950 sm:text-[15px]">
                                {option.productName}
                              </p>

                              <span
                                className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                  isInstalled
                                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
                                    : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200"
                                }`}
                              >
                                {isInstalled ? "Installed" : "Install"}
                              </span>
                            </div>

                            <p className="mt-1 min-w-0 truncate text-sm text-slate-500">
                              {option.productUrl}
                            </p>
                          </div>

                          <div className="flex shrink-0 items-center">
                            {isInstalled ? (
                              <div className="flex items-center gap-2 text-slate-700">
                                <span className="hidden text-xs font-medium sm:inline">
                                  {isLoading ? "Connecting..." : "Connect"}
                                </span>
                                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-slate-700">
                                <span className="hidden text-xs font-medium sm:inline">
                                  Install
                                </span>
                                <Download className="h-4.5 w-4.5" />
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="min-w-0 rounded-[28px] border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <ScanLine className="h-4.5 w-4.5 shrink-0" />
                  WalletConnect
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Scan this QR code with a compatible wallet. This is a visual
                  placeholder for now and can later be replaced with a real
                  WalletConnect session.
                </p>

                <div className="mt-5 overflow-hidden rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top,#f8fafc_0%,#ffffff_55%,#f8fafc_100%)] p-5">
                  <div className="mx-auto flex w-full max-w-[280px] min-w-0 flex-col items-center">
                    <div className="flex aspect-square w-full max-w-[240px] items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-white shadow-sm">
                      <div className="flex w-full   flex-col items-center px-4 text-center">
                        <div className="w-full aspect-square items-center justify-center rounded-2xl bg-slate-950 text-white">
                          <QrCode className="w-full h-full" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Session status
                      </div>
                      <div className="mt-1 text-sm font-medium text-slate-900">
                        Waiting for WalletConnect integration
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-sm font-semibold text-slate-900">
                    Integration-ready layout
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    The right panel is already structured for QR rendering,
                    session state, and optional wallet pairing details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
