"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Layers, LayoutTemplate, ChevronDown, Sparkles } from "lucide-react";
import { layouts } from "@/lib/registry";
import type { TabType } from "./SandboxShell";

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSlug = pathname.split("/layouts/")[1] || "";
  const current = layouts.find((l) => l.slug === currentSlug);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
      <nav className="pointer-events-auto flex items-center gap-1 rounded-2xl border border-border/50 bg-background/80 px-2 py-2 shadow-lg backdrop-blur-xl">
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

        {/* Layouts button with dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => {
              if (activeTab !== "layouts") {
                onTabChange("layouts");
              } else {
                setIsOpen(!isOpen);
              }
            }}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "layouts"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <LayoutTemplate className="h-4 w-4" />
            {activeTab === "layouts" && current ? current.name : "Layouts"}
            {activeTab === "layouts" && layouts.length > 0 && (
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            )}
          </button>

          {isOpen && layouts.length > 0 && (
            <div className="absolute bottom-full left-0 mb-2 min-w-[200px] rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-lg py-1 overflow-hidden">
              {layouts.map((l) => {
                const isActive = l.slug === currentSlug;
                return (
                  <button
                    key={l.slug}
                    onClick={() => {
                      router.push(`/layouts/${l.slug}`);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center px-4 py-2.5 text-sm transition-colors text-left ${
                      isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-foreground hover:bg-accent/50"
                    }`}
                  >
                    {l.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button
          onClick={() => onTabChange("animations")}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "animations"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Animations
        </button>
      </nav>
    </div>
  );
}
