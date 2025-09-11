"use client";

import { useState } from "react";

let listeners: ((msg: string, type: "success" | "error") => void)[] = [];

export function showToast(msg: string, type: "success" | "error" = "success") {
  listeners.forEach(fn => fn(msg, type));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: string }[]>([]);

  function addToast(msg: string, type: "success" | "error") {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }

  listeners = [addToast];

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`px-4 py-2 rounded-xl shadow-md ${
            t.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}
