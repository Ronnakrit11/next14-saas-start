import { SidebarNavItem } from "types";

export const affiliateSidebarLinks: SidebarNavItem[] = [
  {
    title: "AFFILIATE MENU",
    items: [
      {
        href: "/commissions",
        icon: "banknote",
        title: "My Commissions",
      },
      {
        href: "/deals",
        icon: "billing",
        title: "Available Deals",
      },
      {
        href: "/payments",
        icon: "billing",
        title: "Payment History",
      },
      {
        href: "/referrals",
        icon: "user",
        title: "My Referrals",
      },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      {
        href: "/profile",
        icon: "user",
        title: "Profile Settings",
      },
      {
        href: "/support",
        icon: "messages",
        title: "Support",
      },
    ],
  },
];