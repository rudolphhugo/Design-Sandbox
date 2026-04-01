export type ConformanceTarget = "WCAG 2.1 AA" | "WCAG 2.1 AAA" | "WCAG 2.2 AA" | "WCAG 2.2 AAA" | "EN 301 549";
export type CheckStatus = "pending" | "pass" | "fail" | "partial" | "na";
export type Severity = "critical" | "high" | "medium" | "low";
export type Role = "developer" | "designer" | "content" | "qa";
export type UserGroup = "blind" | "low-vision" | "deaf" | "motor" | "cognitive" | "seizure";
export type Phase =
  | "automated"
  | "keyboard"
  | "screen-reader"
  | "visual"
  | "code";
export type PageStatus = "not-started" | "in-progress" | "complete";

export interface AuditCheck {
  id: string;
  phase: Phase;
  category: string;
  title: string;
  wcag: string;
  level: "A" | "AA" | "AAA";
  whyItMatters: string;
  howToTest: string;
  tool?: string;
  voiceOverTip?: string;
  passCondition: string;
  conditional?: string;
  roles?: Role[];
  affectedUsers?: UserGroup[];
  /** "project" = site-wide check (lives in project.projectChecks, not per page). Default: "page" */
  scope?: "project" | "page";
  /** If set, check only appears for these conformance targets */
  applicableTargets?: ConformanceTarget[];
}

export interface CheckResult {
  checkId: string;
  status: CheckStatus;
  severity?: Severity;
  notes: string;
  /** Marks this finding as affecting the whole site, not just this page */
  siteWide?: boolean;
  /** Finding detail fields — shown when status is fail or partial */
  location?: string;
  issue?: string;
  applicableCode?: string;
  recommendation?: string;
  screenshot?: string;
}

export interface AuditPage {
  id: string;
  name: string;
  url: string;
  status: PageStatus;
  checks: CheckResult[];
}

export interface AuditProject {
  id: string;
  clientName: string;
  websiteUrl: string;
  conformanceTarget: ConformanceTarget;
  auditorName: string;
  auditDate: string;
  environment?: string;
  /** Project-level check results (e.g. EN 301 549 accessibility statement requirements) */
  projectChecks?: CheckResult[];
  createdAt: string;
  pages: AuditPage[];
  criteriaComments?: Record<string, string>;
  /** Marks a criterion as a site-wide issue — disables per-page assessment */
  siteWideFlags?: Record<string, boolean>;
}
