"use client";

import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants/site";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MagneticButton } from "./magnetic-button";
import { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const [name, setName] = useState(SITE_CONFIG.name);

  // const showHeaderName = new IntersectionObserver(
  //   () => {
  //     setName("Portfolio");
  //   },
  //   {
  //     root: document.querySelector("header-name"),
  //     rootMargin: "0px",
  //     threshold: 1.0,
  //   },
  // );
  // showHeaderName.observe(document.body);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-12 lg:px-20 py-4 md:py-6 flex items-center justify-between bg-background/80 backdrop-blur-sm">
      <MagneticButton as="div" strength={0.2}>
        <Link
          href="/"
          className="font-bold text-base md:text-lg tracking-tight hover:opacity-70 transition-opacity"
        >
          {name}
        </Link>
      </MagneticButton>

      {/* Desktop navigation */}
      <nav className="hidden md:flex items-center gap-6">
        {NAV_LINKS.map((link) => (
          <MagneticButton key={link.href} as="div" strength={0.3}>
            <Link
              href={link.href}
              className={`relative text-sm tracking-wide transition-colors ${
                pathname === link.href
                  ? "text-foreground underline underline-offset-4"
                  : "text-muted-foreground hover:text-foreground"
              }
              ${link.name == "Designs" && "rainbow-text"}
              `}
            >
              {link.name}
            </Link>
          </MagneticButton>
        ))}

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
      </nav>

      {/* Mobile controls */}
      <div className="flex items-center gap-2 md:hidden">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>

        <button
          className="p-2 -mr-2 hover:bg-muted rounded-lg transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile navigation overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[60px] z-40 md:hidden  animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col p-6  bg-background/80">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-2xl font-medium py-4 border-b backdrop-blur-2xl border-border transition-colors ${
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
