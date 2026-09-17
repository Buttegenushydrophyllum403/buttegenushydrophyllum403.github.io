"use client";

import { Bot, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatButton } from "@/components/chat/ChatButton";
import { Boop } from "@/components/effects/Boop";
import { cn } from "@/lib/utils";
import { SoundToggle } from "./SoundToggle";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/projects", label: "Projects" },
  { href: "/#journey", label: "Journey" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
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
    <header className="sticky top-0 z-40 border-b border-border/60 bg-bg/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-2.5 font-display text-lg font-bold" aria-label="Rifat Sarwar, home">
          <Boop rotation={-12} scale={1.08} sound="pop">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-gold-bright font-mono text-sm font-bold text-white shadow-card">
              RS
            </span>
          </Boop>
          <span className="hidden sm:inline">Rifat Sarwar</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = item.href !== "/#journey" && pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-[0.95rem] font-medium transition-colors hover:bg-surface-2",
                  active ? "text-primary" : "text-text",
                )}
              >
                <Boop y={-2} timing={120}>
                  {item.label}
                </Boop>
              </Link>
            );
          })}
          <ChatButton className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-2 text-[0.95rem] font-semibold shadow-card transition-colors hover:border-primary">
            <Boop rotation={15} timing={150}>
              <Bot size={17} className="text-primary" aria-hidden />
            </Boop>
            AI twin
          </ChatButton>
        </nav>

        <div className="flex items-center gap-0.5">
          <SoundToggle />
          <ThemeToggle />
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full hover:bg-surface-2 md:hidden"
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
            className="overflow-hidden border-t border-border bg-bg md:hidden"
          >
            <ul className="container-page flex flex-col gap-1 py-3">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-3 text-lg font-medium hover:bg-surface-2">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <ChatButton className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-lg font-semibold text-primary hover:bg-surface-2">
                  <Bot size={20} aria-hidden /> Chat with my AI twin
                </ChatButton>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
