"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Mail, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { num: "01", label: "About",      href: "#about"      },
  { num: "02", label: "Experience", href: "#experience" },
  { num: "03", label: "Projects",   href: "#projects"   },
  { num: "04", label: "Skills",     href: "#skills"     },
];

type Social = { id: string; platform: string; url: string };

export function MobileNav({ socials }: { socials: Social[] }) {
  const [open, setOpen] = useState(false);

  // Auto-close when the viewport widens to the md breakpoint (≥ 768px)
  // so the sheet never lingers behind the now-visible desktop nav.
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="flex flex-col gap-1.5 md:hidden" aria-label="Menu">
          <span className="block h-0.5 w-6 bg-text-primary" />
          <span className="block h-0.5 w-6 bg-text-primary" />
          <span className="block h-0.5 w-6 bg-text-primary" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full max-w-none gap-0 border-none bg-bg-dark p-0 sm:max-w-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-light px-6 py-4">
          <SheetTitle className="font-mono text-base font-bold text-text-primary">
            ry.bealey
          </SheetTitle>
          <SheetClose asChild>
            <button aria-label="Close menu">
              <X className="h-6 w-6 text-text-primary" />
            </button>
          </SheetClose>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col px-6 py-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between border-b border-border-dark py-5 first:border-t transition-colors"
            >
              <span className="font-mono text-xs text-text-muted">{item.num}</span>
              <span className="text-2xl font-semibold text-text-primary">{item.label}</span>
              <ArrowRight className="h-5 w-5 text-text-muted" />
            </a>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="mt-auto flex flex-col gap-8 px-6 pb-8 pt-4">
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 bg-brand px-6 py-4 text-bg-dark"
          >
            <Mail className="h-[18px] w-[18px]" />
            <span className="font-mono text-sm font-semibold">Contact Me</span>
          </a>

          {socials.length > 0 && (
            <div className="flex justify-center gap-8">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs font-medium text-text-muted transition-colors hover:text-brand"
                >
                  {social.platform}
                </a>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
