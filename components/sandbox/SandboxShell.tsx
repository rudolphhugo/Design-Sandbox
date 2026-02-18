"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { components, layouts, animations } from "@/lib/registry";

export type TabType = "components" | "layouts" | "animations";

export function SandboxShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const deriveTab = (): TabType => {
    if (pathname.startsWith("/layouts")) return "layouts";
    if (pathname.startsWith("/animations")) return "animations";
    return "components";
  };

  const [activeTab, setActiveTab] = useState<TabType>(deriveTab);

  const isLayoutPage = pathname.startsWith("/layouts");

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === "components" && components.length > 0) {
      router.push(`/components/${components[0].slug}`);
    } else if (tab === "layouts" && layouts.length > 0) {
      router.push(`/layouts/${layouts[0].slug}`);
    } else if (tab === "animations" && animations.length > 0) {
      router.push(`/animations/${animations[0].slug}`);
    } else {
      router.push(`/${tab}`);
    }
  };

  // Layout pages: full-screen, no sidebar, bottom nav only
  if (isLayoutPage) {
    return (
      <div className="min-h-screen">
        <main className="pb-24">{children}</main>
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    );
  }

  // Component pages: sidebar + bottom nav
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeTab={activeTab} />
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="p-8 max-w-[1440px] mx-auto">{children}</div>
      </main>
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
