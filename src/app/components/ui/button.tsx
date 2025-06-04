// components/ui/button.tsx
import React from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    "px-4 py-2 rounded-lg font-semibold transition-colors duration-300";
  const variantStyles =
    variant === "primary"
      ? "bg-pink-500 text-white hover:bg-pink-600"
      : "bg-white/10 text-white hover:bg-white/20";

  return (
    <button className={clsx(baseStyles, variantStyles, className)} {...props}>
      {children}
    </button>
  );
}
