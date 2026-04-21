import { Outlet } from "react-router";
import ScrollToTop from "./ScrollToTop";
import WalletKitModal from "@/wallet-kit/WalletKitModal";

function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <WalletKitModal />
      {/* <Header /> */}

      <Outlet />

      {/* <Footer /> */}
    </>
  );
}

export default RootLayout;
