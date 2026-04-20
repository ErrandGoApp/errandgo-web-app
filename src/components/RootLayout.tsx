import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
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
