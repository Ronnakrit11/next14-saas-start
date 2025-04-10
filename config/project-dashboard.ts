import { UserRole } from "@prisma/client";
import { SidebarNavItem } from "types";

export const projectSidebarLinks: SidebarNavItem[] = [
  {
    title: "PROJECT MENU",
    items: [
      { 
        href: "/overview", 
        icon: "dashboard", 
        title: "Overview" 
      },
      {
        href: "/affiliate",
        icon: "user",
        title: "Affiliate Users",
      },
      {
        href: "/income",
        icon: "lineChart",
        title: "Income Dashboard",
      },
      {
        href: "/deals",
        icon: "billing",
        title: "Deals",
      },
      {
        href: "/analytics",
        icon: "lineChart",
        title: "Analytics",
      },
      {
        href: "/commissions",
        icon: "banknote",
        title: "My Commissions",
        authorizeOnly: UserRole.AFFILIATE,
      },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      { 
        href: "/settings", 
        icon: "settings", 
        title: "Project Settings" 
      },
      {
        href: "/products",
        icon: "package",
        title: "Products",
      },
      {
        href: "/members",
        icon: "user",
        title: "Team Members",
      },
      {
        href: "/support",
        icon: "messages",
        title: "Support",
      },
    ],
  },
];