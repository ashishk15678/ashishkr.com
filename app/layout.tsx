import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Suspense } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import CalComponent from "@/components/cal-com";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ashish Kumar | Full-stack & ML Engineer",
  description:
    "Full-stack Engineer turning complex problems into elegant solutions. Building scalable systems and intelligent applications.",
  generator: "myself",
  icons: {
    icon: [
      {
        url: "https://avatars.githubusercontent.com/u/147980956?v=4",
        media: "https://avatars.githubusercontent.com/u/147980956?v=4",
      },
    ],
  },
};

function GlobalLoading() {
  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center animate-pulse ">
        Loading the portfolio ...
      </div>
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <header>
        <link
          rel="icon"
          href="https://avatars.githubusercontent.com/u/147980956?v=4"
        />
      </header>
      <body className={`font-sans antialiased ${inter.className}`}>
        <Suspense fallback={<GlobalLoading />}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Analytics />
            <CalComponent />
          </ThemeProvider>
        </Suspense>
      </body>
      {/*Cloudflare */}
      <script
        defer
        src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token": "10955f53d5ee4f5880bcbf7725c1febc"}'
      ></script>
      {/*GTAG */}
      <GoogleAnalytics gaId="G-WKMVNETJP0" />
    </html>
  );
}
