"use client";

import { Bell, Home, HelpCircle, Settings, User } from "lucide-react";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";

export function BottomNav() {
  const tabs = [
    { title: "Home", icon: Home },
    { title: "Profile", icon: User },
    { type: "separator" as const },
    { title: "Notifications", icon: Bell },
    { title: "Settings", icon: Settings },
    { title: "Help", icon: HelpCircle },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 px-4 md:hidden">
      <div className="mx-auto w-fit">
        <ExpandableTabs tabs={tabs} />
      </div>
    </div>
  );
}