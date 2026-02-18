import { ComponentType } from "react";

export interface RegistryItem {
  slug: string;
  name: string;
  component: ComponentType;
  /** If true, the component page renders full-width (no grid) */
  showcase?: boolean;
}

import { ProjectHeroCard } from "@/components/showcase/ProjectHeroCard";

export const components: RegistryItem[] = [
  {
    slug: "project-hero-card",
    name: "Project Hero Card",
    component: ProjectHeroCard,
  },
];

import { TestLayout2 } from "@/components/showcase/TestLayout2";
import { TestLayout3 } from "@/components/showcase/TestLayout3";
import { TobiasCV } from "@/components/showcase/TobiasCV";

export const layouts: RegistryItem[] = [
  {
    slug: "tobias-cv",
    name: "Tobias CV",
    component: TobiasCV,
  },
  {
    slug: "test-layout-2",
    name: "Test Layout 2",
    component: TestLayout2,
  },
  {
    slug: "test-layout-3",
    name: "Test Layout 3",
    component: TestLayout3,
  },
];

import { FadeInBasics } from "@/components/animations/FadeInBasics";

export const animations: RegistryItem[] = [
  {
    slug: "fade-in-basics",
    name: "1. Fade In — The Basics",
    component: FadeInBasics,
    showcase: true,
  },
];
