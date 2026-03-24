"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Toast = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  icon: string;
};

type ToastContextType = {
  showToast: (message: string, type?: Toast["type"], icon?: string) => void;
};

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: Toast["type"] = "success", icon = "check_circle") => {
    const id = `t-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type, icon }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const colorMap = {
    success: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
    error: "bg-red-500/15 border-red-500/30 text-red-300",
    info: "bg-primary/15 border-primary/30 text-primary",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast stack */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border backdrop-blur-md shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300 pointer-events-auto ${colorMap[t.type]}`}
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {t.icon}
            </span>
            <span className="text-sm font-semibold whitespace-nowrap">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
