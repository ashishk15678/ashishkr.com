export interface Project {
  id: string;
  number: string;
  slug?: string;
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
    id: "cli-agent",
    number: "00",
    slug: "cli-agent",
    year: "2026",
    title: "Claude Code C",
    tags: ["C", "C23", "LIBCURL", "CJSON", "CLI"],
    description:
      "An advanced, terminal-based AI coding assistant written in C featuring a complete multi-turn agent loop, interactive REPL, and automated tool execution.",
    longDescription:
      "Claude Code C is a terminal-based AI coding assistant written in C using the C23 standard. Inspired by Anthropic's Claude Code, it features a complete multi-turn agent loop, interactive REPL, an automated tool execution system, and multi-provider compatibility (supporting OpenAI, Anthropic, Gemini, Groq, Ollama, OpenRouter). It translates payloads transparently between standard formats under the hood.",
    architecture:
      "REPL Interface -> Adaptor Layer -> Provider API (Anthropic/Gemini/OpenAI) -> Local Exec (bash / files)",
    images: [
      "/cli-agent/cli_agent_mockup.png"
    ],
    github: "https://github.com/ashishk15678/cli-agent",
  },
  {
    id: "llm-logger",
    number: "01",
    slug: "llm-logger",
    year: "2026",
    title: "LLM Logger & SDK",
    tags: ["NEXT.JS 15", "TYPESCRIPT", "PRISMA", "BUN", "SQLITE"],
    description:
      "A comprehensive self-hosted platform designed to capture, log, monitor, and analyze LLM inference activity in real-time with an event-driven SDK.",
    longDescription:
      "LLM Logger is a comprehensive self-hosted platform designed to capture, log, monitor, and analyze LLM inference activity in real-time. It features a Next.js 16 dashboard UI, a SQLite/Prisma database engine, and an event-driven client-side SDK that supports streaming chat completions, session-based user authentication, conversation CRUD operations, and network telemetry logging.",
    architecture:
      "Client App -> LLMLoggerSDK -> Next.js Backend -> Prisma/SQLite & LLM APIs (Groq/OpenAI)",
    images: [
      "/llm-logger/llm_logger_mockup.png"
    ],
    github: "https://github.com/ashishk15678/chat-ai-hiring-assignment",
  },
  {
    id: "design-tweak",
    number: "02",
    slug: "design-tweak",
    year: "2025",
    endYear: "PRESENT",
    title: "Design Tweak",
    tags: ["NEXT.JS", "REACT", "TAILWIND CSS"],
    description:
      "Tweak your designs with a single click, play with colors, fonts, and designs, and copy code snippets instantly.",
    longDescription:
      "Design Tweak is an interactive browser tool designed to let developers and designers play with website properties on the fly. Change fonts, layouts, color themes, and export clean CSS, Tailwind config, or JSX snippets in real-time.",
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
    id: "zon3",
    number: "03",
    slug: "zon3",
    year: "2025",
    endYear: "PRESENT",
    title: "zon3.xyz",
    tags: ["NEXT.JS", "REACT", "TRPC", "POSTGRESQL"],
    description:
      "A visual workflow automation platform inspired by n8n. Connect nodes and build micro-workflows interactively.",
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
    id: "docker-clone",
    number: "04",
    slug: "docker-clone",
    year: "2025",
    title: "Docker clone",
    tags: ["C", "LINUX"],
    description:
      "A containerization system built from scratch in C, implementing core Linux kernel process isolation features.",
    longDescription:
      "A containerization system built from scratch in C, implementing core Linux kernel features like namespaces, cgroups, and chroot. This project demonstrates deep understanding of process isolation, resource management, and Unix system programming.",
    architecture:
      "CLI Interface → Container Runtime → Linux Kernel (namespaces, cgroups, chroot)",
    github: "https://github.com/ashishk15678/docker-clone",
  },
  {
    id: "sharedcn",
    number: "05",
    slug: "sharedcn",
    year: "2025",
    title: "SharedCN",
    tags: ["NEXT.JS 15", "REACT", "NODEJS", "CLI"],
    description:
      "A component sharing platform that lets developers share and install React components and setups via command line.",
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
  {
    id: "cex",
    number: "06",
    slug: "cex",
    year: "2025",
    title: "CEX matching engine",
    tags: ["C", "LINUX"],
    description:
      "A high-performance centralized cryptocurrency exchange order matching engine written in C.",
    longDescription:
      "A low-level, high-performance centralized cryptocurrency exchange matching engine built entirely in C. Focuses on fast order matching and efficient memory management.",
    github: "https://github.com/ashishk15678/cex",
  },
  {
    id: "cms",
    number: "07",
    slug: "cms",
    year: "2025",
    title: "Modern CMS",
    tags: ["NEXT.JS", "REACT", "TYPESCRIPT", "TAILWIND CSS"],
    description:
      "A headless content management system tailored for modern web applications.",
    longDescription:
      "A fully-featured headless Content Management System that allows users to create, manage, and publish content seamlessly across various platforms.",
    github: "https://github.com/ashishk15678/cms",
  },
  {
    id: "reddit-lite",
    number: "08",
    slug: "reddit-lite",
    year: "2025",
    title: "Reddit Lite",
    tags: ["PHP", "XAMPP", "HTML", "CSS"],
    description:
      "A lightweight Reddit clone made using raw PHP, HTML, CSS, and XAMPP.",
    github: "https://github.com/ashishk15678/reddit-lite",
  },
  {
    id: "securevault",
    number: "09",
    slug: "java-encryption",
    year: "2025",
    title: "SecureVault Encryption",
    tags: ["JAVA", "SWING UI"],
    description:
      "A desktop cryptography vault application built in Java Swing for encrypting files and credentials.",
    github: "https://github.com/ashishk15678/securevault",
  },
];
