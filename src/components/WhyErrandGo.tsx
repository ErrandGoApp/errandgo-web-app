import { ERRAND_CREATOR, ERRAND_HELPER } from "@/lib/constants";
import StoreButtons from "./StoreButtons";
import frameSix from "/frame-6.svg";
import frameSeven from "/frame-7.svg";
import frameSixMobile from "/frame-6-mobile.svg";
import frameSevenMobile from "/frame-7-mobile.svg";
import CheckMarkIcon from "./CheckMarkIcon";

export default function WhyErrandGo() {
	return (
		<>
			<div className="pt-[110px] lg:pt-[150px] bg-white px-4">
				<div className="max-w-[1120px] w-full mx-auto text-[#00072D] animate-FadeIn">
					<div className="mb-8 text-center">
						<span className="text-[#8791A7] text-[18px] lg:text-[24px] font-medium uppercase">
							WHY ERRANDGO
						</span>
						<h2 className="text-[24px] lg:text-[40px] text-[#00072D] font-semibold font-unbounded">
							A Win for Everyone
						</h2>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 mb-10">
						<div className="bg-[#FAFAC6] py-8 px-10 rounded-t-2xl lg:rounded-l-2xl lg:rounded-t-none flex flex-col justify-center">
							<p className="font-bold text-[#00072D] text-[24px] md:text-[28px] mb-5 font-unbounded">
								As an Errand Creator,
							</p>

							<ul>
								{ERRAND_CREATOR.map((creator, index) => (
									<li
										key={index}
										className="text-[#00072D] font-normal text-[16px] lg:text-[18px] mb-3 flex items-center gap-3"
									>
										<CheckMarkIcon color="#C0C000" />
										{creator}
									</li>
								))}
							</ul>
						</div>

						<img
							src={frameSix}
							className="hidden lg:block h-full w-full"
							alt=""
						/>
						<img
							src={frameSixMobile}
							className="lg:hidden h-full w-full"
							alt=""
						/>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 mb-8">
						<img
							src={frameSeven}
							className="hidden lg:block h-full w-full order-2 lg:order-1"
							alt=""
						/>

						<img
							src={frameSevenMobile}
							className="lg:hidden h-full w-full order-2 lg:order-1"
							alt=""
						/>

						<div className="bg-[#F4EBFF] py-8 px-10 order-1 lg:order-2 rounded-t-2xl lg:rounded-r-2xl lg:rounded-t-none flex flex-col justify-center">
							<p className="font-bold text-[#00072D] text-[24px] md:text-[28px] mb-5 font-unbounded">
								As an Errand Helper,
							</p>

							<ul>
								{ERRAND_HELPER.map((creator, index) => (
									<li
										key={index}
										className="text-[#00072D] font-normal text-[16px] lg:text-[18px] mb-3 flex items-center gap-3"
									>
										<CheckMarkIcon color="#7D32DF" />
										{creator}
									</li>
								))}
							</ul>
						</div>
					</div>

					<div className="max-w-[350px] w-full mx-auto">
						<StoreButtons />
					</div>
				</div>
			</div>
		</>
	);
}
