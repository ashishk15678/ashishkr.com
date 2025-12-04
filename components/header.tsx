"use client";

import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants/site";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MagneticButton } from "./magnetic-button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-12 lg:px-20 py-4 md:py-6 flex items-center justify-between bg-background/80 backdrop-blur-sm">
      <MagneticButton as="div" strength={0.2}>
        <Link
          href="/"
          className="font-bold text-base md:text-lg tracking-tight hover:opacity-70 transition-opacity"
        >
          {SITE_CONFIG.name}
        </Link>
      </MagneticButton>

      {/* Desktop navigation */}
      <nav className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <MagneticButton key={link.href} as="div" strength={0.3}>
            <Link
              href={link.href}
              className={`relative text-sm tracking-wide transition-colors ${
                pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.name}
              {pathname === link.href && (
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-foreground animate-in fade-in slide-in-from-left duration-300" />
              )}
            </Link>
          </MagneticButton>
        ))}
      </nav>

      {/* Mobile menu button */}
      <button
        className="md:hidden p-2 -mr-2 hover:bg-muted rounded-lg transition-colors"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile navigation overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[60px] bg-background z-40 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col p-6 gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-2xl font-medium py-4 border-b border-border transition-colors ${
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
