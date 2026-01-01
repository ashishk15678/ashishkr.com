import { Header } from "@/components/header";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const simulations = [
    {
      name: "Cube rotating in 3d",
      category: "Geometry",
      href: "/simulations/1",
      video: "/simulations/simulation1.mp4",
      image: "",
      date: "8h ago",
    },
    {
      name: "Boxes simulation",
      category: "Physics",
      href: "/simulations/2",
      video: "/simulations/simulation2.mp4",
      image: "",
      date: "9h ago",
    },
    {
      name: "Petri Dish",
      category: "Biology",
      href: "/simulations/3",
      video: "",
      image: "/simulations/simulation3.png",
      date: "1d ago",
    },
    {
      name: "Physarum (Slime Mold)",
      category: "Biology",
      href: "/simulations/4",
      video: "",
      image: "/simulations/simulation4.png",
      date: "2d ago",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen py-2 bg-background">
      <Header />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32">
        <div className="flex flex-col mb-8">
          <h1 className="text-xl md:text-3xl font-semibold">Simulations</h1>
          <p className="text-muted-foreground text-sm mt-2">
            {simulations.length} simulations found
          </p>
        </div>

        {/* Table Container */}
        <div className="border border-border rounded-lg overflow-hidden">
          {/* Table Header - Hidden on small mobile, 3 cols on medium, 4 on large */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 bg-muted/30 border-b border-border px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <div>Simulation / Name</div>
            <div className="hidden md:block">Category</div>
            <div className="hidden lg:block">Preview</div>
            <div className="text-right lg:text-left">Added</div>
          </div>

          <div className="divide-y divide-border">
            {simulations.map((s) => (
              <Link
                key={s.name}
                href={s.href}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center px-6 py-6 hover:bg-muted/50 transition-colors group"
              >
                {/* Column 1: Name & Info */}
                <div className="flex flex-col pr-4">
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {s.name}
                  </span>
                  <span className="text-xs text-muted-foreground md:hidden mt-1">
                    {s.category}
                  </span>
                </div>

                {/* Column 2: Category (Desktop/Tablet) */}
                <div className="hidden md:flex text-sm text-muted-foreground">
                  {s.category}
                </div>

                {/* Column 3: Visual Preview (Desktop only) */}
                <div className="hidden lg:flex">
                  <div className="relative w-32 h-20 rounded-md overflow-hidden bg-black border border-border">
                    {s.video ? (
                      <video
                        src={s.video}
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image
                        src={s.image}
                        alt={s.name}
                        fill
                        className="object-cover text-[10px]"
                      />
                    )}
                  </div>
                </div>

                {/* Column 4: Time/Action */}
                <div className="text-right lg:text-left text-sm text-muted-foreground">
                  {s.date}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
