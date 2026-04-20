import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import RootLayout from "./components/RootLayout.tsx";
import HomePage from "@/components/pages/HomePage.tsx";
import PrivacyPolicy from "./components/pages/PrivacyPolicy.tsx";
import TermOfUse from "./components/pages/TermOfUse.tsx";
import WaitList from "./components/pages/WaitList.tsx";
import Download from "./components/pages/Download.tsx";
import ReactQueryProviders from "./components/providers.tsx";
import { ToastContainer } from "react-toastify";
import ErrandGoWebApp from "./components/pages/ErrandGoWebApp.tsx";
import ErrandGoNotFoundPage from "./components/pages/ErrandGoNotFoundPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: ErrandGoWebApp },
      { path: "download", Component: Download },
      { path: "privacy-policy", Component: PrivacyPolicy },
      { path: "terms-of-use", Component: TermOfUse },
      // { path: "wait-list", Component: WaitList },
      {
        path: "*",
        Component: ErrandGoNotFoundPage,
        // element: (
        //   <div className="flex h-screen text-6xl items-center justify-center font-extrabold">
        //     404
        //   </div>
        // ),
      },
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
