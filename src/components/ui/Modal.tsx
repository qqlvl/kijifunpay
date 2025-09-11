import { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ open, onClose, children }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* content */}
      <div className={cn(
        "relative z-10 rounded-2xl bg-zinc-900 border border-white/10 p-6 w-[90%] max-w-md shadow-xl"
      )}>
        {children}
      </div>
    </div>
  );
}
