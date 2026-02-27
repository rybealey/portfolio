"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { Lock, Mail, Send, User, X, Check, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { sendContactEmail, type ContactState } from "@/app/actions/contact";

export function ContactModal({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [state, formAction, isPending] = useActionState<ContactState, FormData>(
    sendContactEmail,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Reset form on success, close after a brief delay
  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setMessage("");
      setSent(true);
      const timeout = setTimeout(() => setOpen(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [state]);

  // Reset everything when dialog reopens
  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setMessage("");
      setSent(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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

        <form ref={formRef} action={formAction}>
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
                  name="name"
                  required
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
                  name="email"
                  required
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
                name="message"
                required
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

            {/* Error message */}
            {state?.error && (
              <p className="font-mono text-xs text-red-400">{state.error}</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-4 border-t border-border-dark px-6 pt-4 pb-5">
            <button
              type="submit"
              disabled={isPending || sent}
              className="flex w-full items-center justify-center gap-2 rounded bg-brand px-6 py-3.5 text-bg-dark transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : sent ? (
                <Check className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="font-mono text-[13px] font-semibold">
                {isPending
                  ? "Sending..."
                  : sent
                    ? "Message Sent!"
                    : "Send Message"}
              </span>
            </button>
            <div className="flex items-center justify-center gap-1.5">
              <Lock className="h-3 w-3 text-text-muted" />
              <span className="font-mono text-[10px] text-text-muted">
                Your information is encrypted and never shared.
              </span>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
