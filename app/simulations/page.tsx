import { Header } from "@/components/header";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const simulations = [
    {
      name: "Cube rotating in 3d",
      href: "/simulations/1",
      video: "/simulations/simulation1.mp4",
      image: "",
    },
    {
      name: "Boxes simulation",
      href: "/simulations/2",
      video: "/simulations/simulation2.mp4",
      image: "",
    },
    {
      name: "Petri Dish",
      href: "/simulations/3",
      video: "",
      image: "/simulations/simulation3.png",
    },
    {
      name: "Physarum (Slime Mold)",
      href: "/simulations/4",
      video: "",
      image: "/simulations/simulation4.png",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Header />
      <div className="grid grid-cols-2 gap-4 md:gap-8 md:max-w-3xl max-w-sm ">
        {simulations.map((s) => (
          <Link href={s.href} prefetch>
            <div
              key={s.name}
              className="px-8 py-4 ring ring-border rounded-xl shadow-sm overflow-hidden"
            >
              <div>{s.name}</div>
              {s.video.length > 0 && (
                <video
                  src={s.video}
                  autoPlay
                  loop
                  muted
                  controls={false}
                  className="max-w-sm"
                ></video>
              )}
              {s.image && (
                <Image
                  src={s.image}
                  alt={s.name}
                  className=""
                  width={300}
                  height={300}
                />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
