import { Header } from "@/components/header";
import Link from "next/link";

export default function Page() {
  const simulations = [
    {
      name: "Predator-Prey",
      category: "Biology",
      href: "/simulations/7",
      description: "Lotka-Volterra ecosystem",
    },
    {
      name: "L-System Plant",
      category: "Biology",
      href: "/simulations/8",
      description: "Procedural plant growth",
    },
    {
      name: "Pendulum",
      category: "Physics",
      href: "/simulations/5",
      description: "Simple harmonic motion",
    },
    {
      name: "Wave Interference",
      category: "Physics",
      href: "/simulations/6",
      description: "Two-source wave patterns",
    },
    {
      name: "3D Cube",
      category: "Geometry",
      href: "/simulations/1",
      description: "Rotating wireframe projection",
    },
    {
      name: "Gravity Boxes",
      category: "Physics",
      href: "/simulations/2",
      description: "Orbital particle dynamics",
    },
    {
      name: "Petri Dish",
      category: "Biology",
      href: "/simulations/3",
      description: "Reaction-diffusion patterns",
    },
    {
      name: "Physarum",
      category: "Biology",
      href: "/simulations/4",
      description: "Slime mold transport networks",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen py-2 bg-background font-mono">
      <Header />

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32">
        <div className="flex flex-col mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
            // Simulations
          </h1>
          <p className="text-muted-foreground text-xs mt-2 opacity-60">
            {simulations.length} interactive experiments • Adjust parameters in real-time
          </p>
        </div>

        {/* Table Container with retro style */}
        <div className="border-2 border-dashed border-border overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-3 md:grid-cols-4 bg-muted/30 border-b-2 border-dashed border-border px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            <div>Name</div>
            <div className="hidden md:block">Category</div>
            <div>Description</div>
            <div className="text-right">Status</div>
          </div>

          <div className="divide-y divide-dashed divide-border">
            {simulations.map((s, index) => (
              <Link
                key={s.name}
                href={s.href}
                className="grid grid-cols-3 md:grid-cols-4 items-center px-4 py-4 hover:bg-muted/30 transition-colors group"
              >
                {/* Name */}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs font-mono">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-medium text-foreground group-hover:text-primary transition-colors text-sm">
                    {s.name}
                  </span>
                </div>

                {/* Category */}
                <div className="hidden md:block text-xs text-muted-foreground">
                  {s.category}
                </div>

                {/* Description */}
                <div className="text-xs text-muted-foreground/70 truncate pr-4">
                  {s.description}
                </div>

                {/* Status */}
                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-dashed border-border text-primary bg-primary/5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Interactive
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-[10px] text-muted-foreground/40 font-mono">
          // Click any simulation to explore • Use sliders to tweak parameters
        </div>
      </main>
    </div>
  );
}
