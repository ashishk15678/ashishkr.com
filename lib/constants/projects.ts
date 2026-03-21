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
  github?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "0",
    number: "00",
    year: "2025",
    endYear: "PRESENT",
    title: "Design Tweak",
    tags: ["NEXT.JS", "REACT", "TAWILWINDCSS"],
    description:
      "Tweak your designs with a single click , play with colors , fonts and designs , and then just click copy.",
    longDescription:
      "Zon3 is a visual workflow automation platform inspired by n8n. It allows users to create custom workflows by connecting nodes in a visual editor. Built with Next.js and React for the frontend, with tRPC providing type-safe API communication and PostgreSQL as the database backend.",
    link: "https://tweak.ashishkr.com?ref=ashishkr.com",
    images: [
      "/tweak/dashboard.png",
      "/tweak/export.png",
      "/tweak/mail.png",
      "/tweak/mail_neo.png",
      "/tweak/mail_glass.png",
    ],
    github: "https://github.com/ashishk15678/tweak",
  },
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
    architecture:
      "Frontend (Next.js + React) → tRPC API Layer → PostgreSQL Database",
    graphs: [
      { label: "Nodes", value: 12 },
      { label: "Connections", value: 8 },
      { label: "Workflows", value: 5 },
    ],
    link: "https://zon3.xyz",
    images: [
      "/zon3/nodes_dialog.png",
      "/zon3/nodes.png",
      "/zon3/premium.png",
      "/zon3/blank_screen.png",
      "/zon3/login.png",
    ],
    github: "https://github.com/ashishk15678/n8n-web3",
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
    architecture:
      "CLI Interface → Container Runtime → Linux Kernel (namespaces, cgroups, chroot)",
    github: "https://github.com/ashishk15678/docker-clone",
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
    architecture:
      "Web App (Next.js 15) + CLI Tool (Node.js) → API Server → PostgreSQL + GitHub API",
    link: "https://sharedcn.vercel.app",
    images: [
      "/sharedcn/dash_dark_mode.png",
      "/sharedcn/sharedcn_dash.png",
      "/sharedcn/sharedcn_landing.png",
      "/sharedcn/sharedcn_login.png",
      "/sharedcn/sharedcn_new.png",
      "/sharedcn/sharedcn_new_2.png",
    ],
    github: "https://github.com/ashishk15678/sharedcn",
  },
];
