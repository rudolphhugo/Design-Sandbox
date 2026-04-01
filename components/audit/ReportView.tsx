"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Printer,
  FileText,
  ChevronDown,
  Sheet,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getProject } from "@/lib/audit-storage";
import {
  buildReportData,
  generateMarkdown,
  generateCSV,
  getExecutiveSummary,
  STRINGS,
  type Lang,
  type GroupedFinding,
  type Strings,
  type ReportData,
  type CsvOptions,
} from "@/lib/audit-report";

interface Props {
  projectId: string;
}

const SEV_CONFIG = {
  critical: {
    bar: "bg-red-500",
    border: "border-l-red-500",
    badge: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
    emoji: "🔴",
  },
  high: {
    bar: "bg-orange-500",
    border: "border-l-orange-500",
    badge: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
    emoji: "🟠",
  },
  medium: {
    bar: "bg-amber-500",
    border: "border-l-amber-500",
    badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    emoji: "🟡",
  },
  low: {
    bar: "bg-blue-500",
    border: "border-l-blue-500",
    badge: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    emoji: "🟢",
  },
  unset: {
    bar: "bg-zinc-400",
    border: "border-l-zinc-300",
    badge: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
    emoji: "⚪",
  },
} as const;

const VERDICT_STYLES: Record<ReportData["conformanceVerdict"], string> = {
  conforms: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30",
  "partially-conforms": "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
  "does-not-conform": "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30",
  incomplete: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/30",
};

const VERDICT_ICON: Record<ReportData["conformanceVerdict"], string> = {
  conforms: "✅",
  "partially-conforms": "⚠️",
  "does-not-conform": "❌",
  incomplete: "⏳",
};

