"use client";

import {
  AppleDashboard,
  ClerkDashboard,
  TerminalDashboard,
} from "@/components/dashboards";
import { Header } from "@/components/header";

export default function App() {
  return (
    <>
      {/*<TerminalDashboard />*/}
      {/*<div id="cms-embed"></div>
      <script
        src="http://localhost:3000/embed.js"
        data-target="cms-embed"
        data-mode="list"
      ></script>*/}

      <div id="cms-embed"></div>
      <script
        src="http://localhost:3000/embed.js"
        data-target="cms-embed"
        data-mode="single"
      ></script>
    </>
  );
}
