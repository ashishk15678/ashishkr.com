"use client";
import { InlineWidget } from "react-calendly";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export default function CalComponent() {
  const router = useRouter();
  return (
    <>
      <div className="w-full h-full">
        <div className="">
          <Button
            onClick={() => {
              router.push("/#calendar-booking");
            }}
            className="fixed bottom-2 right-2 bg-primary shadow-sm shadow-primary p-4 px-6 rounded-md text-secondary text-lg"
          >
            Book calendar
          </Button>
        </div>
        <section id="calendar-booking" data-scroll-behavior="smooth">
          <InlineWidget
            id="calendar-booking"
            url="https://calendly.com/15678ashish/book"
            styles={{
              height: "700px",
            }}
          />
        </section>
      </div>
    </>
  );
}