export function ReportView({ projectId }: Props) {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("en");
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvOptions, setCsvOptions] = useState<CsvOptions>({ includePass: false, includeNa: false });

  const [project] = useState(() =>
    typeof window !== "undefined" ? getProject(projectId) ?? null : null
  );
  const [data] = useState(() => (project ? buildReportData(project) : null));

  useEffect(() => {
    if (!project) router.push("/layouts/a11y-audit");
  }, [project, router]);

  if (!project || !data) return null;

  const t = STRINGS[lang];
  const executiveSummary = getExecutiveSummary(data, lang);
  const { groupedFindings, strengths, conformanceVerdict, severityCounts } = data;

  const findingsBySeverity = (["critical", "high", "medium", "low"] as const)
    .map((sev) => ({ sev, items: groupedFindings.filter((f) => f.severity === sev) }))
    .filter((g) => g.items.length > 0);
  const unsetFindings = groupedFindings.filter((f) => !f.severity);

  function handleMarkdownExport() {
    const md = generateMarkdown(data!, lang);
    const slug = project!.clientName.toLowerCase().replace(/\s+/g, "-");
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `a11y-audit-${slug}-${project!.auditDate}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleCsvDownload() {
    const csv = generateCSV(project!, csvOptions);
    const slug = project!.clientName.toLowerCase().replace(/\s+/g, "-");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}-audit.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setCsvModalOpen(false);
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* ── Toolbar ─────────────────────────────────────────────── */}
      <div className="print:hidden sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => router.push(`/layouts/a11y-audit/${projectId}/findings`)}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{project.clientName}</p>
            <p className="text-xs text-muted-foreground">{t.reportTitle}</p>
          </div>

          {/* Language toggle */}
          <div className="flex items-center rounded-lg border border-border/60 overflow-hidden shrink-0">
            {(["en", "sv"] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                  lang === l
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Export */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <Download className="w-3.5 h-3.5" />
                Export
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleMarkdownExport} className="gap-2">
                <FileText className="w-4 h-4" />
                {t.export.markdown}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCsvModalOpen(true)} className="gap-2">
                <Sheet className="w-4 h-4" />
                Spreadsheet (CSV)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.print()} className="gap-2">
                <Printer className="w-4 h-4" />
                {t.export.print}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ── Report body ──────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-10 print:py-6 print:px-0">

        {/* 1 ── Title block */}
        <header>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            {t.reportTitle}
          </p>
          <h1 className="text-4xl font-bold tracking-tight">{project.clientName}</h1>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
            <span>
              <span className="font-medium text-foreground">{t.meta.auditor}:</span>{" "}
              {project.auditorName}
            </span>
            <span>
              <span className="font-medium text-foreground">{t.meta.date}:</span>{" "}
              {project.auditDate}
            </span>
            <span>
              <span className="font-medium text-foreground">{t.meta.standard}:</span>{" "}
              {project.conformanceTarget}
            </span>
            <span>
              <span className="font-medium text-foreground">{t.meta.pages}:</span>{" "}
              {project.pages.length}
            </span>
          </div>
          {project.websiteUrl && (
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{t.meta.url}:</span>{" "}
              {project.websiteUrl}
            </p>
          )}
          <div className="mt-5">
            <span
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-sm font-semibold ${VERDICT_STYLES[conformanceVerdict]}`}
            >
              {VERDICT_ICON[conformanceVerdict]} {t.verdict[conformanceVerdict]}
            </span>
            <p className="mt-2 text-sm text-muted-foreground max-w-md leading-relaxed">
              {t.verdictDesc[conformanceVerdict]}
            </p>
          </div>
        </header>

        <div className="border-t border-border/50" />

        {/* 2 ── Executive Summary */}
        <section>
          <SectionTitle>{t.sections.executiveSummary}</SectionTitle>
          <p className="text-sm leading-relaxed text-foreground/80">{executiveSummary}</p>

          {groupedFindings.length > 0 && (
            <div className="mt-5 rounded-xl border border-border/50 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border/50">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {lang === "sv" ? "Allvarlighetsgrad" : "Severity"}
                    </th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {lang === "sv" ? "Antal" : "Count"}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border/30">
                  {(["critical", "high", "medium", "low"] as const).map((sev) => {
                    const count = severityCounts[sev];
                    if (!count) return null;
                    const cfg = SEV_CONFIG[sev];
                    return (
                      <tr key={sev}>
                        <td className="px-4 py-2.5">
                          <span className="flex items-center gap-2.5">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.bar}`} />
                            {cfg.emoji} {t.severity[sev]}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right font-semibold tabular-nums">
                          {count}
                        </td>
                      </tr>
                    );
                  })}
                  {severityCounts.unset > 0 && (
                    <tr>
                      <td className="px-4 py-2.5">
                        <span className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full shrink-0 bg-zinc-400" />
                          ⚪ {t.severity.unset}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold tabular-nums">
                        {severityCounts.unset}
                      </td>
                    </tr>
                  )}
                  <tr className="bg-muted/30 border-t border-border/50 font-semibold">
                    <td className="px-4 py-2.5">{t.misc.total}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {groupedFindings.length}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* 3 ── Score Overview */}
        <section>
          <SectionTitle>{t.sections.scoreOverview}</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              label={t.stats.reviewed}
              value={`${data.reviewedPct}%`}
              sub={`${data.reviewedCount} / ${data.reviewedCount + data.pendingCount}`}
            />
            <StatCard
              label={t.stats.passRate}
              value={`${data.passPct}%`}
              sub={`${data.passCount} ${t.misc.passed}`}
            />
            <StatCard
              label={t.stats.issuesFound}
              value={groupedFindings.length}
              sub={t.misc.uniqueCriteria}
            />
            <StatCard
              label={t.stats.pages}
              value={project.pages.length}
              sub={project.pages.map((p) => p.name).join(", ")}
            />
          </div>
        </section>

        {/* 4 ── Findings */}
        {groupedFindings.length > 0 && (
          <section>
            <SectionTitle>{t.sections.findings}</SectionTitle>
            <div className="space-y-8">
              {findingsBySeverity.map(({ sev, items }) => (
                <div key={sev}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${SEV_CONFIG[sev].bar}`} />
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      {SEV_CONFIG[sev].emoji} {t.severity[sev]} ({items.length})
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {items.map((finding) => (
                      <FindingCard key={finding.checkDef.id} finding={finding} sev={sev} t={t} />
                    ))}
                  </div>
                </div>
              ))}
              {unsetFindings.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                    <h3 className="text-sm font-bold uppercase tracking-wider">
                      ⚪ {t.severity.unset} ({unsetFindings.length})
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {unsetFindings.map((finding) => (
                      <FindingCard
                        key={finding.checkDef.id}
                        finding={finding}
                        sev="unset"
                        t={t}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 5 ── Strengths */}
        {strengths.length > 0 && (
          <section>
            <SectionTitle>{t.sections.strengths}</SectionTitle>
            <p className="text-sm text-muted-foreground mb-4">{t.strengthsIntro}</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {strengths.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-2.5 rounded-lg border border-green-500/20 bg-green-500/5 px-3.5 py-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{s.title}</p>
                    <p className="text-xs text-muted-foreground">WCAG {s.wcag}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6 ── Action Plan */}
        {groupedFindings.length > 0 && (
          <section>
            <SectionTitle>{t.sections.actionPlan}</SectionTitle>
            <div className="rounded-xl border border-border/50 overflow-hidden overflow-x-auto">
              <table className="w-full text-sm min-w-[580px]">
                <thead>
                  <tr className="bg-muted/50 border-b border-border/50">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground w-8">
                      {t.actionPlan.num}
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t.actionPlan.severity}
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t.actionPlan.issue}
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t.actionPlan.pages}
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t.actionPlan.wcag}
                    </th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t.actionPlan.category}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border/30">
                  {groupedFindings.map(({ checkDef, severity, pages }, idx) => {
                    const sevKey = (severity ?? "unset") as keyof typeof SEV_CONFIG;
                    const cfg = SEV_CONFIG[sevKey];
                    return (
                      <tr key={checkDef.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-2.5 text-muted-foreground tabular-nums text-xs">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium ${cfg.badge}`}
                          >
                            {cfg.emoji}{" "}
                            {t.severity[sevKey as keyof typeof t.severity]}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-medium">{checkDef.title}</td>
                        <td className="px-4 py-2.5 text-muted-foreground text-xs">
                          {pages.map((p) => p.name).join(", ")}
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                          {checkDef.wcag}
                        </td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground capitalize">
                          {checkDef.category}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="border-t border-border/50 pt-5 text-xs text-muted-foreground">
          {t.footer} · {project.auditDate} · {project.auditorName}
        </div>
      </div>

      {/* ── CSV Export Modal ──────────────────────────────────── */}
      {csvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center print:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setCsvModalOpen(false)}
          />
          <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-sm mx-4 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Export spreadsheet</h3>
              <button
                onClick={() => setCsvModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={csvOptions.includePass}
                  onChange={(e) =>
                    setCsvOptions((prev) => ({ ...prev, includePass: e.target.checked }))
                  }
                  className="rounded border-border"
                />
                <span className="text-sm">Include Pass results</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={csvOptions.includeNa}
                  onChange={(e) =>
                    setCsvOptions((prev) => ({ ...prev, includeNa: e.target.checked }))
                  }
                  className="rounded border-border"
                />
                <span className="text-sm">Include N/A results</span>
              </label>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCsvModalOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleCsvDownload} className="gap-1.5">
                <Download className="w-3.5 h-3.5" />
                Download CSV
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold mb-5 pb-2 border-b border-border/50">{children}</h2>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-4 space-y-0.5">
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      {sub && <p className="text-[11px] text-muted-foreground truncate pt-0.5">{sub}</p>}
    </div>
  );
}

function FindingCard({
  finding,
  sev,
  t,
}: {
  finding: GroupedFinding;
  sev: keyof typeof SEV_CONFIG;
  t: Strings;
}) {
  const cfg = SEV_CONFIG[sev];
  const { checkDef, pages } = finding;
  const hasNotes = pages.some((p) => p.notes);

  return (
    <div
      className={`rounded-xl border border-border/50 bg-card overflow-hidden border-l-4 ${cfg.border} break-inside-avoid`}
    >
      <div className="px-5 py-4 space-y-4">
        {/* Header */}
        <div className="space-y-1.5">
          <h4 className="text-base font-semibold leading-snug">{checkDef.title}</h4>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground">
              WCAG {checkDef.wcag}
            </span>
            <Badge variant="outline" className="text-[11px] py-0">
              Level {checkDef.level}
            </Badge>
            <span className="text-[11px] text-muted-foreground capitalize">
              {checkDef.category}
            </span>
          </div>
        </div>

        {/* Pages affected */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
            {t.finding.pages}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {pages.map((p, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-xs font-medium"
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>

        {/* Why it matters */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            {t.finding.whyItMatters}
          </p>
          <p className="text-sm text-foreground/70 leading-relaxed">{checkDef.whyItMatters}</p>
        </div>

        {/* Auditor notes */}
        {hasNotes && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
              {t.finding.notes}
            </p>
            <div className="space-y-1.5">
              {pages
                .filter((p) => p.notes)
                .map((p, i) => (
                  <div key={i} className="rounded-lg bg-muted/60 px-3.5 py-2.5 text-sm">
                    <span className="text-xs font-semibold text-muted-foreground mr-1.5">
                      {p.name}:
                    </span>
                    {p.notes}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Pass condition */}
        <div className="rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 px-3.5 py-3 flex gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-green-700 dark:text-green-500 mb-0.5">
              {t.finding.passWhen}
            </p>
            <p className="text-sm text-green-900 dark:text-green-200 leading-relaxed">
              {checkDef.passCondition}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
