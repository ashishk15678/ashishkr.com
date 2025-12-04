export interface Research {
  id: string;
  paperId: string;
  title: string;
  abstract: string;
  role: string;
  context: string;
  link?: string;
  year: string;
}

export const RESEARCH_PAPERS: Research[] = [
  {
    id: "1",
    paperId: "IEEE-2024-0847",
    title: "Optimizing Neural Network Inference on Edge Devices",
    abstract:
      "Proposed a novel quantization technique that reduces model size by 75% while maintaining 98% accuracy for real-time inference on IoT devices.",
    role: "Lead Author / Researcher",
    context: "IEEE Conference / Research Paper",
    link: "https://ieee.org/paper/2024-0847",
    year: "2024",
  },
  {
    id: "2",
    paperId: "ACM-2024-1293",
    title: "Federated Learning for Privacy-Preserving Healthcare Analytics",
    abstract:
      "Developed a federated learning framework enabling hospitals to collaboratively train ML models without sharing sensitive patient data.",
    role: "Co-Author / Researcher",
    context: "ACM SIGKDD / Research Paper",
    link: "https://acm.org/paper/2024-1293",
    year: "2024",
  },
  {
    id: "3",
    paperId: "ARXIV-2023-5621",
    title: "Attention Mechanisms for Multi-Modal Data Fusion",
    abstract:
      "Introduced a cross-attention architecture for combining visual, textual, and audio inputs in real-time classification tasks.",
    role: "Co-Author / Researcher",
    context: "ArXiv Preprint / Research Paper",
    link: "https://arxiv.org/abs/2023.5621",
    year: "2023",
  },
  {
    id: "4",
    paperId: "MTech-THESIS-2022",
    title:
      "Distributed Genetic Algorithms for Resource Allocation in Cloud Computing",
    abstract:
      "Proposed a Differential Evolution Genetic Algorithm with chaotic mapping and asynchronous communication to optimize complex scheduling problems in cloud environments.",
    role: "Author / Researcher",
    context: "M.Tech Thesis / IIT Delhi",
    link: "https://repository.iitd.ac.in/thesis/2022",
    year: "2022",
  },
];
