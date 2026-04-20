import mobileAppImage from "/Group 28918.svg";
import StoreButtons from "./StoreButtons";

export default function Hero() {
  return (
    <div className="relative max-w-[1440px] mx-auto w-full px-4 pt-[153px] lg:pt-[200px] pb-[50px] sm:pb-[100px] bg-linear-to-b from-[#FFFFFF] to-[#F8F3FF] flex items-center justify-center">
      <div className="max-w-[1120px] w-full mx-auto text-[#00072D] animate-FadeIn z-10">
        <div className="h-full flex w-full flex-col items-center gap-12 lg:flex-row">
          <div className="flex flex-col gap-6 lg:max-w-xl">
            <div className="space-y-8">
              <h1 className="text-[32px] font-semibold lg:text-[52px] font-unbounded">
                Swift <span className="text-[#7D32DF]">Errands</span>. Real
                Earnings. Powered by Stellar
              </h1>

              <p className="text-[20px] font-normal lg:text-[24px] text-[#525866]">
                ErrandGo connects you with trusted helpers for shopping,
                deliveries, repairs, cleaning, and everyday errands — powered by
                Stellar & Soroban
              </p>
            </div>

            <div className="max-w-[350px] w-full">
              <StoreButtons />
            </div>
          </div>

          <img
            src={mobileAppImage}
            className="h-auto sm:h-[656px] animate-SlideIn"
            alt="Mobile App logo"
          />
        </div>
      </div>

      <div
        className={`bg-[url(/bg-logo.svg)] bg-cover bg-center h-[300px] absolute bottom-0 left-0 right-0 lg:bg-right lg:bg-contain bg-no-repeat lg:h-[450px] animate-FadeIn`}
      />
    </div>
  );
}
