import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "icon";
};

export function Button({
  className = "",
  variant = "default",
  size = "default",
  type = "button",
  ...props
}: ButtonProps) {
  const variants = {
    // default:
    //   "bg-slate-950 text-white hover:bg-slate-800 border border-slate-950",
    outline:
      "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 border border-transparent",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    icon: "h-10 w-10 p-0",
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-2xl text-sm font-medium transition ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
