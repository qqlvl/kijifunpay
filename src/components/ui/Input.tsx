import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type Props = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>(function InputBase(
  { className, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-xl bg-zinc-900/60 border border-white/10",
        "px-4 py-3 text-base text-white placeholder:text-zinc-500",
        "focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/40",
        className
      )}
      {...props}
    />
  );
});
