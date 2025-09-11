// src/components/ui/Button.tsx
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

const base =
  "inline-flex items-center justify-center rounded-xl font-semibold transition shadow-lg disabled:opacity-60 disabled:cursor-not-allowed";

const variants = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
  ghost: "bg-transparent text-zinc-300 hover:text-white hover:bg-white/5",
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-5 py-3 text-base",
  lg: "px-6 py-4 text-lg",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",          // <<< ВАЖНО: больше не submit по умолчанию
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
