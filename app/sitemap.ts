import { POSTS } from "@/lib/constants/posts";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ashishkr.com";

  const posts = POSTS.map((slug) => ({
    url: `${baseUrl}/posts/${slug.title}`,
    lastModified: new Date(),
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${baseUrl}/designs`,
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: `${baseUrl}/simulations`,
      lastModified: new Date(),
      priority: 0.8,
    },
    ...posts,
  ];
}
