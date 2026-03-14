export type ConformanceTarget = "WCAG 2.1 AA" | "WCAG 2.1 AAA" | "WCAG 2.2 AA" | "WCAG 2.2 AAA" | "EN 301 549";
export type CheckStatus = "pending" | "pass" | "fail" | "partial" | "na";
export type Severity = "critical" | "high" | "medium" | "low";
export type Role = "developer" | "designer" | "content" | "qa";
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
}

export interface CheckResult {
  checkId: string;
  status: CheckStatus;
  severity?: Severity;
  notes: string;
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
  createdAt: string;
  pages: AuditPage[];
  criteriaComments?: Record<string, string>;
}
