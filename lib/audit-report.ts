import type { AuditProject, AuditCheck, CheckStatus, Severity } from "./audit-types";
import { getChecksForTarget, getFindings } from "./audit-storage";

export type Lang = "en" | "sv";

export type GroupedFinding = {
  checkDef: AuditCheck;
  severity: Severity | undefined;
  pages: Array<{ name: string; url: string; notes: string; status: CheckStatus }>;
};

export type ReportData = {
  project: AuditProject;
  projectChecks: AuditCheck[];
  totalChecks: number;
  reviewedCount: number;
  passCount: number;
  failCount: number;
  partialCount: number;
  naCount: number;
  pendingCount: number;
  reviewedPct: number;
  passPct: number;
  severityCounts: { critical: number; high: number; medium: number; low: number; unset: number };
  findings: ReturnType<typeof getFindings>;
  groupedFindings: GroupedFinding[];
  strengths: AuditCheck[];
  conformanceVerdict: "conforms" | "partially-conforms" | "does-not-conform" | "incomplete";
};

export function buildReportData(project: AuditProject): ReportData {
  const projectChecks = getChecksForTarget(project.conformanceTarget);
  const rawFindings = getFindings(project);

  const allPageChecks = project.pages.flatMap((p) => p.checks);
  const passCount = allPageChecks.filter((c) => c.status === "pass").length;
  const failCount = allPageChecks.filter((c) => c.status === "fail").length;
  const partialCount = allPageChecks.filter((c) => c.status === "partial").length;
  const naCount = allPageChecks.filter((c) => c.status === "na").length;
  const pendingCount = allPageChecks.filter((c) => c.status === "pending").length;
  const reviewedCount = passCount + failCount + partialCount + naCount;
  const totalCount = reviewedCount + pendingCount;

  // Group raw findings (one per page×check) into unique criteria
  const sevOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  const groupedMap = new Map<string, GroupedFinding>();
  for (const { page, check, checkDef } of rawFindings) {
    if (!groupedMap.has(checkDef.id)) {
      groupedMap.set(checkDef.id, { checkDef, severity: check.severity, pages: [] });
    } else {
      const existing = groupedMap.get(checkDef.id)!;
      if ((sevOrder[check.severity ?? ""] ?? 99) < (sevOrder[existing.severity ?? ""] ?? 99)) {
        existing.severity = check.severity;
      }
    }
    groupedMap.get(checkDef.id)!.pages.push({
      name: page.name,
      url: page.url,
      notes: check.notes,
      status: check.status,
    });
  }
  const groupedFindings = Array.from(groupedMap.values());

  const severityCounts = {
    critical: groupedFindings.filter((f) => f.severity === "critical").length,
    high: groupedFindings.filter((f) => f.severity === "high").length,
    medium: groupedFindings.filter((f) => f.severity === "medium").length,
    low: groupedFindings.filter((f) => f.severity === "low").length,
    unset: groupedFindings.filter((f) => !f.severity).length,
  };

  // Strengths: criteria that passed (or na) on all pages, with at least one pass
  const strengths = projectChecks.filter((check) => {
    if (project.pages.length === 0) return false;
    const statuses = project.pages.map(
      (p) => p.checks.find((r) => r.checkId === check.id)?.status ?? "pending"
    );
    return (
      statuses.some((s) => s === "pass") &&
      !statuses.some((s) => s === "fail" || s === "partial")
    );
  });

  let conformanceVerdict: ReportData["conformanceVerdict"];
  if (pendingCount > 0) conformanceVerdict = "incomplete";
  else if (groupedFindings.length === 0) conformanceVerdict = "conforms";
  else if (severityCounts.critical > 0) conformanceVerdict = "does-not-conform";
  else conformanceVerdict = "partially-conforms";

  return {
    project,
    projectChecks,
    totalChecks: projectChecks.length,
    reviewedCount,
    passCount,
    failCount,
    partialCount,
    naCount,
    pendingCount,
    reviewedPct: totalCount > 0 ? Math.round((reviewedCount / totalCount) * 100) : 0,
    passPct: reviewedCount > 0 ? Math.round((passCount / reviewedCount) * 100) : 0,
    severityCounts,
    findings: rawFindings,
    groupedFindings,
    strengths,
    conformanceVerdict,
  };
}

// ─── Localisation ─────────────────────────────────────────────────────────────

