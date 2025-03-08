import { MetadataRoute } from "next";
import { allPosts } from "contentlayer/generated";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = allPosts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slugAsParams}`,
    lastModified: new Date(post.date),
  }));

  const routes = [
    "",
    "/blog",
    "/pricing",
    "/privacy",
    "/terms",
    "/login",
    "/register",
    "/docs",
    "/guides",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...blogs];
}