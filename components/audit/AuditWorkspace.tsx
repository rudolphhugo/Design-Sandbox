"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
  Check,
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
  getChecksForTarget,
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
  const initialChecks = initialProject ? getChecksForTarget(initialProject.conformanceTarget) : ALL_CHECKS;
  const initialCheck = initialPage
    ? (initialChecks.find(
        (c) => c.phase === "automated" &&
          initialPage.checks.find((r) => r.checkId === c.id)?.status === "pending"
      ) ?? initialChecks.find((c) => c.phase === "automated"))
    : null;

  const [project, setProject] = useState<AuditProject | null>(initialProject);
  const [page, setPage] = useState<AuditPage | null>(initialPage);
  const [selectedCheckId, setSelectedCheckId] = useState<string | null>(initialCheck?.id ?? null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [notesDraft, setNotesDraft] = useState<string>(
    initialPage?.checks.find((c) => c.checkId === initialCheck?.id)?.notes ?? ""
  );

  const notesDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingNotesRef = useRef<{ checkId: string; notes: string } | null>(null);
  // Keep a ref to the latest project/page so debounced saves always use fresh data
  const projectRef = useRef(project);
  const pageRef = useRef(page);
  projectRef.current = project;
  pageRef.current = page;

  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerSaved = useCallback(() => {
    setSavedAt(Date.now());
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    savedTimerRef.current = setTimeout(() => setSavedAt(null), 2500);
  }, []);

  useEffect(() => {
    if (!project || !page) {
      if (!project) router.push("/layouts/a11y-audit");
      else router.push(`/layouts/a11y-audit/${projectId}`);
    }
  }, [project, page, projectId, router]);

  // When switching checks: flush any pending notes save first
  const flushPendingNotes = useCallback(() => {
    if (notesDebounceRef.current) {
      clearTimeout(notesDebounceRef.current);
      notesDebounceRef.current = null;
    }
    const pending = pendingNotesRef.current;
    if (!pending) return;
    pendingNotesRef.current = null;
    const currentProject = projectRef.current;
    const currentPage = pageRef.current;
    if (!currentProject || !currentPage) return;
    const existing = currentPage.checks.find((c) => c.checkId === pending.checkId);
    if (!existing) return;
    const updated = updateCheckResult(currentProject, pageId, { ...existing, notes: pending.notes });
    saveProject(updated);
    projectRef.current = updated;
    pageRef.current = updated.pages.find((p) => p.id === pageId) ?? null;
    setProject(updated);
    setPage(updated.pages.find((p) => p.id === pageId) ?? null);
  }, [pageId]);

  // Update selected check when phase changes
  useEffect(() => {
    if (!page) return;
    flushPendingNotes();
    const targetChecks = project ? getChecksForTarget(project.conformanceTarget) : ALL_CHECKS;
    const firstPending = targetChecks.find(
      (c) => c.phase === activePhase &&
        page.checks.find((r) => r.checkId === c.id)?.status === "pending"
    );
    const nextId = firstPending?.id ?? targetChecks.find((c) => c.phase === activePhase)?.id ?? null;
    setSelectedCheckId(nextId);
    setNotesDraft(page.checks.find((c) => c.checkId === nextId)?.notes ?? "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePhase]);

  const updateCheck = useCallback(
    (checkId: string, status: CheckStatus, severity?: Severity) => {
      if (!project || !page) return;
      const existing = page.checks.find((c) => c.checkId === checkId)!;
      const updated = updateCheckResult(project, pageId, {
        checkId,
        status,
        severity: status === "fail" || status === "partial" ? (severity ?? existing.severity) : undefined,
        notes: existing.notes,
      });
      saveProject(updated);
      setProject(updated);
      setPage(updated.pages.find((p) => p.id === pageId)!);
      triggerSaved();
    },
    [project, page, pageId, triggerSaved]
  );

  const handleNotesChange = useCallback(
    (checkId: string, notes: string) => {
      setNotesDraft(notes);
      pendingNotesRef.current = { checkId, notes };
      if (notesDebounceRef.current) clearTimeout(notesDebounceRef.current);
      notesDebounceRef.current = setTimeout(() => {
        notesDebounceRef.current = null;
        const currentProject = projectRef.current;
        const currentPage = pageRef.current;
        if (!currentProject || !currentPage) return;
        const existing = currentPage.checks.find((c) => c.checkId === checkId);
        if (!existing) return;
        pendingNotesRef.current = null;
        const updated = updateCheckResult(currentProject, pageId, { ...existing, notes });
        saveProject(updated);
        setProject(updated);
        setPage(updated.pages.find((p) => p.id === pageId)!);
        triggerSaved();
      }, 600);
    },
    [pageId, triggerSaved]
  );

  if (!project || !page) return null;

  const projectChecks = getChecksForTarget(project.conformanceTarget);
  const phaseChecks = projectChecks.filter((c) => c.phase === activePhase);
  const selectedCheck = selectedCheckId ? projectChecks.find((c) => c.id === selectedCheckId) : null;
  const selectedResult = selectedCheckId
    ? page.checks.find((c) => c.checkId === selectedCheckId)
    : null;
  const { done, total, pct } = getPageProgress(page);

  return (
    <div className="h-screen flex flex-col bg-muted/40 overflow-hidden">
      {/* Top bar */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm shrink-0">
        <div className="px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
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
          {/* Mode switcher */}
          <div className="hidden md:flex items-center gap-0.5 rounded-lg border border-border/50 bg-muted/30 p-0.5 shrink-0">
            <button
              className="px-3 py-1 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => router.push(`/layouts/a11y-audit/${projectId}/criteria`)}
            >
              By Criteria
            </button>
            <button className="px-3 py-1 rounded-md text-xs font-medium bg-background shadow-sm text-foreground">
              By Page
            </button>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {savedAt && (
              <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 animate-in fade-in">
                <Check className="w-3 h-3" />
                Saved
              </span>
            )}
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
            const { done: pd, total: pt } = getPhaseProgress(page, phase.id, project.conformanceTarget);
            const isActive = activePhase === phase.id;
            const isCollapsed = collapsedPhases.has(phase.id);
            const phaseChecksLocal = projectChecks.filter((c) => c.phase === phase.id);

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
                          className={`w-full flex items-center gap-2.5 pr-4 pl-[14px] py-2.5 text-left hover:bg-accent/30 transition-colors border-l-2 ${
                            isSelected
                              ? "border-primary bg-primary/5 text-foreground font-medium"
                              : "border-transparent text-muted-foreground"
                          }`}
                          onClick={() => {
                          flushPendingNotes();
                          setSelectedCheckId(check.id);
                          setNotesDraft(page.checks.find((r) => r.checkId === check.id)?.notes ?? "");
                        }}
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
        <div className="flex-1 overflow-y-auto bg-muted/40">
          {selectedCheck && selectedResult ? (
            <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
              {/* Check header */}
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold leading-snug">{selectedCheck.title}</h2>
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
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {selectedCheck.whyItMatters}
                </p>

                {/* Conditional notice */}
                {selectedCheck.conditional && (
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-3.5 py-2.5 flex gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-900 dark:text-amber-200">
                      <strong>Conditional check:</strong> {selectedCheck.conditional}
                    </p>
                  </div>
                )}
              </div>

              {/* How to test */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  <BookOpen className="w-3.5 h-3.5" />
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
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-3.5 py-2.5 flex gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-900 dark:text-blue-200">
                      <strong>VoiceOver:</strong> {selectedCheck.voiceOverTip}
                    </p>
                  </div>
                )}

                {/* Pass condition */}
                <div className="rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 px-3.5 py-2.5 flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-green-900 dark:text-green-200">
                    <strong>Pass when:</strong> {selectedCheck.passCondition}
                  </p>
                </div>
              </div>

              {/* Result */}
              <div className="space-y-4 border-t border-border/50 pt-5">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Your result</div>

                {/* Status buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["pass", "fail", "partial", "na"] as CheckStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateCheck(selectedCheck.id, s, selectedResult.severity)}
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                        selectedResult.status === s
                          ? s === "pass"
                            ? "bg-green-500/20 border-green-500 text-green-800 dark:text-green-300"
                            : s === "fail"
                            ? "bg-red-500/20 border-red-500 text-red-800 dark:text-red-300"
                            : s === "partial"
                            ? "bg-amber-500/20 border-amber-500 text-amber-800 dark:text-amber-300"
                            : "bg-zinc-500/20 border-zinc-400 text-zinc-700 dark:text-zinc-300"
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
                      <SelectTrigger className="h-8 text-sm bg-white dark:bg-background">
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
                    value={notesDraft}
                    onChange={(e) => handleNotesChange(selectedCheck.id, e.target.value)}
                    className="text-sm min-h-[80px] resize-none bg-white dark:bg-background"
                  />
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      flushPendingNotes();
                      const idx = phaseChecks.findIndex((c) => c.id === selectedCheck.id);
                      if (idx > 0) {
                        const prev = phaseChecks[idx - 1];
                        setSelectedCheckId(prev.id);
                        setNotesDraft(page.checks.find((r) => r.checkId === prev.id)?.notes ?? "");
                      }
                    }}
                    disabled={phaseChecks.findIndex((c) => c.id === selectedCheck.id) === 0}
                  >
                    ← Previous
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      flushPendingNotes();
                      const idx = phaseChecks.findIndex((c) => c.id === selectedCheck.id);
                      if (idx < phaseChecks.length - 1) {
                        const next = phaseChecks[idx + 1];
                        setSelectedCheckId(next.id);
                        setNotesDraft(page.checks.find((r) => r.checkId === next.id)?.notes ?? "");
                      } else {
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
