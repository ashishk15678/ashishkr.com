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
    year: "2024",
    endYear: "PRESENT",
    title: "NeuroSync",
    tags: ["NEXT.JS", "PYTHON", "TENSORFLOW", "OPENAI"],
    description:
      "AI-powered mental health companion. Built real-time mood analysis using facial recognition and NLP to provide personalized wellness recommendations.",
    link: "https://neurosync.app",
  },
  {
    id: "2",
    number: "02",
    year: "2024",
    title: "CodePilot AI",
    tags: ["NEXT.JS 15", "SUPABASE", "GEMINI", "RUST"],
    description:
      "Intelligent code review assistant. Analyzes PRs with context-aware suggestions and automated refactoring recommendations.",
    link: "https://codepilot.dev",
  },
  {
    id: "3",
    number: "03",
    year: "2024",
    title: "DataForge",
    tags: ["FASTAPI", "REACT", "APACHE SPARK"],
    description:
      "Enterprise data pipeline builder with drag-and-drop interface. Processes millions of records with real-time monitoring dashboards.",
    link: "https://dataforge.io",
  },
  {
    id: "4",
    number: "04",
    year: "2023",
    title: "EcoTrack",
    tags: ["REACT NATIVE", "NODE.JS", "MONGODB"],
    description:
      "Carbon footprint tracking app for individuals and businesses. Uses ML to suggest actionable sustainability improvements.",
    link: "https://ecotrack.green",
  },
  {
    id: "5",
    number: "05",
    year: "2023",
    title: "MediChain",
    tags: ["SOLIDITY", "REACT", "IPFS"],
    description:
      "Blockchain-based medical records management. Ensures patient data privacy with decentralized storage and smart contract access control.",
    link: "https://medichain.health",
  },
];
