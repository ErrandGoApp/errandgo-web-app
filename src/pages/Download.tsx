import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Download() {
	const navigate = useNavigate();

	useEffect(() => {
		const userAgent = navigator.userAgent || navigator.vendor || "";

		const isIOS = /iPad|iPhone|iPod/.test(userAgent) || 
			(navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

		const isAndroid = /android/i.test(userAgent);

		if (isIOS) {
			window.location.assign("https://apps.apple.com/us/app/errandgo-local-tasks-errand/id6758111345");
		} else if (isAndroid) {
			window.location.assign("https://play.google.com/store/apps/details?id=app.errandgo");
		} else {
			navigate("/");
		}
	}, [navigate]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#00072D]">
			<div className="text-center text-white">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
				<p>Redirecting you to the app store...</p>
			</div>
		</div>
	);
}
