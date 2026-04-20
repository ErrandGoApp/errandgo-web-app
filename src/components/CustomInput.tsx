export default function CustomInput({
	label,
	placeholder,
	prefix,
	type = "text",
	className = "",
	icon,
	handleRevealPassword,
	error,
	disabled,
	...props
}: {
	label: string;
	placeholder: string;
	prefix?: string;
	type: string;
	className?: string;
	icon?: string;
	handleRevealPassword?: () => void;
	error?: string;
	disabled?: boolean;
}) {
	return (
		<label className="flex flex-col items-start gap-2 font-light text-[#09032A]">
			{label}
			{prefix ? (
				<div className="relative w-full rounded-sm border-2">
					<span className="absolute top-0 bottom-0 flex h-full items-center rounded-l-sm bg-[#EDF2FF] px-4 pt-2 text-sm text-[#8791A7]">
						{prefix}
					</span>
					<input
						type={type}
						placeholder={placeholder}
						disabled={disabled}
						className={`rounded-[12px] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:border-none disabled:outline-none border-none bg-[#F7F9FD] px-3 py-4 pl-24 placeholder:text-sm placeholder:text-[#8791A7] focus:border-none focus:outline-0 focus:outline-none focus-visible:border-none focus-visible:ring-0 ${className}`}
						{...props}
					/>
					{icon && (
						<span
							onClick={() => handleRevealPassword && handleRevealPassword()}
							className="absolute top-0 bottom-0 flex h-full items-center rounded-l-sm bg-[#EDF2FF] px-4 pt-2 text-sm text-[#8791A7]"
						>
							{icon}
						</span>
					)}
				</div>
			) : (
				<>
					<div className="relative w-full rounded-sm">
						<input
							type={type}
							placeholder={placeholder}
							disabled={disabled}
							className={`rounded-[12px] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:border-none disabled:outline-none border-none bg-[#F7F9FD] px-3 py-4 placeholder:text-sm placeholder:text-[#8791A7] focus:border-none focus:outline-0 focus:outline-none focus-visible:border-none focus-visible:ring-0 ${className}`}
							{...props}
						/>
						{icon && (
							<span
								onClick={() => handleRevealPassword && handleRevealPassword()}
								className="absolute top-0 right-0 bottom-0 flex cursor-pointer items-center px-4 text-2xl text-[#B2B9C7]"
							>
								{icon}
							</span>
						)}
					</div>
				</>
			)}

			{error && <span className="text-xs text-red-500">{error}</span>}
		</label>
	);
}
