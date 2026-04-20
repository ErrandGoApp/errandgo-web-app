import { FOOTER_LINKS } from "@/lib/constants";
import StoreButtons from "./StoreButtons";
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router";
import Logo from "./Logo";
import QRCode from "qrcode";

const APP_DOWNLOAD_URL = import.meta.env.VITE_FRONTEND_BASE_URL + "/download";

export default function Footer() {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    QRCode.toDataURL(APP_DOWNLOAD_URL, { width: 320, margin: 2 }).then(
      setQrCodeUrl
    );
  }, []);

  return (
    <footer
      className="pt-[100px] pb-[50px] max-w-[1440px] mx-auto w-full bg-[#00072D] px-4"
      id="faqs"
    >
      <div className="max-w-[1120px] w-full mx-auto text-[#00072D] animate-FadeIn">
        <div className="grid grid-cols-1 lg:grid-cols-3 bg-[#F8F3FF] rounded-2xl px-4 py-10 lg:py-14 lg:px-[98px] gap-14 mb-8">
          <div className="hidden lg:flex flex-col items-center gap-4">
            {qrCodeUrl && (
              <img
                src={qrCodeUrl}
                className="h-full w-full"
                alt="Scan QR code to download app"
              />
            )}
          </div>

          <div className="col-span-2 space-y-10">
            <p className="font-semibold text-[#00072D] text-[28px] md:text-[32px] mb-5 font-unbounded">
              Get <span className="text-[#7D32DF]">ErrandGo</span> App the Fast
              and Easy Way
            </p>

            <p>
              Scan the QR code with your smartphone camera and download the app
              instantly so you can start getting help or earning on your own
              terms.
            </p>

            <div className="max-w-[350px] w-full">
              <StoreButtons />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-12 sm:flex-row sm:items-center">
          <div className="flex flex-1 flex-col gap-8">
            <div className="w-full max-w-[483px] space-y-1">
              <Logo tag="footer" />
              <p className="text-[18px] font-light text-[#F8F3FF]">
                info@errandgo.app
              </p>
              {/* <p className="text-[18px] font-light text-[#F8F3FF]">
								+12384652670
							</p> */}
            </div>
          </div>

          <div className="text-[#F8F3FF] space-y-5">
            <div className="text-[#F8F3FF] flex gap-10 sm:justify-end">
              <Link to="/terms-of-use">Term of Use</Link>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </div>

            <div className="flex flex-wrap w-fit gap-5 sm:ml-auto">
              {FOOTER_LINKS.map((link, i) => (
                <Fragment key={i}>
                  <a
                    target="_blank"
                    className="font-normal text-[#F8F3FF] flex items-center gap-2"
                    href={link.href}
                  >
                    <link.icon className="text-2xl" />
                  </a>
                </Fragment>
              ))}
            </div>

            <p className="text-left">
              © {new Date().getFullYear()} ErrandGo. All rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
