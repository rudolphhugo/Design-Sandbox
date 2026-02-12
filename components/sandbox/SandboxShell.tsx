"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { components } from "@/lib/registry";

export function SandboxShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Derive active tab from URL
  const deriveTab = (): "components" | "layouts" => {
    if (pathname.startsWith("/layouts")) return "layouts";
    return "components";
  };

  const [activeTab, setActiveTab] = useState<"components" | "layouts">(deriveTab);

  const handleTabChange = (tab: "components" | "layouts") => {
    setActiveTab(tab);
    if (tab === "components" && components.length > 0) {
      router.push(`/components/${components[0].slug}`);
    } else if (tab === "layouts") {
      router.push("/layouts");
    }
  };

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
