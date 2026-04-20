import type { FieldValues, UseFormRegister } from "react-hook-form";

interface Option {
	label: string;
	value: string;
}

interface CustomSelectProps<T extends FieldValues = FieldValues> {
	label: string;
	placeholder?: string;
	options: Option[];
	error?: string;
	register?: ReturnType<UseFormRegister<T>>;
	className?: string;
	disabled?: boolean;
}

export default function CustomSelect<T extends FieldValues>({
	label,
	placeholder = "Select",
	options,
	error,
	register,
	className = "",
	disabled,
	...rest
}: CustomSelectProps<T>) {
	return (
		<div className="">
			<label className="flex flex-col items-start gap-1 text-[14px] font-light text-[#09032A]">
				{label}
				<div className="relative w-full rounded-sm">
					<select
						{...(register ? register : {})}
						className={`h-14 rounded-[12px] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:border-none disabled:outline-none border-none bg-[#F7F9FD] px-3 py-4 placeholder:text-sm placeholder:text-[#8791A7] focus:border-none focus:outline-0 focus:outline-none focus-visible:border-none focus-visible:ring-0 ${className} w-full`}
						{...rest}
						disabled={disabled}
					>
						<option value="" className="text-[#8791A7]">
							{placeholder}
						</option>
						{options.map((opt: Option) => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))}
					</select>
				</div>

				{error && <span className="text-xs text-red-500">{error}</span>}
			</label>
		</div>
	);
}
