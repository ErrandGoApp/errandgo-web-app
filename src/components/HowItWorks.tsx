import { useState } from "react";
import StoreButtons from "./StoreButtons";
import frameFive from "/frame-5.svg";
import frameSix from "/Clip path group.svg";

export default function HowItWorks() {
  const [view, setView] = useState("get-help");

  const handleChangeView = (selectedView: string) => {
    setView(selectedView);
  };

  return (
    <>
      <div className="pt-[110px] lg:pt-[150px] bg-white px-4" id="how-it-works">
        <div className="max-w-[1120px] w-full mx-auto text-[#00072D] animate-FadeIn">
          {/* HEADER */}
          <div className="mb-8 text-center">
            <span className="text-[#8791A7] text-[18px] lg:text-[24px] font-medium uppercase">
              How It Works
            </span>
            <h2 className="text-[24px] lg:text-[40px] text-[#00072D] font-semibold font-unbounded">
              Few Steps to Get Help or Earn
            </h2>
          </div>

          <div className="max-w-[320px] flex  w-full mx-auto mb-10 bg-[#F7F9FD] text-[#383C45] font-medium text-[18px] rounded-[10px] p-2">
            <button
              className={`w-full rounded-lg p-2 ${
                view === "get-help" && "bg-white text-[#7D32DF]"
              } cursor-pointer`}
              onClick={() => handleChangeView("get-help")}
            >
              Get Help
            </button>
            <button
              className={`w-full rounded-lg p-2 ${
                view === "help-and-earn" && "bg-white text-[#7D32DF]"
              } cursor-pointer`}
              onClick={() => handleChangeView("help-and-earn")}
            >
              Help & Earn
            </button>
          </div>

          <div
            key={view}
            className="grid grid-cols-1 lg:grid-cols-3 mb-8 gap-6 animate-FadeIn"
          >
            {view === "get-help" ? (
              <>
                <div className="flex flex-col justify-between gap-12 max-w-[343px] mx-auto w-full">
                  <div className="space-y-6 rounded-lg p-4 text-[#00072D]">
                    <div className="bg-[#FAFAC6] flex items-center justify-center rounded-[20px] text-[28px] lg:text-[43px] font-bold w-[72px] h-16">
                      1
                    </div>
                    <p className="font-bold text-[20px] lg:text-[24px]">
                      Create an Errand
                    </p>
                    <p className="text-[#383C45] font-normal text-[16px] lg:text-[18px]">
                      Sign up, describe what you need help with and set
                      requirements for your errands.
                    </p>
                  </div>

                  <div className="space-y-6 rounded-lg p-4 text-[#00072D]">
                    <div className="bg-[#F4EBFF] flex items-center justify-center rounded-[20px]  text-[28px] lg:text-[43px] font-bold w-[72px] h-16">
                      2
                    </div>
                    <p className="font-bold text-[20px] lg:text-[24px]">
                      Receive Bids
                    </p>
                    <p className="text-[#383C45] font-normal text-[16px] lg:text-[18px]">
                      Helpers near the errand location bid with price, distance
                      range and ratings.
                    </p>
                  </div>
                </div>

                <div className="flex justify-center items-center">
                  <img src={frameFive} className="h-full" alt="" />
                </div>

                <div className="flex flex-col justify-between gap-12 max-w-[343px] mx-auto w-full">
                  <div className="space-y-6 rounded-lg p-4 text-[#00072D]">
                    <div className="bg-[#FCEBFF] flex items-center justify-center rounded-[20px] text-[28px] lg:text-[43px] font-bold w-[72px] h-16">
                      3
                    </div>
                    <p className="font-bold text-[20px] lg:text-[24px]">
                      Choose Preferred Helper
                    </p>
                    <p className="text-[#383C45] font-normal text-[16px] lg:text-[18px]">
                      Accept the bid that fits your budget and timeline or
                      enable the auto-accept function for easier selection.
                    </p>
                  </div>

                  <div className="space-y-6 rounded-lg p-4 text-[#00072D]">
                    <div className="bg-[#D5FFD4] flex items-center justify-center rounded-[20px]  text-[28px] lg:text-[43px] font-bold w-[72px] h-16">
                      4
                    </div>
                    <p className="font-bold text-[20px] lg:text-[24px]">
                      Track & Get Updates
                    </p>
                    <p className="text-[#383C45] font-normal text-[16px] lg:text-[18px]">
                      Follow the errand progress and get update on the errand
                      requirements through texts, photos, or videos.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col justify-between gap-12 max-w-[343px] mx-auto w-full">
                  <div className="space-y-6 rounded-lg p-4 text-[#00072D]">
                    <div className="bg-[#D5FFD4] flex items-center justify-center rounded-[20px] text-[28px] lg:text-[43px] font-bold w-[72px] h-16">
                      1
                    </div>
                    <p className="font-bold text-[20px] lg:text-[24px]">
                      Set-up Profile
                    </p>
                    <p className="text-[#383C45] font-normal text-[16px] lg:text-[18px]">
                      Sign up, provide all the required information and set your
                      errand location radius.
                    </p>
                  </div>

                  <div className="space-y-6 rounded-lg p-4 text-[#00072D]">
                    <div className="bg-[#FCEBFF] flex items-center justify-center rounded-[20px]  text-[28px] lg:text-[43px] font-bold w-[72px] h-16">
                      2
                    </div>
                    <p className="font-bold text-[20px] lg:text-[24px]">
                      View Errands Around You
                    </p>
                    <p className="text-[#383C45] font-normal text-[16px] lg:text-[18px]">
                      Browse through available errands near your area or along
                      your route.
                    </p>
                  </div>
                </div>

                <div className="flex justify-center items-center">
                  <img src={frameSix} className="h-full" alt="" />
                </div>

                <div className="flex flex-col justify-between gap-12 max-w-[343px] mx-auto w-full">
                  <div className="space-y-6 rounded-lg p-4 text-[#00072D]">
                    <div className="bg-[#F4EBFF] flex items-center justify-center rounded-[20px] text-[28px] lg:text-[43px] font-bold w-[72px] h-16">
                      3
                    </div>
                    <p className="font-bold text-[20px] lg:text-[24px]">
                      Place your bid
                    </p>
                    <p className="text-[#383C45] font-normal text-[16px] lg:text-[18px]">
                      Show interest in an errand of choice and set the price you
                      are willing to collect.
                    </p>
                  </div>

                  <div className="space-y-6 rounded-lg p-4 text-[#00072D]">
                    <div className="bg-[#FAFAC6] flex items-center justify-center rounded-[20px]  text-[28px] lg:text-[43px] font-bold w-[72px] h-16">
                      4
                    </div>
                    <p className="font-bold text-[20px] lg:text-[24px]">
                      Finish Errand, Get paid
                    </p>
                    <p className="text-[#383C45] font-normal text-[16px] lg:text-[18px]">
                      Complete errands and get paid instantly in USDC on
                      Stellar. Secure off-ramp available.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="max-w-[350px] w-full mx-auto">
            <StoreButtons />
          </div>
        </div>
      </div>
    </>
  );
}
