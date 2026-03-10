"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MinusCircle,
  Circle,
  Info,
  Lightbulb,
  Wrench,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getProject,
  saveProject,
  updateCheckResult,
  getPageProgress,
  getPhaseProgress,
} from "@/lib/audit-storage";
import { ALL_CHECKS, PHASES } from "@/lib/audit-checks";
import type { AuditProject, AuditPage, CheckStatus, Severity, Phase } from "@/lib/audit-types";

interface Props {
  projectId: string;
  pageId: string;
}

const statusConfig: Record<CheckStatus, { label: string; icon: React.ReactNode; className: string }> = {
  pending: { label: "Not checked", icon: <Circle className="w-4 h-4" />, className: "text-muted-foreground" },
  pass: { label: "Pass", icon: <CheckCircle2 className="w-4 h-4 text-green-500" />, className: "text-green-600" },
  fail: { label: "Fail", icon: <XCircle className="w-4 h-4 text-red-500" />, className: "text-red-600" },
  partial: { label: "Partial", icon: <AlertCircle className="w-4 h-4 text-amber-500" />, className: "text-amber-600" },
  na: { label: "N/A", icon: <MinusCircle className="w-4 h-4 text-muted-foreground" />, className: "text-muted-foreground" },
};

const severityOptions: Severity[] = ["critical", "high", "medium", "low"];

