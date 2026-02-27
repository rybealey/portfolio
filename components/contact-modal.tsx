"use client";

import { useState } from "react";
import { Lock, Mail, Send, ShieldCheck, User, X } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ContactModal({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="max-w-[432px] gap-0 overflow-hidden rounded-lg border-border-light bg-bg-card p-0 backdrop:backdrop-blur-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-dark px-6 py-5">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] font-semibold tracking-[2px] text-brand">
              LET&apos;S WORK TOGETHER
            </span>
            <DialogTitle className="text-xl font-bold text-text-primary">
              Get in Touch
            </DialogTitle>
          </div>
          <DialogClose asChild>
            <button
              className="flex h-8 w-8 items-center justify-center rounded border border-border-dark text-text-muted transition-colors hover:text-text-primary"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogClose>
        </div>

        {/* Form Body */}
        <div className="flex flex-col gap-5 p-6">
          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[11px] font-semibold tracking-[1px] text-text-secondary">
              Full Name
            </label>
            <div className="flex items-center gap-2.5 rounded border border-border-dark bg-bg-dark px-4 py-3">
              <User className="h-4 w-4 shrink-0 text-text-muted" />
              <input
                type="text"
                placeholder="Jane Doe"
                className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[11px] font-semibold tracking-[1px] text-text-secondary">
              Email Address
            </label>
            <div className="flex items-center gap-2.5 rounded border border-border-dark bg-bg-dark px-4 py-3">
              <Mail className="h-4 w-4 shrink-0 text-text-muted" />
              <input
                type="email"
                placeholder="jane@example.com"
                className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
              />
            </div>
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[11px] font-semibold tracking-[1px] text-text-secondary">
              Message
            </label>
            <textarea
              placeholder="Tell me about your project..."
              maxLength={500}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-[120px] w-full resize-none rounded border border-border-dark bg-bg-dark px-4 py-3 text-sm leading-relaxed text-text-primary placeholder:text-text-muted outline-none"
            />
            <span className="text-right font-mono text-[10px] text-text-muted">
              {message.length} / 500
            </span>
          </div>

          {/* Captcha Row */}
          <div className="flex items-center justify-between rounded border border-border-dark bg-bg-dark px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-[3px] border-[1.5px] border-text-muted" />
              <span className="text-[13px] text-text-secondary">
                I&apos;m not a robot
              </span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <ShieldCheck className="h-5 w-5 text-text-muted" />
              <span className="text-[7px] font-medium text-text-muted">
                reCAPTCHA
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-4 border-t border-border-dark px-6 pt-4 pb-5">
          <button className="flex w-full items-center justify-center gap-2 rounded bg-brand px-6 py-3.5 text-bg-dark transition-opacity hover:opacity-90">
            <Send className="h-4 w-4" />
            <span className="font-mono text-[13px] font-semibold">
              Send Message
            </span>
          </button>
          <div className="flex items-center justify-center gap-1.5">
            <Lock className="h-3 w-3 text-text-muted" />
            <span className="font-mono text-[10px] text-text-muted">
              Your information is encrypted and never shared.
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
