"use client";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden font-mono">
      <Header />
      <div className="w-full h-full overflow-y-auto p-8 bg-background flex flex-col items-center justify-center gap-4">
        <div>
          <h2 className="text-primary text-xl mb-4 border-b border-green-900/30 pb-2">
            Error Details
          </h2>

          <p className="text-3xl">
            The page you are looking for does not exist.
          </p>
          <Link href={"/"} className="">
            <Button size={"lg"} className="w-full mt-8">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