export function AuditWorkspace({ projectId, pageId }: Props) {
  const router = useRouter();
  const [activePhase, setActivePhase] = useState<Phase>("automated");
  const [collapsedPhases, setCollapsedPhases] = useState<Set<Phase>>(new Set());

  const initialProject = typeof window !== "undefined" ? (getProject(projectId) ?? null) : null;
  const initialPage = initialProject?.pages.find((pg) => pg.id === pageId) ?? null;
  const initialCheck = initialPage
    ? (ALL_CHECKS.find(
        (c) => c.phase === "automated" &&
          initialPage.checks.find((r) => r.checkId === c.id)?.status === "pending"
      ) ?? ALL_CHECKS.find((c) => c.phase === "automated"))
    : null;

  const [project, setProject] = useState<AuditProject | null>(initialProject);
  const [page, setPage] = useState<AuditPage | null>(initialPage);
  const [selectedCheckId, setSelectedCheckId] = useState<string | null>(initialCheck?.id ?? null);

  useEffect(() => {
    if (!project || !page) {
      if (!project) router.push("/layouts/a11y-audit");
      else router.push(`/layouts/a11y-audit/${projectId}`);
    }
  }, [project, page, projectId, router]);

  // Update selected check when phase changes
  useEffect(() => {
    if (!page) return;
    const firstPending = ALL_CHECKS.find(
      (c) => c.phase === activePhase &&
        page.checks.find((r) => r.checkId === c.id)?.status === "pending"
    );
    setSelectedCheckId(
      firstPending?.id ?? ALL_CHECKS.find((c) => c.phase === activePhase)?.id ?? null
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePhase]);

  const updateCheck = useCallback(
    (checkId: string, status: CheckStatus, severity?: Severity, notes?: string) => {
      if (!project || !page) return;
      const existing = page.checks.find((c) => c.checkId === checkId)!;
      const updated = updateCheckResult(project, pageId, {
        checkId,
        status,
        severity: status === "fail" || status === "partial" ? (severity ?? existing.severity) : undefined,
        notes: notes ?? existing.notes,
      });
      saveProject(updated);
      setProject(updated);
      setPage(updated.pages.find((p) => p.id === pageId)!);
    },
    [project, page, pageId]
  );

  const updateNotes = useCallback(
    (checkId: string, notes: string) => {
      if (!project || !page) return;
      const existing = page.checks.find((c) => c.checkId === checkId)!;
      const updated = updateCheckResult(project, pageId, { ...existing, notes });
      saveProject(updated);
      setProject(updated);
      setPage(updated.pages.find((p) => p.id === pageId)!);
    },
    [project, page, pageId]
  );

  if (!project || !page) return null;

  const phaseChecks = ALL_CHECKS.filter((c) => c.phase === activePhase);
  const selectedCheck = selectedCheckId ? ALL_CHECKS.find((c) => c.id === selectedCheckId) : null;
  const selectedResult = selectedCheckId
    ? page.checks.find((c) => c.checkId === selectedCheckId)
    : null;
  const { done, total, pct } = getPageProgress(page);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top bar */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm shrink-0">
        <div className="px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => router.push(`/layouts/a11y-audit/${projectId}`)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold truncate">{page.name}</h1>
              <p className="text-xs text-muted-foreground truncate">{project.clientName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <Progress value={pct} className="w-24 h-1.5" />
              <span>{done}/{total}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/layouts/a11y-audit/${projectId}/findings`)}
            >
              Findings
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Phase + Check list */}
        <div className="w-72 shrink-0 border-r border-border/50 overflow-y-auto">
          {PHASES.map((phase) => {
            const { done: pd, total: pt } = getPhaseProgress(page, phase.id);
            const isActive = activePhase === phase.id;
            const isCollapsed = collapsedPhases.has(phase.id);
            const phaseChecksLocal = ALL_CHECKS.filter((c) => c.phase === phase.id);

            return (
              <div key={phase.id}>
                {/* Phase header */}
                <button
                  className={`w-full flex items-center gap-2.5 px-4 py-3 text-left hover:bg-accent/50 transition-colors border-b border-border/30 ${
                    isActive ? "bg-accent/30" : ""
                  }`}
                  onClick={() => {
                    setActivePhase(phase.id);
                    setCollapsedPhases((prev) => {
                      const next = new Set(prev);
                      if (isActive) {
                        if (next.has(phase.id)) next.delete(phase.id);
                        else next.add(phase.id);
                      } else {
                        next.delete(phase.id);
                      }
                      return next;
                    });
                  }}
                >
                  <span className="text-sm">{phase.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate">{phase.label}</div>
                    <div className="text-[10px] text-muted-foreground">{pd}/{pt} done</div>
                  </div>
                  {isCollapsed || !isActive ? (
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </button>

                {/* Check list */}
                {isActive && !isCollapsed && (
                  <div>
                    {phaseChecksLocal.map((check) => {
                      const result = page.checks.find((r) => r.checkId === check.id);
                      const status = result?.status ?? "pending";
                      const isSelected = selectedCheckId === check.id;
                      return (
                        <button
                          key={check.id}
                          className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left hover:bg-accent/30 transition-colors ${
                            isSelected ? "bg-accent text-accent-foreground" : ""
                          }`}
                          onClick={() => setSelectedCheckId(check.id)}
                        >
                          <span className="shrink-0">{statusConfig[status].icon}</span>
                          <span className="text-xs truncate flex-1">{check.title}</span>
                          {check.conditional && (
                            <span className="text-[10px] text-muted-foreground shrink-0">if</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Check detail */}
        <div className="flex-1 overflow-y-auto">
          {selectedCheck && selectedResult ? (
            <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
              {/* Check header */}
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h2 className="text-base font-semibold leading-snug">{selectedCheck.title}</h2>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        WCAG {selectedCheck.wcag}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Level {selectedCheck.level}
                      </Badge>
                      <span className="text-xs text-muted-foreground capitalize">
                        {selectedCheck.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Why it matters */}
                <div className="rounded-lg bg-muted/40 border border-border/40 p-3.5 flex gap-2.5">
                  <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedCheck.whyItMatters}
                  </p>
                </div>

                {/* Conditional notice */}
                {selectedCheck.conditional && (
                  <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 px-3.5 py-2.5 flex gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      <strong>Conditional check:</strong> {selectedCheck.conditional}
                    </p>
                  </div>
                )}
              </div>

              {/* How to test */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <BookOpen className="w-4 h-4" />
                  How to test
                </div>
                <div className="rounded-lg border border-border/50 bg-card divide-y divide-border/30 overflow-hidden">
                  {selectedCheck.howToTest.split("\n").map((step, i) => (
                    <div key={i} className="px-4 py-2.5 flex gap-3 text-sm">
                      <span className="text-muted-foreground shrink-0 font-mono text-xs mt-0.5">
                        {step.match(/^\d+\./) ? "" : "·"}
                      </span>
                      <span className="leading-relaxed">{step.replace(/^\d+\.\s*/, "")}</span>
                    </div>
                  ))}
                </div>

                {/* Tool */}
                {selectedCheck.tool && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Wrench className="w-3.5 h-3.5 shrink-0" />
                    <span><strong>Tool:</strong> {selectedCheck.tool}</span>
                  </div>
                )}

                {/* VoiceOver tip */}
                {selectedCheck.voiceOverTip && (
                  <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 px-3.5 py-2.5 flex gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      <strong>VoiceOver:</strong> {selectedCheck.voiceOverTip}
                    </p>
                  </div>
                )}

                {/* Pass condition */}
                <div className="rounded-lg bg-green-500/5 border border-green-500/20 px-3.5 py-2.5 flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-green-700 dark:text-green-400">
                    <strong>Pass when:</strong> {selectedCheck.passCondition}
                  </p>
                </div>
              </div>

              {/* Result */}
              <div className="space-y-4 border-t border-border/50 pt-5">
                <div className="text-sm font-semibold">Your result</div>

                {/* Status buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["pass", "fail", "partial", "na"] as CheckStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateCheck(selectedCheck.id, s, selectedResult.severity)}
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                        selectedResult.status === s
                          ? s === "pass"
                            ? "bg-green-500/10 border-green-500/40 text-green-700 dark:text-green-400"
                            : s === "fail"
                            ? "bg-red-500/10 border-red-500/40 text-red-700 dark:text-red-400"
                            : s === "partial"
                            ? "bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-400"
                            : "bg-accent border-border text-foreground"
                          : "border-border hover:bg-accent/50 text-muted-foreground"
                      }`}
                    >
                      {statusConfig[s].icon}
                      {statusConfig[s].label}
                    </button>
                  ))}
                </div>

                {/* Severity (only for fail/partial) */}
                {(selectedResult.status === "fail" || selectedResult.status === "partial") && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Severity</label>
                    <Select
                      value={selectedResult.severity ?? ""}
                      onValueChange={(v) =>
                        updateCheck(selectedCheck.id, selectedResult.status, v as Severity)
                      }
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Set severity..." />
                      </SelectTrigger>
                      <SelectContent>
                        {severityOptions.map((s) => (
                          <SelectItem key={s} value={s} className="capitalize">
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="text-xs text-muted-foreground space-y-0.5 pt-1">
                      <p><strong>Critical</strong> — blocks access for affected users</p>
                      <p><strong>High</strong> — significantly impairs usability</p>
                      <p><strong>Medium</strong> — causes friction but has workaround</p>
                      <p><strong>Low</strong> — minor issue, low impact</p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    Notes (what you found, where, any details)
                  </label>
                  <Textarea
                    placeholder="e.g. 'The contact form submit button has aria-label='btn1' — not descriptive. Fails on all form pages.'"
                    value={selectedResult.notes}
                    onChange={(e) => updateNotes(selectedCheck.id, e.target.value)}
                    className="text-sm min-h-[80px] resize-none"
                  />
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const idx = phaseChecks.findIndex((c) => c.id === selectedCheck.id);
                      if (idx > 0) setSelectedCheckId(phaseChecks[idx - 1].id);
                    }}
                    disabled={phaseChecks.findIndex((c) => c.id === selectedCheck.id) === 0}
                  >
                    ← Previous
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      const idx = phaseChecks.findIndex((c) => c.id === selectedCheck.id);
                      if (idx < phaseChecks.length - 1) {
                        setSelectedCheckId(phaseChecks[idx + 1].id);
                      } else {
                        // Move to next phase
                        const phaseIdx = PHASES.findIndex((p) => p.id === activePhase);
                        if (phaseIdx < PHASES.length - 1) {
                          setActivePhase(PHASES[phaseIdx + 1].id);
                        }
                      }
                    }}
                  >
                    {phaseChecks.findIndex((c) => c.id === selectedCheck.id) ===
                    phaseChecks.length - 1
                      ? "Next phase →"
                      : "Next →"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Select a check from the left panel to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
