import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Suspense } from "react";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

// <CHANGE> Updated metadata for Ashish Kumar portfolio
export const metadata: Metadata = {
  title: "Ashish Kumar | Full-stack & ML Engineer",
  description:
    "Full-stack & ML Engineer turning complex problems into elegant solutions. Building scalable systems and intelligent applications.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "https://avatars.githubusercontent.com/u/147980956?v=4",
        media: "https://avatars.githubusercontent.com/u/147980956?v=4",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Suspense fallback={<div>Loading...</div>}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Analytics />
          </ThemeProvider>
        </Suspense>
      </body>
      <script
        defer
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token": "10955f53d5ee4f5880bcbf7725c1febc"}'
      ></script>
    </html>
  );
}
