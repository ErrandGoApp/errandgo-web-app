import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ErrandGoWorkspaceShell from "@/layout/ErrandGoWorkspaceShell";
import AuthenticationSteps from "@/components/auth/AuthenticationSteps";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app" replace />} />

      <Route path="/app" element={<ErrandGoWorkspaceShell />} />

      <Route path="/auth" element={<ErrandGoWorkspaceShell />}>
        <Route index element={<AuthenticationSteps />} />
      </Route>

      <Route path="*" element={<Navigate to="/app" replace />} />
    </Routes>
  );
}
