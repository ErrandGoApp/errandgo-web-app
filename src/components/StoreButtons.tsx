import appStore from "/app-store.svg";
import playStore from "/play-store.svg";

export default function StoreButtons() {
	return (
		<div className="flex gap-4">
			<button
				onClick={() => {
					window.open(
						"https://apps.apple.com/us/app/errandgo-local-tasks-errand/id6758111345",
						"_blank",
						"noopener,noreferrer",
					);
				}}
				className="hover:scale-[1.02] transition-transform cursor-pointer"
			>
				<img src={appStore} alt="" />
			</button>

			<button
				onClick={() => {
					window.open(
						"https://play.google.com/store/apps/details?id=app.errandgo",
						"_blank",
						"noopener,noreferrer",
					);
				}}
				className="hover:scale-[1.02] transition-transform cursor-pointer"
			>
				<img src={playStore} alt="" />
			</button>
		</div>
	);
}
