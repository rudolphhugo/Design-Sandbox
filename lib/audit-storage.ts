import type { AuditProject, AuditPage, CheckResult, ConformanceTarget } from "./audit-types";
import { ALL_CHECKS } from "./audit-checks";

/** Returns page-scoped checks applicable to the given target (excludes project-level checks). */
export function getChecksForTarget(target: ConformanceTarget): typeof ALL_CHECKS {
  const includeAAA = target === "WCAG 2.1 AAA" || target === "WCAG 2.2 AAA";
  return ALL_CHECKS.filter((c) => {
    if (c.scope === "project") return false;
    if (c.applicableTargets && !c.applicableTargets.includes(target)) return false;
    if (!includeAAA && c.level === "AAA") return false;
    return true;
  });
}

/** Returns project-scoped checks for the given target (e.g. EN 301 549 site-wide requirements). */
export function getProjectChecksForTarget(target: ConformanceTarget): typeof ALL_CHECKS {
  return ALL_CHECKS.filter(
    (c) =>
      c.scope === "project" &&
      (!c.applicableTargets || c.applicableTargets.includes(target))
  );
}

/** Ensures a project has projectChecks initialised (migration for existing projects). */
export function migrateProject(project: AuditProject): AuditProject {
  // 1. Backfill project-level checks (EN 301 549 site-wide requirements)
  const projectLevelChecks = getProjectChecksForTarget(project.conformanceTarget);
  const existingProjectCheckIds = new Set((project.projectChecks ?? []).map((c) => c.checkId));
  const missingProjectChecks = projectLevelChecks
    .filter((c) => !existingProjectCheckIds.has(c.id))
    .map((c) => ({ checkId: c.id, status: "pending" as const, notes: "" }));

  // 2. Backfill per-page checks — any check added to audit-checks.ts after the page was created
  const allPageChecks = ALL_CHECKS.filter((c) => c.scope !== "project");
  const migratedPages = project.pages.map((page) => {
    const existingCheckIds = new Set(page.checks.map((c) => c.checkId));
    const missing = allPageChecks
      .filter((c) => !existingCheckIds.has(c.id))
      .map((c) => ({ checkId: c.id, status: "pending" as const, notes: "" }));
    if (missing.length === 0) return page;
    return { ...page, checks: [...page.checks, ...missing] };
  });

  const needsProjectUpdate = missingProjectChecks.length > 0 || project.projectChecks === undefined;
  const needsPageUpdate = migratedPages.some((p, i) => p !== project.pages[i]);

  if (!needsProjectUpdate && !needsPageUpdate) return project;

  return {
    ...project,
    projectChecks: [...(project.projectChecks ?? []), ...missingProjectChecks],
    pages: migratedPages,
  };
}

const STORAGE_KEY = "a11y-audit-projects";

export function getProjects(): AuditProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getProject(id: string): AuditProject | undefined {
  const p = getProjects().find((p) => p.id === id);
  return p ? migrateProject(p) : undefined;
}

export function saveProject(project: AuditProject): void {
  const projects = getProjects();
  const idx = projects.findIndex((p) => p.id === project.id);
  if (idx >= 0) {
    projects[idx] = project;
  } else {
    projects.push(project);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function deleteProject(id: string): void {
  const projects = getProjects().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function createDefaultChecks(): CheckResult[] {
  return ALL_CHECKS.filter((c) => c.scope !== "project").map((c) => ({
    checkId: c.id,
    status: "pending" as const,
    notes: "",
  }));
}

export function updateProjectCheckResult(
  project: AuditProject,
  result: CheckResult
): AuditProject {
  return {
    ...project,
    projectChecks: (project.projectChecks ?? []).map((c) =>
      c.checkId === result.checkId ? result : c
    ),
  };
}

export function createPage(name: string, url: string): AuditPage {
  return {
    id: crypto.randomUUID(),
    name,
    url,
    status: "not-started",
    checks: createDefaultChecks(),
  };
}

export function updateCheckResult(
  project: AuditProject,
  pageId: string,
  result: CheckResult
): AuditProject {
  return {
    ...project,
    pages: project.pages.map((page) => {
      if (page.id !== pageId) return page;
      const checks = page.checks.map((c) =>
        c.checkId === result.checkId ? result : c
      );
      const nonPending = checks.filter((c) => c.status !== "pending");
      const status =
        nonPending.length === 0
          ? "not-started"
          : nonPending.length === checks.length
          ? "complete"
          : "in-progress";
      return { ...page, checks, status };
    }),
  };
}

export function getPageProgress(page: AuditPage): {
  done: number;
  total: number;
  pct: number;
} {
  const total = page.checks.length;
  const done = page.checks.filter((c) => c.status !== "pending").length;
  return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
}

export function getPhaseProgress(
  page: AuditPage,
  phase: string,
  target?: ConformanceTarget
): { done: number; total: number } {
  const checks = target ? getChecksForTarget(target) : ALL_CHECKS;
  const phaseChecks = checks.filter((c) => c.phase === phase);
  const results = page.checks.filter((c) =>
    phaseChecks.some((pc) => pc.id === c.checkId)
  );
  return {
    total: phaseChecks.length,
    done: results.filter((r) => r.status !== "pending").length,
  };
}

export function updateSiteWideFlag(
  project: AuditProject,
  checkId: string,
  value: boolean
): AuditProject {
  return {
    ...project,
    siteWideFlags: {
      ...project.siteWideFlags,
      [checkId]: value,
    },
  };
}

export function updateCriteriaComment(
  project: AuditProject,
  checkId: string,
  comment: string
): AuditProject {
  return {
    ...project,
    criteriaComments: {
      ...project.criteriaComments,
      [checkId]: comment,
    },
  };
}

export function getFindings(project: AuditProject) {
  const projectChecks = getChecksForTarget(project.conformanceTarget);
  const findings: Array<{
    page: AuditPage;
    check: CheckResult;
    checkDef: (typeof ALL_CHECKS)[0];
  }> = [];

  for (const page of project.pages) {
    for (const check of page.checks) {
      if (check.status === "fail" || check.status === "partial") {
        const checkDef = projectChecks.find((c) => c.id === check.checkId);
        if (checkDef) findings.push({ page, check, checkDef });
      }
    }
  }

  return findings.sort((a, b) => {
    const order: Record<string, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
      undefined: 4,
    };
    return (
      (order[a.check.severity ?? "undefined"] ?? 4) -
      (order[b.check.severity ?? "undefined"] ?? 4)
    );
  });
}
