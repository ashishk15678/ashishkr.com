export interface Project {
  id: string;
  number: string;
  year: string;
  endYear?: string;
  title: string;
  tags: string[];
  description: string;
  link?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "1",
    number: "01",
    year: "2025",
    endYear: "PRESENT",
    title: "zon3.xyz",
    tags: ["NEXT.JS", "REACT", "TRPC", "POSTGRES"],
    description:
      "A small app which is n8n alike , can be used to connect nodes and for normal use cases. Very few nodes.",
    link: "https://zon3.xyz",
  },
  {
    id: "2",
    number: "02",
    year: "2025",
    title: "Docker clone",
    tags: ["C", "Linux"],
    description:
      "A simple docker clone written in C and Linux. It was part of college's minor project , also major in future.",
  },
  {
    id: "3",
    number: "03",
    year: "2025",
    title: "SharedCN",
    tags: ["NEXT.JS 15", "REACT", "NODE", "CLI"],
    description:
      "A simple app to share your components and setups at one place , primarily used by nobody , around 10 users.",
    link: "https://sharedcn.vercel.app",
  },
  {
    id: "4",
    number: "04",
    year: "2025",
    title: "Switch",
    tags: ["NEXTJS", "REACT"],
    description:
      "A simple app to switch between different environments and configurations.",
    link: "https://github.com/ashishk15678/switch",
  },
  {
    id: "5",
    number: "05",
    year: "2024",
    title: "Discord clone",
    tags: ["NEXTJS", "REACT"],
    description: "A simple discord clone.",
    link: "https://github.com/ashishk15678/dscord-clone",
  },
];