export type Strings = {
  reportTitle: string;
  meta: {
    auditor: string;
    date: string;
    standard: string;
    url: string;
    pages: string;
    verdict: string;
  };
  sections: {
    executiveSummary: string;
    scoreOverview: string;
    findings: string;
    strengths: string;
    actionPlan: string;
  };
  stats: { reviewed: string; passRate: string; issuesFound: string; pages: string };
  severity: { critical: string; high: string; medium: string; low: string; unset: string };
  verdict: Record<ReportData["conformanceVerdict"], string>;
  verdictDesc: Record<ReportData["conformanceVerdict"], string>;
  actionPlan: {
    num: string;
    issue: string;
    severity: string;
    pages: string;
    wcag: string;
    category: string;
  };
  finding: {
    wcag: string;
    category: string;
    pages: string;
    whyItMatters: string;
    notes: string;
    passWhen: string;
  };
  strengthsIntro: string;
  footer: string;
  export: { markdown: string; print: string };
  langLabels: { en: string; sv: string };
  misc: { total: string; uniqueCriteria: string; passed: string };
};

export const STRINGS: Record<Lang, Strings> = {
  en: {
    reportTitle: "Accessibility Audit Report",
    meta: {
      auditor: "Auditor",
      date: "Date",
      standard: "Standard",
      url: "URL",
      pages: "Pages audited",
      verdict: "Verdict",
    },
    sections: {
      executiveSummary: "Executive Summary",
      scoreOverview: "Score Overview",
      findings: "Findings",
      strengths: "What Passed",
      actionPlan: "Action Plan",
    },
    stats: {
      reviewed: "Reviewed",
      passRate: "Pass rate",
      issuesFound: "Issues found",
      pages: "Pages",
    },
    severity: {
      critical: "Critical",
      high: "High",
      medium: "Medium",
      low: "Low",
      unset: "Unset",
    },
    verdict: {
      conforms: "Conforms",
      "partially-conforms": "Partially Conforms",
      "does-not-conform": "Does Not Conform",
      incomplete: "Audit Incomplete",
    },
    verdictDesc: {
      conforms:
        "All reviewed criteria passed. The site conforms to the stated standard.",
      "partially-conforms":
        "No critical issues found, but some criteria require attention before full conformance.",
      "does-not-conform":
        "Critical issues were found. The site does not conform to the stated standard.",
      incomplete:
        "The audit is not fully completed. Verdict pending remaining checks.",
    },
    actionPlan: {
      num: "#",
      issue: "Issue",
      severity: "Severity",
      pages: "Pages",
      wcag: "WCAG",
      category: "Category",
    },
    finding: {
      wcag: "WCAG criterion",
      category: "Category",
      pages: "Pages affected",
      whyItMatters: "Why it matters",
      notes: "Auditor notes",
      passWhen: "Passes when",
    },
    strengthsIntro: "The following criteria passed across all audited pages:",
    footer: "Report generated",
    export: { markdown: "Export Markdown", print: "Print / PDF" },
    langLabels: { en: "English", sv: "Svenska" },
    misc: { total: "Total", uniqueCriteria: "unique criteria", passed: "passed" },
  },
  sv: {
    reportTitle: "Tillgänglighetsrevision",
    meta: {
      auditor: "Granskare",
      date: "Datum",
      standard: "Standard",
      url: "URL",
      pages: "Granskade sidor",
      verdict: "Bedömning",
    },
    sections: {
      executiveSummary: "Sammanfattning",
      scoreOverview: "Resultatöversikt",
      findings: "Fynd",
      strengths: "Vad godkändes",
      actionPlan: "Åtgärdsplan",
    },
    stats: {
      reviewed: "Granskade",
      passRate: "Godkännandegrad",
      issuesFound: "Problem hittade",
      pages: "Sidor",
    },
    severity: {
      critical: "Kritisk",
      high: "Hög",
      medium: "Medium",
      low: "Låg",
      unset: "Ej satt",
    },
    verdict: {
      conforms: "Uppfyller",
      "partially-conforms": "Uppfyller delvis",
      "does-not-conform": "Uppfyller inte",
      incomplete: "Granskning ofullständig",
    },
    verdictDesc: {
      conforms:
        "Alla granskade kriterier godkändes. Webbplatsen uppfyller angiven standard.",
      "partially-conforms":
        "Inga kritiska problem hittades, men vissa kriterier kräver åtgärd för full efterlevnad.",
      "does-not-conform":
        "Kritiska problem hittades. Webbplatsen uppfyller inte angiven standard.",
      incomplete:
        "Granskningen är inte slutförd. Bedömning inväntar återstående kontroller.",
    },
    actionPlan: {
      num: "#",
      issue: "Problem",
      severity: "Allvarlighetsgrad",
      pages: "Sidor",
      wcag: "WCAG",
      category: "Kategori",
    },
    finding: {
      wcag: "WCAG-kriterium",
      category: "Kategori",
      pages: "Berörda sidor",
      whyItMatters: "Varför det spelar roll",
      notes: "Granskarens anteckningar",
      passWhen: "Godkänt när",
    },
    strengthsIntro: "Följande kriterier godkändes på alla granskade sidor:",
    footer: "Rapport genererad",
    export: { markdown: "Exportera Markdown", print: "Skriv ut / PDF" },
    langLabels: { en: "English", sv: "Svenska" },
    misc: {
      total: "Totalt",
      uniqueCriteria: "unika kriterier",
      passed: "godkända",
    },
  },
};

