"use client";

import { Layers, LayoutTemplate } from "lucide-react";

interface BottomNavProps {
  activeTab: "components" | "layouts";
  onTabChange: (tab: "components" | "layouts") => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
      <nav className="pointer-events-auto flex items-center gap-1 rounded-2xl border border-border/50 bg-background/80 px-2 py-2 shadow-lg backdrop-blur-xl max-w-[1440px] w-full justify-center">
        <button
          onClick={() => onTabChange("components")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "components"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
        >
          <Layers className="h-4 w-4" />
          Components
        </button>
        <button
          onClick={() => onTabChange("layouts")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "layouts"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
        >
          <LayoutTemplate className="h-4 w-4" />
          Layouts
        </button>
      </nav>
    </div>
  );
}
