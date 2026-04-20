import { FaApple, FaGooglePlay } from "react-icons/fa";

interface DownloadAppProps {
  tag: "desktop" | "mobile";
}

export default function DownloadApp({ tag }: DownloadAppProps) {
  return (
    <div
      className={` flex gap-[3px] w-full   ${
        tag === "desktop"
          ? "hidden lg:flex"
          : tag === "mobile"
          ? "flex justify-center "
          : "block"
      }`}
    >
      <button
        onClick={() => {
          window.open(
            "https://apps.apple.com/us/app/errandgo-local-tasks-errand/id6758111345",
            "_blank",
            "noopener,noreferrer"
          );
        }}
        className={`cursor-pointer shrink-0 flex gap-3 justify-center items-center rounded-l-[360px] py-4 pl-6 pr-4 bg-[#7D32DF] text-white font-medium text-base transition-colors duration-300 ${
          tag === "desktop"
            ? "hidden lg:flex"
            : tag === "mobile"
            ? "flex "
            : "block"
        }`}
      >
        <div className="flex items-center gap-3 ">
          <FaApple className="text-[24px]" />

          <span className="shrink-0 font-bold">IOS</span>
        </div>
      </button>
      <button
        onClick={() => {
          window.open(
            "https://play.google.com/store/apps/details?id=app.errandgo",
            "_blank",
            "noopener,noreferrer"
          );
        }}
        className={`cursor-pointer shrink-0 flex gap-3 justify-center items-center rounded-r-[360px] py-4 pl-4 pr-6 bg-[#7D32DF] text-white font-medium text-base transition-colors duration-300 ${
          tag === "desktop"
            ? "hidden lg:flex"
            : tag === "mobile"
            ? "flex"
            : "block"
        }`}
      >
        <div>
          <FaGooglePlay className="text-[24]" />
        </div>

        <span className="shrink-0 font-bold">Android</span>
      </button>
    </div>
  );
}
