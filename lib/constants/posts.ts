export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  tags: string[]
}

export const POSTS: Post[] = [
  {
    id: "1",
    slug: "building-scalable-ml-pipelines",
    title: "Building Scalable ML Pipelines with Apache Spark",
    excerpt:
      "A comprehensive guide to designing and implementing machine learning pipelines that can handle millions of data points efficiently.",
    date: "2024-11-15",
    readTime: "12 min read",
    tags: ["MACHINE LEARNING", "APACHE SPARK", "PYTHON"],
  },
  {
    id: "2",
    slug: "next-js-15-deep-dive",
    title: "Next.js 15: A Deep Dive into Server Components",
    excerpt:
      "Exploring the new features in Next.js 15 and how server components change the way we build React applications.",
    date: "2024-10-28",
    readTime: "8 min read",
    tags: ["NEXT.JS", "REACT", "WEB DEVELOPMENT"],
  },
  {
    id: "3",
    slug: "rust-for-web-developers",
    title: "Rust for Web Developers: A Practical Introduction",
    excerpt: "Why Rust is becoming essential for web developers and how to get started with systems programming.",
    date: "2024-09-12",
    readTime: "15 min read",
    tags: ["RUST", "SYSTEMS PROGRAMMING", "WEB ASSEMBLY"],
  },
  {
    id: "4",
    slug: "designing-resilient-microservices",
    title: "Designing Resilient Microservices Architecture",
    excerpt: "Best practices for building fault-tolerant distributed systems that scale with your business needs.",
    date: "2024-08-05",
    readTime: "10 min read",
    tags: ["MICROSERVICES", "KUBERNETES", "ARCHITECTURE"],
  },
  {
    id: "5",
    slug: "ai-ethics-in-production",
    title: "AI Ethics in Production: Lessons Learned",
    excerpt:
      "Real-world experiences implementing ethical AI guidelines in production systems and the challenges we faced.",
    date: "2024-07-20",
    readTime: "7 min read",
    tags: ["AI", "ETHICS", "PRODUCTION"],
  },
]
