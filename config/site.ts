import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "Profitsight",
  description: "FairFlows - ตัวกลางการจ้างงานที่ปลอดภัย ทั้งผู้จ้างเเละผู้รับจ้าง ด้วยระบบ Escrow ที่มีความน่าเชื่อถือ",
  url: site_url,
  ogImage: "https://www.fairflows.io/og.jpg",
  links: {
    twitter: "https://twitter.com/",
    github: "https://github.com/",
  },
  mailSupport: "info@expert8-solution.com",
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Company",
    items: [
      { title: "About", href: "#" },
      { title: "Enterprise", href: "#" },
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Product",
    items: [
      { title: "Security", href: "#" },
      { title: "Customization", href: "#" },
      { title: "Customers", href: "#" },
      { title: "Changelog", href: "#" },
    ],
  },
];