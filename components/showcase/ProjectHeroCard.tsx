"use client";

import { useState } from "react";
import Image from "next/image";

export function ProjectHeroCard({ className }: { className?: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className={`flex flex-col gap-4 items-start w-full text-left relative ${className || ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="aspect-[2048/1364] relative rounded-sm shrink-0 w-full overflow-hidden">
        <Image
          alt="2024 Maison Nueue"
          src="/uploads/figma-card-hero.png"
          fill
          className={`object-cover transition-transform duration-500 ease-out ${
            hovered ? "scale-[1.12]" : "scale-100"
          }`}
        />
      </div>

      {/* Category Chip — top-left of image */}
      <div className="absolute top-4 left-4 flex items-center px-3 py-1.5 rounded-full bg-white/92 shadow-[0_1px_3px_rgba(0,0,0,0.15)] z-10">
        <span className="text-[13px] font-medium tracking-[0.2px] text-[#212121]">
          Architecture
        </span>
      </div>

      {/* Info row */}
      <div className="flex gap-4 items-start shrink-0 w-full">
        {/* Left column */}
        <div className="flex flex-1 flex-col items-start min-w-0">
          {!hovered && (
            <div className="flex items-center py-2">
              <Image
                alt=""
                src="/uploads/ellipse-dot.svg"
                width={15}
                height={15}
              />
            </div>
          )}
          {hovered && (
            <p className="font-normal leading-[1.2] text-2xl text-foreground uppercase">
              Voir
            </p>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-1 flex-col gap-2 items-start min-w-0">
          <div className="flex items-center justify-between leading-[1.2] py-2 w-full text-2xl font-bold text-foreground">
            <p className="flex-1 min-w-0">Projects</p>
            <p className="shrink-0 uppercase">01</p>
          </div>
          <div className="w-full border-t border-foreground/20" />
          <p className="font-normal leading-[1.2] text-2xl text-foreground">
            2024 Maison Nueue
          </p>
        </div>
      </div>

      {/* View Project Button */}
      <div
        className={`flex items-center justify-center w-full rounded-[4px] px-[22px] py-[10px] transition-colors ${
          hovered
            ? "bg-[#2b2b2b] shadow-[0_3px_6px_rgba(0,0,0,0.25),0_1px_8px_rgba(0,0,0,0.18)]"
            : "bg-[#191919] shadow-[0_2px_4px_rgba(0,0,0,0.2),0_1px_5px_rgba(0,0,0,0.14)]"
        }`}
      >
        <span className="text-[14px] font-semibold text-white tracking-[1px]">
          VIEW PROJECT
        </span>
      </div>
    </button>
  );
}
