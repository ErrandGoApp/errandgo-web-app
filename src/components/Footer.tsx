import { FOOTER_LINKS } from "@/lib/constants";
import StoreButtons from "./StoreButtons";
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router";
import Logo from "./Logo";
import QRCode from "qrcode";
import { BadgeCheck, Download, ShieldCheck, Smartphone } from "lucide-react";

const APP_DOWNLOAD_URL = import.meta.env.VITE_FRONTEND_BASE_URL + "/download";

export default function Footer() {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    QRCode.toDataURL(APP_DOWNLOAD_URL, { width: 320, margin: 2 }).then(
      setQrCodeUrl
    );
  }, []);

  return (
    <footer className="bg-slate-950 px-4 pb-10 pt-24">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(135deg,#f8f5ff_0%,#ffffff_48%,#f5fff7_100%)] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22)] md:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="flex flex-col items-center justify-center">
              <div className="hidden w-full max-w-[280px] rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] lg:block">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    className="h-full w-full rounded-2xl"
                    alt="Scan QR code to download ErrandGo"
                  />
                ) : null}
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-violet-700 shadow-sm">
                <BadgeCheck size={16} />
                Mobile-first access to ErrandGo
              </div>

              <h2 className="mt-6 max-w-3xl font-unbounded text-3xl font-semibold leading-tight text-slate-950 md:text-5xl">
                Get the <span className="text-violet-700">ErrandGo</span> app
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-xl">
                Download ErrandGo to access secure services, structured
                payments, and peer-to-peer transaction flows in one trusted,
                premium experience.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <div className="flex items-center gap-2 text-slate-950">
                    <ShieldCheck size={16} className="text-violet-700" />
                    <p className="text-sm font-semibold">Protected flows</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <div className="flex items-center gap-2 text-slate-950">
                    <Smartphone size={16} className="text-emerald-600" />
                    <p className="text-sm font-semibold">Mobile-first UX</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
                  <div className="flex items-center gap-2 text-slate-950">
                    <Download size={16} className="text-amber-500" />
                    <p className="text-sm font-semibold">Fast onboarding</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 max-w-[350px]">
                <StoreButtons />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-12 border-t border-white/10 pt-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl">
            <Logo tag="footer" />
            <p className="mt-4 text-lg font-light text-white/90">
              Trust marketplace for services, payments, and trade
            </p>
            <p className="mt-2 text-base text-white/65">info@errandgo.app</p>
          </div>

          <div className="space-y-6 text-white/90">
            <div className="flex flex-wrap gap-x-8 gap-y-3 md:justify-end">
              <Link
                to="/terms-of-use"
                className="transition-colors hover:text-violet-300"
              >
                Terms of Use
              </Link>
              <Link
                to="/privacy-policy"
                className="transition-colors hover:text-violet-300"
              >
                Privacy Policy
              </Link>
            </div>

            <div className="flex flex-wrap gap-5 md:justify-end">
              {FOOTER_LINKS.map((link, i) => (
                <Fragment key={i}>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all hover:border-violet-400 hover:bg-violet-500/10 hover:text-violet-300"
                    href={link.href}
                  >
                    <link.icon className="text-[20px]" />
                  </a>
                </Fragment>
              ))}
            </div>

            <p className="text-sm text-white/55 md:text-right">
              © {new Date().getFullYear()} ErrandGo. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
