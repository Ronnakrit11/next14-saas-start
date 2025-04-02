import { UserRole } from "@prisma/client";
import { SidebarNavItem } from "types";

export const projectSidebarLinks: SidebarNavItem[] = [
  {
    title: "PROJECT MENU",
    items: [
      { 
        href: "/overview", 
        icon: "dashboard", 
        title: "Overview",
        authorizeOnly: UserRole.USER, // Only show for USER role
      },
      {
        href: "/affiliate",
        icon: "user",
        title: "Affiliate Users",
        authorizeOnly: UserRole.USER, // Only show for USER role
      },
      {
        href: "/income",
        icon: "lineChart",
        title: "Income Dashboard",
        authorizeOnly: UserRole.USER, // Only show for USER role
      },
      {
        href: "/deals",
        icon: "billing",
        title: "Deals",
        authorizeOnly: UserRole.USER, // Only show for USER role
      },
      {
        href: "/analytics",
        icon: "lineChart",
        title: "Analytics",
        authorizeOnly: UserRole.USER, // Only show for USER role
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
        title: "Project Settings",
        authorizeOnly: UserRole.USER, // Only show for USER role
      },
      {
        href: "/products",
        icon: "package",
        title: "Products",
        authorizeOnly: UserRole.USER, // Only show for USER role
      },
      {
        href: "/members",
        icon: "user",
        title: "Team Members",
        authorizeOnly: UserRole.USER, // Only show for USER role
      },
      {
        href: "/support",
        icon: "messages",
        title: "Support",
        authorizeOnly: UserRole.USER, // Only show for USER role
      },
    ],
  },
];