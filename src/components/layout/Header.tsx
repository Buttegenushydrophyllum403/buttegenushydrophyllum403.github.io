"use client";

import { Menu, MessageSquareText, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatButton } from "@/components/chat/ChatButton";
import type { SiteCopy } from "@/content";
import { cn } from "@/lib/utils";
import { SoundToggle } from "./SoundToggle";
import { ThemeToggle } from "./ThemeToggle";


export function Header({
  name,
  version,
  nav,
  copy,
  themeCopy,
}: {
  name: string;
  version: string;
  nav: SiteCopy["nav"];
  copy: SiteCopy["header"];
  themeCopy: SiteCopy["theme"];
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile menu after navigating.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-text bg-bg/90 backdrop-blur-sm">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-baseline gap-2" aria-label={`${name}, home`}>
          <span className="font-hand text-2xl font-bold transition-transform group-hover:-rotate-2">{name}</span>
          <span className="font-mono text-[0.68rem] text-muted" title={copy.versionTitle}>
            v{version}
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = !item.href.startsWith("/#") && pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "px-3 py-2 text-[0.95rem] font-medium underline-offset-[6px] transition-colors hover:text-primary hover:underline hover:decoration-wavy hover:decoration-primary",
                  active && "text-primary underline decoration-wavy decoration-primary",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <ChatButton className="ml-2 inline-flex items-center gap-1.5 border-2 border-text px-3 py-1.5 text-[0.95rem] font-semibold transition-shadow hover:shadow-[3px_3px_0_var(--primary)]">
            <MessageSquareText size={16} className="text-primary" aria-hidden />
            {copy.twinButton}
          </ChatButton>
        </nav>

        <div className="flex items-center gap-0.5">
          <SoundToggle />
          <ThemeToggle copy={themeCopy} />
          <button
            type="button"
            className="grid size-10 place-items-center hover:bg-surface-2 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-dashed border-border bg-bg md:hidden"
          >
            <ul className="container-page flex flex-col gap-1 py-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={() => setMenuOpen(false)} className="block px-3 py-3 font-display text-xl hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <ChatButton className="flex w-full items-center gap-2 px-3 py-3 text-left font-display text-xl text-primary">
                  <MessageSquareText size={20} aria-hidden /> {copy.mobileTwinButton}
                </ChatButton>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
