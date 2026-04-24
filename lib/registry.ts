import { ComponentType } from "react";

export interface RegistryItem {
  slug: string;
  name: string;
  component: ComponentType;
  /** If true, the component page renders full-width (no grid) */
  showcase?: boolean;
}

import { ProjectHeroCard } from "@/components/showcase/ProjectHeroCard";
import { EducationCard } from "@/components/showcase/EducationCard";

export const components: RegistryItem[] = [
  {
    slug: "project-hero-card",
    name: "Project Hero Card",
    component: ProjectHeroCard,
  },
  {
    slug: "education-card",
    name: "Education Card",
    component: EducationCard,
    showcase: true,
  },
];

import { TestLayout2 } from "@/components/showcase/TestLayout2";
import { TestLayout3 } from "@/components/showcase/TestLayout3";
import { TobiasCV } from "@/components/showcase/TobiasCV";
import { TodoApp } from "@/components/showcase/TodoApp";
import { ProjectsHome } from "@/components/audit/ProjectsHome";
import { NavPatterns } from "@/components/showcase/NavPatterns";

export const layouts: RegistryItem[] = [
  {
    slug: "nav-patterns",
    name: "Nav Patterns",
    component: NavPatterns,
  },
  {
    slug: "a11y-audit",
    name: "A11y Audit",
    component: ProjectsHome,
  },
  {
    slug: "todo-app",
    name: "ToDo",
    component: TodoApp,
  },
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

import { GesturesWorkspace } from "@/components/showcase/GesturesWorkspace";

export const gestures: RegistryItem[] = [
  {
    slug: "mediapipe-workspace",
    name: "MediaPipe Workspace",
    component: GesturesWorkspace,
  },
];

import { FruitFrenzy } from "@/components/showcase/FruitFrenzy";

export const games: RegistryItem[] = [
  {
    slug: "easter-frenzy",
    name: "Easter Frenzy",
    component: FruitFrenzy,
    showcase: true,
  },
];
