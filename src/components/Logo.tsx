import LogoDark from "./LogoDark";
import LogoLight from "./LogoLight";

export default function Logo({ tag }: { tag: string }) {
	return (
		<>
			<a href="/" className="flex items-center">
				{tag === "header" && (
					<>
						<LogoLight />
					</>
				)}

				{tag === "footer" && (
					<>
						<LogoDark />
					</>
				)}
			</a>
		</>
	);
}
