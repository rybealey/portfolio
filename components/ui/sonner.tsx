"use client";

import { Toaster as SonnerToaster } from "sonner";
import { CircleCheck, CircleX, TriangleAlert, Info } from "lucide-react";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand
      richColors={false}
      duration={Infinity}
      closeButton
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "w-[380px] rounded-lg bg-bg-card p-5 flex flex-col gap-2 border font-sans shadow-lg relative",
          closeButton:
            "!absolute !right-3 !top-3 !left-auto !bottom-auto !transform-none !bg-transparent !border-0 !text-text-muted hover:!text-text-primary !p-0 !h-4 !w-4",
          title: "text-sm font-semibold text-text-primary",
          description: "text-[13px] leading-relaxed text-text-secondary",
          success: "border-green-500/20",
          error: "border-red-500/20",
          warning: "border-amber-500/20",
          info: "border-brand/20",
        },
      }}
      icons={{
        success: <CircleCheck className="h-4 w-4 text-green-500" />,
        error: <CircleX className="h-4 w-4 text-red-500" />,
        warning: <TriangleAlert className="h-4 w-4 text-amber-500" />,
        info: <Info className="h-4 w-4 text-brand" />,
      }}
    />
  );
}
