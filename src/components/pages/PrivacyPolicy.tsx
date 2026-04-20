import { PRIVACY_POLICY } from "@/lib/constants";
// import {
// 	Accordion,
// 	AccordionContent,
// 	AccordionItem,
// 	AccordionTrigger,
// } from "../ui/accordion";

function PrivacyPolicy() {
	return (
		<div className="pt-[150px] lg:pt-[200px] bg-white px-4 min-h-screen">
			<div className="max-w-[1120px] w-full mx-auto text-[#00072D] animate-FadeIn">
				<div className="mb-8">
					<h2 className="text-[24px] lg:text-[40px] text-[#00072D] font-semibold font-unbounded">
						Privacy Policy
					</h2>

					<span className="text-[#8791A7] text-[16px] lg:text-[20px] font-normal">
						Last updated December 10, 2025
					</span>
				</div>

				<div className="space-y-10 mb-20">
					{PRIVACY_POLICY.map((item, index) => (
						<div className="space-y-3" key={index}>
							<h3 className="text-[20px] lg:text-2xl text-[#161616] font-bold">
								{item.title}
							</h3>

							<div className="flex flex-col gap-4 text-balance bg-white py-4 px-[30px] rounded-xl text-[#383C45] font-normal text-[18px]">
								{item.content.map((paragraph, index) => (
									<div
										key={index}
										dangerouslySetInnerHTML={{ __html: paragraph }}
									/>
								))}
							</div>
						</div>
					))}
				</div>

				{/* <Accordion type="single" collapsible className="w-full mb-20">
					{PRIVACY_POLICY.map((item, index) => (
						<AccordionItem
							className="bg-[#F7F9FD] rounded-2xl p-6 py-4 mb-5 shadow-none"
							key={item.id}
							value={item.id}
						>
							<AccordionTrigger className="text-[#161616] font-bold hover:no-underline text-[18px] lg:text-[20px]">
								<p className="flex gap-1">
									{index + 1}. <span>{item.title}</span>
								</p>
							</AccordionTrigger>
							<AccordionContent className="flex flex-col gap-4 text-balance bg-white py-4 px-[30px] rounded-xl text-[#383C45] font-normal text-[18px]">
								{item.content.map((paragraph, index) => (
									<div
										key={index}
										dangerouslySetInnerHTML={{ __html: paragraph }}
									/>
								))}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion> */}
			</div>
		</div>
	);
}

export default PrivacyPolicy;