// ─── Executive summary text ───────────────────────────────────────────────────

export function getExecutiveSummary(data: ReportData, lang: Lang): string {
  const { project, totalChecks, groupedFindings, severityCounts, pendingCount } = data;
  const totalIssues = groupedFindings.length;

  if (lang === "sv") {
    const pageWord = project.pages.length === 1 ? "sida" : "sidor";
    let text = `${project.clientName} (${project.websiteUrl}) granskades ${project.auditDate} mot ${project.conformanceTarget} på ${project.pages.length} ${pageWord}. Granskningen täckte ${totalChecks} kriterier inom fem testfaser.`;
    if (totalIssues > 0) {
      const parts: string[] = [];
      if (severityCounts.critical > 0) parts.push(`${severityCounts.critical} kritiska`);
      if (severityCounts.high > 0) parts.push(`${severityCounts.high} höga`);
      if (severityCounts.medium > 0) parts.push(`${severityCounts.medium} medelsvåra`);
      if (severityCounts.low > 0) parts.push(`${severityCounts.low} låga`);
      if (severityCounts.unset > 0)
        parts.push(`${severityCounts.unset} utan angiven allvarlighetsgrad`);
      text += ` Granskningen identifierade ${totalIssues} problem som kräver åtgärd — ${parts.join(", ")}.`;
    } else if (pendingCount === 0) {
      text += " Inga tillgänglighetsproblem hittades.";
    }
    if (pendingCount > 0) {
      text += ` Obs: ${pendingCount} kontroll${pendingCount !== 1 ? "er" : ""} inväntar fortfarande granskning — bedömningen kan ändras när alla kriterier har utvärderats.`;
    }
    return text;
  }

  const pageWord = project.pages.length === 1 ? "page" : "pages";
  let text = `${project.clientName} (${project.websiteUrl}) was audited on ${project.auditDate} against ${project.conformanceTarget} across ${project.pages.length} ${pageWord}. The audit covered ${totalChecks} criteria across five testing phases.`;
  if (totalIssues > 0) {
    const parts: string[] = [];
    if (severityCounts.critical > 0) parts.push(`${severityCounts.critical} critical`);
    if (severityCounts.high > 0) parts.push(`${severityCounts.high} high`);
    if (severityCounts.medium > 0) parts.push(`${severityCounts.medium} medium`);
    if (severityCounts.low > 0) parts.push(`${severityCounts.low} low`);
    if (severityCounts.unset > 0) parts.push(`${severityCounts.unset} without severity set`);
    text += ` The audit identified ${totalIssues} issue${totalIssues !== 1 ? "s" : ""} requiring attention — ${parts.join(", ")}.`;
  } else if (pendingCount === 0) {
    text += " No accessibility issues were found.";
  }
  if (pendingCount > 0) {
    text += ` Note: ${pendingCount} check${pendingCount !== 1 ? "s" : ""} remain pending review — the verdict may change once all criteria have been assessed.`;
  }
  return text;
}

// ─── Markdown export ──────────────────────────────────────────────────────────

