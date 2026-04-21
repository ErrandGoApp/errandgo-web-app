import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import RootLayout from "./components/RootLayout.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermOfUse from "./pages/TermOfUse.tsx";
import Download from "./pages/Download.tsx";
import ReactQueryProviders from "./components/providers.tsx";
import { ToastContainer } from "react-toastify";
import ErrandGoWebApp from "./pages/ErrandGoWebApp.tsx";
import ErrandGoNotFoundPage from "./pages/ErrandGoNotFoundPage.tsx";
import GetStartedModal from "./pages/GetStartedModal.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        path: "/",
        Component: ErrandGoWebApp,
        children: [{ path: "auth", Component: GetStartedModal }],
      },
      { path: "escrow", Component: ErrandGoWebApp },
      { path: "trades", Component: ErrandGoWebApp },
      { path: "milestones", Component: ErrandGoWebApp },
      { path: "payments", Component: ErrandGoWebApp },
      { path: "ramps", Component: ErrandGoWebApp },
      { path: "requests", Component: ErrandGoWebApp },
      { path: "activity", Component: ErrandGoWebApp },
      { path: "settings", Component: ErrandGoWebApp },
      { path: "details/:entityType/:entityId", Component: ErrandGoWebApp },

      { path: "download", Component: Download },
      { path: "privacy-policy", Component: PrivacyPolicy },
      { path: "terms-of-use", Component: TermOfUse },
      { path: "*", Component: ErrandGoNotFoundPage },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProviders>
      <RouterProvider router={router} />
      <ToastContainer />
    </ReactQueryProviders>
  </StrictMode>
);
