import { LogIn, LogOut } from "lucide-react";

type LoginMethod = "wallet" | "google" | "email";
export default function AuthBadge({
  auth,
  onLogout,
  onLoginClick,
}: {
  auth: {
    isAuthenticated: boolean;
    method: LoginMethod | null;
    email: string;
    displayName: string;
  };
  onLogout: () => void;
  onLoginClick: () => void;
}) {
  if (!auth.isAuthenticated) {
    return (
      <button
        onClick={onLoginClick}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
      >
        <LogIn className="h-4 w-auto" />
        Sign in
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-white text-xs font-semibold">
          {auth.displayName?.charAt(0) || "U"}
        </div>

        <div className="leading-tight">
          <div className="text-xs font-semibold text-slate-900">
            {auth.displayName}
          </div>
          <div className="text-[11px] text-slate-500">{auth.email}</div>
        </div>
      </div>

      {/* <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600">
        {methodLabel}
      </div> */}

      <button
        onClick={onLogout}
        className="ml-1 rounded-full px-2 py-0.5 text-[11px] text-slate-500 hover:text-slate-900"
      >
        <LogOut className="text-amber-700 h-4 w-auto" />
        {/* Logout */}
      </button>
    </div>
  );
}
