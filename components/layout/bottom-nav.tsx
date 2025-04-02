"use client";

import { Bell, Home, HelpCircle, Settings, User } from "lucide-react";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { useSession } from "next-auth/react";

export function BottomNav() {
  const { data: session } = useSession();
  
  // Don't show dashboard link for affiliate users
  const showDashboard = !session?.user || session?.user.role !== "AFFILIATE";
  
  // Determine dashboard link based on user role
  const dashboardLink = session?.user?.role === "AFFILIATE" 
    ? "/dashboard" // This will be redirected to commissions page by the layout
    : "/dashboard";
  
  const tabs = [
    { title: "Home", icon: Home, href: "/" },
    ...(showDashboard ? [{ title: "Manage", icon: User, href: dashboardLink }] : []),
    { type: "separator" as const },
    { title: "Notifications", icon: Bell },
    { title: "Settings", icon: Settings, href: "/dashboard/settings" },
    { title: "Help", icon: HelpCircle },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 px-4">
      <div className="mx-auto w-fit">
        <ExpandableTabs 
          tabs={tabs} 
          className="max-w-[95vw] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px]"
        />
      </div>
    </div>
  );
}