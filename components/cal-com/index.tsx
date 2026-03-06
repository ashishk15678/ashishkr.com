"use client";
import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
export default function CalComponent() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "30min" });
      cal("floatingButton", {
        calLink: "ashish15678/30min",
        config: { layout: "week_view", useSlotsViewOnSmallScreen: "true" },
        buttonColor: "#3de600",
        buttonTextColor: "#000000",
      });
      cal("ui", { hideEventTypeDetails: false, layout: "week_view" });
    })();
  }, []);
  return <></>;
}