export function generateMarkdown(data: ReportData, lang: Lang): string {
  const t = STRINGS[lang];
  const { project, groupedFindings, strengths, severityCounts, conformanceVerdict } = data;
  const executiveSummary = getExecutiveSummary(data, lang);
  const totalIssues = groupedFindings.length;
  const sevEmoji: Record<string, string> = {
    critical: "🔴",
    high: "🟠",
    medium: "🟡",
    low: "🟢",
  };

  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────────────
  lines.push(`# ${t.reportTitle} — ${project.clientName}`);
  lines.push("");
  lines.push(`**${t.meta.auditor}:** ${project.auditorName}  `);
  lines.push(`**${t.meta.date}:** ${project.auditDate}  `);
  lines.push(`**${t.meta.standard}:** ${project.conformanceTarget}  `);
  lines.push(`**${t.meta.url}:** ${project.websiteUrl}  `);
  lines.push(`**${t.meta.pages}:** ${project.pages.length}  `);
  lines.push(`**${t.meta.verdict}:** ${t.verdict[conformanceVerdict]}`);
  lines.push("");
  lines.push("---");
  lines.push("");

  // ── Executive Summary ────────────────────────────────────────────────────────
  lines.push(`## ${t.sections.executiveSummary}`);
  lines.push("");
  lines.push(executiveSummary);
  lines.push("");

  if (totalIssues > 0) {
    const sevCol = lang === "sv" ? "Allvarlighetsgrad" : "Severity";
    const countCol = lang === "sv" ? "Antal" : "Count";
    lines.push(`| ${sevCol} | ${countCol} |`);
    lines.push("|---|---|");
    (["critical", "high", "medium", "low"] as const).forEach((sev) => {
      if (severityCounts[sev] > 0) {
        lines.push(`| ${sevEmoji[sev]} ${t.severity[sev]} | ${severityCounts[sev]} |`);
      }
    });
    if (severityCounts.unset > 0) {
      lines.push(`| ⚪ ${t.severity.unset} | ${severityCounts.unset} |`);
    }
    lines.push(`| **${t.misc.total}** | **${totalIssues}** |`);
    lines.push("");
  }

  lines.push("---");
  lines.push("");

  // ── Findings ─────────────────────────────────────────────────────────────────
  if (groupedFindings.length > 0) {
    lines.push(`## ${t.sections.findings}`);
    lines.push("");

    const severityGroups: Array<[Severity, string]> = [
      ["critical", "🔴"],
      ["high", "🟠"],
      ["medium", "🟡"],
      ["low", "🟢"],
    ];

    for (const [sev, emoji] of severityGroups) {
      const group = groupedFindings.filter((f) => f.severity === sev);
      if (!group.length) continue;
      lines.push(`### ${emoji} ${t.severity[sev]} (${group.length})`);
      lines.push("");
      group.forEach(({ checkDef, pages }, i) => {
        const pageList = pages.map((p) => p.name).join(", ");
        const notes = pages.map((p) => p.notes).filter(Boolean);
        lines.push(`#### ${emoji} ${t.severity[sev]}-${i + 1} — ${checkDef.title}`);
        lines.push("");
        lines.push(`**${t.finding.wcag}:** ${checkDef.wcag} · Level ${checkDef.level}`);
        lines.push(`**${t.finding.category}:** ${checkDef.category}`);
        lines.push(`**${t.finding.pages}:** ${pageList}`);
        lines.push("");
        lines.push(`**${t.finding.whyItMatters}:** ${checkDef.whyItMatters}`);
        lines.push("");
        if (notes.length) {
          lines.push(`**${t.finding.notes}:**`);
          notes.forEach((n) => lines.push(`> ${n}`));
          lines.push("");
        }
        lines.push(`**${t.finding.passWhen}:** ${checkDef.passCondition}`);
        lines.push("");
        lines.push("---");
        lines.push("");
      });
    }

    const unsetGroup = groupedFindings.filter((f) => !f.severity);
    if (unsetGroup.length) {
      lines.push(`### ⚪ ${t.severity.unset} (${unsetGroup.length})`);
      lines.push("");
      unsetGroup.forEach(({ checkDef, pages }, i) => {
        lines.push(`#### ⚪ ${t.severity.unset}-${i + 1} — ${checkDef.title}`);
        lines.push("");
        lines.push(`**${t.finding.wcag}:** ${checkDef.wcag} · Level ${checkDef.level}`);
        lines.push(`**${t.finding.pages}:** ${pages.map((p) => p.name).join(", ")}`);
        lines.push("");
        lines.push("---");
        lines.push("");
      });
    }
  }

  // ── Strengths ─────────────────────────────────────────────────────────────────
  if (strengths.length) {
    lines.push(`## ${t.sections.strengths}`);
    lines.push("");
    lines.push(t.strengthsIntro);
    lines.push("");
    strengths.forEach((s) => lines.push(`- **${s.title}** (WCAG ${s.wcag})`));
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  // ── Action Plan ───────────────────────────────────────────────────────────────
  if (groupedFindings.length) {
    lines.push(`## ${t.sections.actionPlan}`);
    lines.push("");
    lines.push(
      `| ${t.actionPlan.num} | ${t.actionPlan.severity} | ${t.actionPlan.issue} | ${t.actionPlan.pages} | ${t.actionPlan.wcag} | ${t.actionPlan.category} |`
    );
    lines.push("|---|---|---|---|---|---|");
    groupedFindings.forEach(({ checkDef, severity, pages }, idx) => {
      const sev = severity
        ? `${sevEmoji[severity] ?? "⚪"} ${t.severity[severity]}`
        : `⚪ ${t.severity.unset}`;
      lines.push(
        `| ${idx + 1} | ${sev} | ${checkDef.title} | ${pages.map((p) => p.name).join(", ")} | ${checkDef.wcag} | ${checkDef.category} |`
      );
    });
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  lines.push(`*${t.footer} · ${project.auditDate} · ${project.auditorName}*`);

  return lines.join("\n");
}
