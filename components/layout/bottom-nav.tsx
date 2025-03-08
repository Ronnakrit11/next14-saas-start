"use client";

import { Bell, Home, HelpCircle, Settings, User } from "lucide-react";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";

export function BottomNav() {
  const tabs = [
    { title: "Home", icon: Home },
    { title: "Manage", icon: User },
    { type: "separator" as const },
    { title: "Notifications", icon: Bell },
    { title: "Settings", icon: Settings },
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