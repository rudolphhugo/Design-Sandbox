import type { AuditProject, AuditPage, CheckResult, ConformanceTarget } from "./audit-types";
import { ALL_CHECKS } from "./audit-checks";

export function getChecksForTarget(target: ConformanceTarget): typeof ALL_CHECKS {
  const includeAAA = target === "WCAG 2.1 AAA" || target === "WCAG 2.2 AAA";
  return includeAAA ? ALL_CHECKS : ALL_CHECKS.filter((c) => c.level !== "AAA");
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
  return getProjects().find((p) => p.id === id);
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
  return ALL_CHECKS.map((c) => ({
    checkId: c.id,
    status: "pending" as const,
    notes: "",
  }));
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
