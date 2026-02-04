export interface Project {
  id: string;
  number: string;
  year: string;
  endYear?: string;
  title: string;
  tags: string[];
  description: string;
  longDescription?: string;
  architecture?: string;
  images?: string[];
  graphs?: { label: string; value: number }[];
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
    longDescription:
      "Zon3 is a visual workflow automation platform inspired by n8n. It allows users to create custom workflows by connecting nodes in a visual editor. Built with Next.js and React for the frontend, with tRPC providing type-safe API communication and PostgreSQL as the database backend.",
    architecture: "Frontend (Next.js + React) → tRPC API Layer → PostgreSQL Database",
    graphs: [
      { label: "Nodes", value: 12 },
      { label: "Connections", value: 8 },
      { label: "Workflows", value: 5 },
    ],
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
    longDescription:
      "A containerization system built from scratch in C, implementing core Linux kernel features like namespaces, cgroups, and chroot. This project demonstrates deep understanding of process isolation, resource management, and Unix system programming.",
    architecture: "CLI Interface → Container Runtime → Linux Kernel (namespaces, cgroups, chroot)",
  },
  {
    id: "3",
    number: "03",
    year: "2025",
    title: "SharedCN",
    tags: ["NEXT.JS 15", "REACT", "NODE", "CLI"],
    description:
      "A simple app to share your components and setups at one place , primarily used by nobody , around 10 users.",
    longDescription:
      "SharedCN is a component sharing platform that lets developers share React components and development setups. Features include a web interface for browsing components, a CLI for quick component installation, and GitHub integration for seamless publishing.",
    architecture: "Web App (Next.js 15) + CLI Tool (Node.js) → API Server → PostgreSQL + GitHub API",
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
    longDescription:
      "Switch is a developer utility for managing multiple environment configurations. Easily switch between development, staging, and production environments with a single click.",
    link: "https://github.com/ashishk15678/switch",
  },
  {
    id: "5",
    number: "05",
    year: "2024",
    title: "Discord clone",
    tags: ["NEXTJS", "REACT"],
    description: "A simple discord clone.",
    longDescription:
      "A full-featured Discord clone implementing real-time messaging, voice channels, server management, and user authentication. Built with Next.js and React, featuring WebSocket connections for real-time communication.",
    link: "https://github.com/ashishk15678/dscord-clone",
  },
];
