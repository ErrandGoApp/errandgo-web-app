import { Outlet } from "react-router";
import ScrollToTop from "./ScrollToTop";

function RootLayout() {
  return (
    <>
      <ScrollToTop />
      {/* <Header /> */}

      <Outlet />

      {/* <Footer /> */}
    </>
  );
}

export default RootLayout;
