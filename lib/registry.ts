import { ComponentType } from "react";

export interface RegistryItem {
  slug: string;
  name: string;
  component: ComponentType;
}

// Lazy imports to avoid loading all components upfront
import { ProjectHeroCard } from "@/components/showcase/ProjectHeroCard";

export const components: RegistryItem[] = [
  {
    slug: "project-hero-card",
    name: "Project Hero Card",
    component: ProjectHeroCard,
  },
];

export const layouts: RegistryItem[] = [];
