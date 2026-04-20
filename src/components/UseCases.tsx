import { GET_HELP_USE_CASES, HELP_AND_EARN_USE_CASES } from "@/lib/constants";
import StarIcon from "./StarIcon";
import CoinIcon from "./CoinIcon";

export default function UseCases() {
	return (
		<>
			<div className="pt-[110px] lg:pt-[150px] bg-white px-4">
				<div className="max-w-[1120px] w-full mx-auto text-[#00072D] animate-FadeIn">
					<div className="mb-8 text-center">
						<span className="text-[#8791A7] text-[18px] lg:text-[24px] font-medium uppercase">
							Use Cases
						</span>
						<h2 className="text-[24px] lg:text-[40px] text-[#00072D] font-semibold font-unbounded">
							What you can do on ErrandGo
						</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-[#F7F9FD] rounded-3xl py-8 px-[34px]">
							<p className="font-bold text-[#7D32DF] text-[24px] md:text-[28px] mb-5">
								Get Help with Errands
							</p>
							<ul>
								{GET_HELP_USE_CASES.map((useCase, index) => (
									<li
										key={index}
										className="text-[#00072D] font-normal text-[16px] lg:text-[18px] mb-5 flex items-center gap-3"
									>
										<StarIcon />
										{useCase}
									</li>
								))}
							</ul>
						</div>
						<div className="bg-[#F7F9FD] rounded-3xl py-8 px-[34px]">
							<p className="font-bold text-[#4ABD46] text-[24px] md:text-[28px] mb-5">
								Help with Errands and Earn
							</p>
							<ul>
								{HELP_AND_EARN_USE_CASES.map((useCase, index) => (
									<li
										key={index}
										className="text-[#383C45] font-normal text-[16px] lg:text-[18px] mb-5 flex items-center gap-3"
									>
										<CoinIcon />
										{useCase}
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
