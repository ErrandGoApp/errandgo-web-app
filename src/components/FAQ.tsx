import { FAQs } from "@/lib/constants";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
	return (
		<div className="pt-[110px] lg:pt-[150px] bg-white px-4" id="faqs">
			<div className="max-w-[1120px] w-full mx-auto text-[#00072D] animate-FadeIn">
				<div className="mb-8 text-center">
					<span className="text-[#8791A7] text-[18px] lg:text-[24px] font-medium uppercase">
						FAQs
					</span>
					<h2 className="text-[24px] lg:text-[40px] text-[#00072D] font-semibold font-unbounded">
						Frequently Asked Questions
					</h2>
				</div>

				<Accordion type="single" collapsible className="w-full mb-20">
					{FAQs.map((item, index) => (
						<AccordionItem
							className="bg-[#F7F9FD] rounded-2xl p-6 py-4 mb-5 shadow-none"
							key={item.id}
							value={item.id}
						>
							<AccordionTrigger className="text-[#00072D] hover:no-underline text-[18px] lg:text-[20px] font-light">
								<p className="flex gap-1">
									{index + 1}. <span>{item.title}</span>
								</p>
							</AccordionTrigger>
							<AccordionContent className="flex flex-col gap-4 text-balance bg-white py-4 px-[30px] rounded-xl text-[#383C45] font-normal text-[18px] lg:text-[20px]">
								{item.content.map((paragraph, index) => (
									<div
										className="text-[#383C45] text-[18px] lg:text-[20px] font-normal"
										key={index}
										dangerouslySetInnerHTML={{ __html: paragraph }}
									/>
								))}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</div>
	);
}
