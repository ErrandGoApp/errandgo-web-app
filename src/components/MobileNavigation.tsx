import { useEffect, type ReactNode } from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { IoMenu } from "react-icons/io5";

interface MobileNavigationProps {
	side?: "right" | "left";
	sheetIsOpen: boolean;
	setSheetIsOpen: (isOpen: boolean) => void;
	children: ReactNode;
}

export function MobileNavigation({
	side = "right",
	sheetIsOpen,
	setSheetIsOpen,
	children,
}: MobileNavigationProps) {
	useEffect(() => {
		const mediaQuery = window.matchMedia("(min-width: 1024px)");
		const handler = () => {
			if (mediaQuery.matches) {
				setSheetIsOpen(false);
			}
		};

		handler();
		mediaQuery.addEventListener("change", handler);
		return () => mediaQuery.removeEventListener("change", handler);
	}, [setSheetIsOpen]);

	return (
		<Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
			<SheetTrigger asChild>
				<button className="cursor-pointer focus:ring-none focus:outline-hidden lg:hidden">
					<IoMenu className="text-[32px]" />
					<span className="sr-only">Open mobile navigation</span>
				</button>
			</SheetTrigger>
			<SheetContent
				side={side}
				className="bg-white rounded-br-[20px] rounded-tr-[20px] p-3"
			>
				<div className="flex min-h-1/2 flex-col justify-center gap-14 px-6 rounded-[20px] pt-6 pb-12 bg-[#F8F3FF]">
					<SheetHeader className="relative">
						<SheetTitle className="absolute left-0 top-0">
							<p className="font-extrabold text-[24px]">
								Errand<span className="text-[#7D32DF]">Go</span>
							</p>{" "}
						</SheetTitle>
						<SheetDescription className="sr-only">
							Mobile navigation
						</SheetDescription>
					</SheetHeader>
					{children}
				</div>
			</SheetContent>
		</Sheet>
	);
}
