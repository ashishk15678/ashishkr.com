"use client";

import { Header } from "@/components/header";

export default function ErrorPage() {
  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden font-mono">
      <Header />
      <div className="w-1/2 h-full flex flex-col items-center justify-center border-r border-green-900 bg-background p-4">
        <h1 className="text-green-500 text-xs mb-4 tracking-tighter opacity-50 uppercase">
          Error
        </h1>
        <p className="text-white text-sm mb-4">
          An error occurred while loading the page.
        </p>
      </div>{" "}
    </div>
  );
}
