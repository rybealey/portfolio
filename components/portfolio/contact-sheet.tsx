"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const labelClass =
  "font-mono text-[var(--text-2xs)] uppercase tracking-[var(--tracking-label)] text-[var(--text-muted)]";
const fieldClass =
  "h-auto rounded-[var(--radius-sm)] border-[var(--border-strong)] bg-[var(--surface-card)] px-3 py-[11px] text-sm text-[var(--text-strong)] focus-visible:border-[var(--accent)]";

/**
 * ContactSheet — a slide-up bottom sheet (shadcn Sheet) housing the contact
 * form. Switches to a confirmation state on submit; resets each time it opens.
 */
export function ContactSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset to a fresh form view whenever the sheet opens (handled in the event,
  // not an effect, so there's no flash during the close animation).
  const handleOpenChange = (next: boolean) => {
    if (next) {
      setSent(false);
      setError(null);
      setSubmitting(false);
    }
    onOpenChange(next);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const payload = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="mx-auto max-h-[88vh] w-full max-w-[560px] gap-0 overflow-y-auto rounded-t-[22px] border-b-0 bg-[var(--surface-card)] px-[clamp(18px,5vw,32px)] pt-7 pb-[34px]"
        style={{ boxShadow: "0 -12px 44px rgba(27,32,28,0.20)" }}
      >
        {/* drag handle */}
        <div
          className="mx-auto mb-[22px] h-1 w-[38px] rounded-full"
          style={{ background: "var(--border-strong)" }}
        />
        <SheetClose
          aria-label="Close"
          className="absolute top-[22px] right-[22px] flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full text-[17px] leading-none"
          style={{
            background: "var(--surface-sunken)",
            border: "1px solid var(--border-default)",
            color: "var(--text-muted)",
          }}
        >
          ×
        </SheetClose>

        {sent ? (
          <div className="px-2 pt-6 pb-3 text-center">
            <div
              className="mx-auto mb-[18px] flex h-[52px] w-[52px] items-center justify-center rounded-full text-2xl"
              style={{
                background: "var(--surface-sage)",
                border: "1px solid var(--xanadu-200)",
                color: "var(--accent-hover)",
              }}
            >
              <Check size={24} strokeWidth={2.4} />
            </div>
            <div className="eyebrow">
              <span className="opacity-55">{"// "}</span>message_sent
            </div>
            <SheetTitle className="display m-0 mt-2 mb-2.5 text-[26px] font-normal text-[var(--text-strong)]">
              Thanks — I&apos;ll be in touch soon.
            </SheetTitle>
            <p
              className="mx-auto mb-6 max-w-[360px] text-[15px] leading-[1.6]"
              style={{ color: "var(--text-muted)" }}
            >
              I usually reply within a day or two.
            </p>
            <SheetClose asChild>
              <Button
                variant="secondary"
                className="h-11 rounded-[var(--radius-sm)] border-[var(--border-strong)] px-5 font-semibold text-[var(--text-strong)] hover:border-[var(--accent)] hover:text-[var(--accent-hover)]"
              >
                close
              </Button>
            </SheetClose>
          </div>
        ) : (
          <div>
            <div className="eyebrow">
              <span className="opacity-55">{"// "}</span>get_in_touch
            </div>
            <SheetTitle className="display m-0 mt-2.5 mb-[22px] text-[28px] font-normal text-[var(--text-strong)]">
              Send a message.
            </SheetTitle>
            <SheetDescription className="sr-only">
              Contact form for getting in touch with Ry Bealey.
            </SheetDescription>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Honeypot: hidden from people, tempting to bots. */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="sr-only"
              />
              <div className="flex gap-3">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <label htmlFor="f-first" className={labelClass}>
                    first name
                  </label>
                  <Input id="f-first" name="first" placeholder="Jane" className={fieldClass} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <label htmlFor="f-last" className={labelClass}>
                    last name
                  </label>
                  <Input id="f-last" name="last" placeholder="Doe" className={fieldClass} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="f-email" className={labelClass}>
                  email
                </label>
                <Input
                  id="f-email"
                  name="email"
                  type="email"
                  required
                  placeholder="jane@studio.com"
                  className={fieldClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="f-message" className={labelClass}>
                  message
                </label>
                <Textarea
                  id="f-message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Tell me about your project…"
                  className={`min-h-[104px] rounded-[var(--radius-sm)] border-[var(--border-strong)] bg-[var(--surface-card)] px-3 py-[11px] text-sm leading-[1.5] text-[var(--text-strong)] focus-visible:border-[var(--accent)]`}
                />
              </div>
              {error && (
                <p
                  role="alert"
                  className="font-mono text-[12px] leading-[1.5]"
                  style={{ color: "var(--negative)" }}
                >
                  {error}
                </p>
              )}
              <div className="mt-1.5 flex items-center gap-3.5">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-[52px] rounded-[var(--radius-sm)] px-7 text-base font-semibold hover:bg-[var(--accent-hover)]"
                >
                  {submitting ? "sending…" : "send message"}
                </Button>
                <SheetClose asChild>
                  <button
                    type="button"
                    className="cursor-pointer border-0 bg-transparent font-mono text-[13px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    cancel
                  </button>
                </SheetClose>
              </div>
            </form>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
