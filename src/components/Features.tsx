import frameOne from "/frame-1.svg";
import frameTwo from "/frame-2.svg";
import frameThree from "/Frame 59348.svg";
import frameFour from "/frame-4.svg";

export default function Features() {
  return (
    <>
      <div className="pt-[110px] lg:pt-[150px] bg-white px-4" id="features">
        <div className="max-w-[1120px] w-full mx-auto text-[#00072D] animate-FadeIn">
          {/* Masonry */}
          <div className="columns-1 md:columns-2 gap-8">
            {/* HEADER */}
            <div className="break-inside-avoid mb-8">
              <span className="text-[#8791A7] text-[18px] lg:text-[24px] font-medium uppercase">
                ERRANDgo for you
              </span>
              <h2 className="text-[24px] lg:text-[40px] text-[#00072D] font-semibold font-unbounded">
                Our Core Features
              </h2>
            </div>

            {/* FEATURE 1 */}
            <div className="break-inside-avoid mb-8 max-w-[544px] w-full mx-auto bg-[#F7F9FD] py-6 px-5 rounded-2xl">
              <img src={frameTwo} alt="" />
              <div className="space-y-4 rounded-lg pt-6">
                <h3 className="text-[24px] lg:text-[28px] text-[#7D32DF] font-bold">
                  Smooth Errand Request Process
                </h3>
                <p className="text-[#383C45] text-base lg:text-[18px] font-normal">
                  Seamlessly create an errand request, set the amount you are
                  willing to pay, and let nearby helpers pick it up. Receive
                  inquiries from near or distant locations out of your reach.
                </p>
              </div>
            </div>

            {/* FEATURE 2 */}
            <div className="break-inside-avoid mb-8 max-w-[544px] w-full mx-auto bg-[#F7F9FD] py-6 px-5 rounded-2xl">
              <img src={frameFour} alt="" />
              <div className="space-y-4 rounded-lg pt-6">
                <h3 className="text-[24px] lg:text-[28px] text-[#C2C200] font-bold">
                  Smart Bidding & Escrow System
                </h3>
                <p className="text-[#383C45] text-base lg:text-[18px] font-normal">
                  Errand creators receive multiple bids and can choose the one
                  that best fits their needs. Our Soroban smart contracts
                  securely lock funds in escrow and automatically release
                  payments based on acceptance logic and recorded errand status.
                </p>
              </div>
            </div>

            {/* FEATURE 3 */}
            <div className="break-inside-avoid mb-8 max-w-[544px] w-full mx-auto bg-[#F7F9FD] py-6 px-5 rounded-2xl">
              <img src={frameOne} alt="" />
              <div className="space-y-4 rounded-lg pt-6">
                <h3 className="text-[24px] lg:text-[28px] text-[#4ABD46] font-bold">
                  Real Time Updates
                </h3>
                <p className="text-[#383C45] text-base lg:text-[18px] font-normal">
                  Get photos, videos, messages, and progress reports as your
                  errand is being carried out as updates are being shared by the
                  errand pal and requirements get approved on-the-go.
                </p>
              </div>
            </div>

            {/* FEATURE 4 */}
            <div className="break-inside-avoid mb-8 max-w-[544px] w-full mx-auto bg-[#F7F9FD] py-6 px-5 rounded-2xl">
              <img src={frameThree} alt="" />
              <div className="space-y-4 rounded-lg pt-6">
                <h3 className="text-[24px] lg:text-[28px] text-[#B331CE] font-bold">
                  Stellar-Powered Payments
                </h3>
                <p className="text-[#383C45] text-base lg:text-[18px] font-normal">
                  Swift payments and withdrawals for completed tasks and
                  errands. Powered by Stellar and Soroban, transactions are
                  fast, secure, and transparent, with clear charges and fair
                  earnings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
