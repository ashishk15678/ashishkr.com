"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SignUpFormCardProps {
  className?: string;
  brandName?: string;
  onSignUp?: () => void;
}

export function SignUpFormCard({
  className,
  brandName = "DevStudio",
  onSignUp,
}: SignUpFormCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("w-full max-w-[340px]", className)}
    >
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-foreground flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-background" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              {brandName}
            </span>
          </div>
          <CardTitle className="text-lg">Sign up for an account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Full name
            </label>
            <Input
              placeholder="Manu Arora"
              readOnly
              className="pointer-events-none h-8 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Email address
            </label>
            <Input
              placeholder="hello@johndoe.com"
              readOnly
              className="pointer-events-none h-8 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Password
            </label>
            <Input
              type="password"
              value="••••••••••"
              readOnly
              className="pointer-events-none h-8 text-xs"
            />
          </div>
          <Button className="w-full h-8 text-xs" onClick={onSignUp}>
            Sign Up
          </Button>
          <p className="text-[10px] text-center text-muted-foreground">
            Already have an account?{" "}
            <span className="text-foreground font-medium cursor-pointer hover:underline">
              Sign in
            </span>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
