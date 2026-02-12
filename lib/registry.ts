import { ComponentType } from "react";

export interface RegistryItem {
  slug: string;
  name: string;
  component: ComponentType;
  /** If true, the component page renders full-width (no grid) */
  showcase?: boolean;
}

import { ProjectHeroCard } from "@/components/showcase/ProjectHeroCard";
import { DropdownShowcase } from "@/components/showcase/DropdownShowcase";
import { InputFieldShowcase } from "@/components/showcase/InputFieldShowcase";

export const components: RegistryItem[] = [
  {
    slug: "project-hero-card",
    name: "Project Hero Card",
    component: ProjectHeroCard,
  },
  {
    slug: "dropdown",
    name: "Dropdown",
    component: DropdownShowcase,
    showcase: true,
  },
  {
    slug: "input-fields",
    name: "Input Fields",
    component: InputFieldShowcase,
    showcase: true,
  },
];

export const layouts: RegistryItem[] = [];
