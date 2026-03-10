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
    getPhaseProgress,
} from "@/lib/audit-storage";
import { ALL_CHECKS, PHASES } from "@/lib/audit-checks";
import type { AuditProject, CheckStatus, Severity, Phase } from "@/lib/audit-types";

interface Props {
    projectId: string;
}

const statusConfig: Record<CheckStatus, { label: string; icon: React.ReactNode; className: string }> = {
    pending: { label: "Not checked", icon: <Circle className="w-4 h-4" />, className: "text-muted-foreground" },
    pass: { label: "Pass", icon: <CheckCircle2 className="w-4 h-4 text-green-500" />, className: "text-green-600" },
    fail: { label: "Fail", icon: <XCircle className="w-4 h-4 text-red-500" />, className: "text-red-600" },
    partial: { label: "Partial", icon: <AlertCircle className="w-4 h-4 text-amber-500" />, className: "text-amber-600" },
    na: { label: "N/A", icon: <MinusCircle className="w-4 h-4 text-muted-foreground" />, className: "text-muted-foreground" },
};

const severityOptions: Severity[] = ["critical", "high", "medium", "low"];

export function CriteriaWorkspace({ projectId }: Props) {
    const router = useRouter();
    const [activePhase, setActivePhase] = useState<Phase>("automated");
    const [collapsedPhases, setCollapsedPhases] = useState<Set<Phase>>(new Set());

    const initialProject = typeof window !== "undefined" ? (getProject(projectId) ?? null) : null;
    const initialCheck = ALL_CHECKS.find((c) => c.phase === "automated") ?? null;

    const [project, setProject] = useState<AuditProject | null>(initialProject);
    const [selectedCheckId, setSelectedCheckId] = useState<string | null>(initialCheck?.id ?? null);
    const [savedAt, setSavedAt] = useState<number | null>(null);

    // Use a map for the drafts so we can hold notes for multiple pages simultaneously
    const [notesDrafts, setNotesDrafts] = useState<Record<string, string>>({});

    const notesDebounceRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
    const projectRef = useRef(project);
    projectRef.current = project;

    const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const triggerSaved = useCallback(() => {
        setSavedAt(Date.now());
        if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
        savedTimerRef.current = setTimeout(() => setSavedAt(null), 2500);
    }, []);

    // Initialize drafts when selecting a new check
    useEffect(() => {
        if (!project || !selectedCheckId) return;
        const newDrafts: Record<string, string> = {};
        project.pages.forEach((page) => {
            const result = page.checks.find(c => c.checkId === selectedCheckId);
            newDrafts[page.id] = result?.notes ?? "";
        });
        setNotesDrafts(newDrafts);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCheckId]);

    useEffect(() => {
        if (!project) {
            router.push("/layouts/a11y-audit");
        }
    }, [project, router]);

    // Update selected check when phase changes
    useEffect(() => {
        if (!project) return;
        const nextId = ALL_CHECKS.find((c) => c.phase === activePhase)?.id ?? null;
        setSelectedCheckId(nextId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activePhase]);

    const updateCheck = useCallback(
        (pageId: string, checkId: string, status: CheckStatus, severity?: Severity) => {
            if (!project) return;
            const page = project.pages.find(p => p.id === pageId);
            if (!page) return;

            const existing = page.checks.find((c) => c.checkId === checkId)!;
            const updatedProject = updateCheckResult(project, pageId, {
                checkId,
                status,
                severity: status === "fail" || status === "partial" ? (severity ?? existing.severity) : undefined,
                notes: existing.notes,
            });
            saveProject(updatedProject);
            setProject(updatedProject);
            triggerSaved();
        },
        [project, triggerSaved]
    );

    const handleNotesChange = useCallback(
        (pageId: string, checkId: string, notes: string) => {
            setNotesDrafts(prev => ({ ...prev, [pageId]: notes }));

            if (notesDebounceRefs.current[pageId]) clearTimeout(notesDebounceRefs.current[pageId]);

            notesDebounceRefs.current[pageId] = setTimeout(() => {
                delete notesDebounceRefs.current[pageId];
                const currentProject = projectRef.current;
                if (!currentProject) return;

                const currentPage = currentProject.pages.find(p => p.id === pageId);
                if (!currentPage) return;

                const existing = currentPage.checks.find((c) => c.checkId === checkId);
                if (!existing) return;

                const updated = updateCheckResult(currentProject, pageId, { ...existing, notes });
                saveProject(updated);
                setProject(updated);
                triggerSaved();
            }, 600);
        },
        [triggerSaved]
    );

    if (!project) return null;

    const phaseChecks = ALL_CHECKS.filter((c) => c.phase === activePhase);
    const selectedCheck = selectedCheckId ? ALL_CHECKS.find((c) => c.id === selectedCheckId) : null;

    // Calculate total project progress
    const totalChecks = project.pages.length * ALL_CHECKS.length;
    const completedChecks = project.pages.reduce((acc, page) => {
        return acc + page.checks.filter(c => c.status !== "pending").length;
    }, 0);
    const pct = totalChecks === 0 ? 0 : Math.round((completedChecks / totalChecks) * 100);

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
                            <h1 className="text-sm font-semibold truncate">Batch Audit: By Criteria</h1>
                            <p className="text-xs text-muted-foreground truncate">{project.clientName}</p>
                        </div>
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
                            <span>{completedChecks}/{totalChecks}</span>
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
                        // Aggregate phase progress across ALL pages
                        const pt = ALL_CHECKS.filter(c => c.phase === phase.id).length * project.pages.length;
                        const pd = project.pages.reduce((acc, page) => {
                            const { done } = getPhaseProgress(page, phase.id);
                            return acc + done;
                        }, 0);

                        const isActive = activePhase === phase.id;
                        const isCollapsed = collapsedPhases.has(phase.id);
                        const phaseChecksLocal = ALL_CHECKS.filter((c) => c.phase === phase.id);

                        return (
                            <div key={phase.id}>
                                {/* Phase header */}
                                <button
                                    className={`w-full flex items-center gap-2.5 px-4 py-3 text-left hover:bg-accent/50 transition-colors border-b border-border/30 ${isActive ? "bg-accent/30" : ""
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
                                        <div className="text-[10px] text-muted-foreground">{pd}/{pt} done globally</div>
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
                                            const isSelected = selectedCheckId === check.id;

                                            // Check status across pages
                                            const statuses = project.pages.map(p => p.checks.find(r => r.checkId === check.id)?.status ?? "pending");
                                            const allDone = statuses.every(s => s !== "pending");
                                            const anyFails = statuses.some(s => s === "fail" || s === "partial");

                                            const icon = allDone
                                                ? (anyFails ? <XCircle className="w-4 h-4 text-red-500" /> : <CheckCircle2 className="w-4 h-4 text-green-500" />)
                                                : <Circle className="w-4 h-4 text-muted-foreground" />;

                                            return (
                                                <button
                                                    key={check.id}
                                                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left hover:bg-accent/30 transition-colors ${isSelected ? "bg-accent text-accent-foreground" : ""
                                                        }`}
                                                    onClick={() => {
                                                        setSelectedCheckId(check.id);
                                                    }}
                                                >
                                                    <span className="shrink-0">{icon}</span>
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

                {/* Right: Check detail and Pages list */}
                <div className="flex-1 overflow-y-auto bg-muted/10">
                    {selectedCheck ? (
                        <div className="max-w-4xl mx-auto px-6 py-6 space-y-8">
                            {/* Check Description Card */}
                            <div className="rounded-xl border border-border/50 bg-card p-5 space-y-4 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="flex-1">
                                        <h2 className="text-lg font-semibold leading-snug">{selectedCheck.title}</h2>
                                        <div className="flex items-center gap-2 mt-2 flex-wrap">
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
                                    {/* Why it matters */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                                            <Info className="w-3.5 h-3.5" /> Why it matters
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {selectedCheck.whyItMatters}
                                        </p>
                                    </div>

                                    {/* Pass condition */}
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600 dark:text-green-500">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Pass condition
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {selectedCheck.passCondition}
                                        </p>
                                    </div>
                                </div>

                                {selectedCheck.conditional && (
                                    <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 px-3.5 py-2.5 flex items-start gap-2 text-sm mt-2">
                                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                        <span className="text-amber-700 dark:text-amber-400">
                                            <strong>Conditional check:</strong> {selectedCheck.conditional}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Global "Pass All" button (Optional enhancement) */}
                            <div className="flex justify-between items-end border-b border-border/50 pb-2">
                                <h3 className="text-sm font-semibold">Pages ({project.pages.length})</h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-xs bg-green-500/5 hover:bg-green-500/10 text-green-700 border-green-500/20"
                                    onClick={() => {
                                        let updated = { ...project };
                                        updated.pages.forEach(p => {
                                            const existing = p.checks.find(c => c.checkId === selectedCheck.id);
                                            if (existing && existing.status === "pending") {
                                                updated = updateCheckResult(updated, p.id, {
                                                    ...existing,
                                                    status: "pass"
                                                });
                                            }
                                        });
                                        saveProject(updated);
                                        setProject(updated);
                                        triggerSaved();
                                    }}
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                    Pass All Pending
                                </Button>
                            </div>

                            {/* Pages Grid/List */}
                            <div className="space-y-4">
                                {project.pages.map((page) => {
                                    const result = page.checks.find(c => c.checkId === selectedCheck.id);
                                    if (!result) return null;

                                    const draftNotes = notesDrafts[page.id] ?? result.notes;

                                    return (
                                        <div key={page.id} className="rounded-xl border border-border/50 bg-card p-4 shadow-sm flex flex-col md:flex-row gap-5">
                                            {/* Page Info */}
                                            <div className="md:w-1/3 shrink-0">
                                                <div className="font-medium text-sm mb-1">{page.name}</div>
                                                {page.url && (
                                                    <a href={page.url} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline truncate block max-w-full">
                                                        {page.url}
                                                    </a>
                                                )}
                                            </div>

                                            {/* Controls */}
                                            <div className="flex-1 space-y-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {(["pass", "fail", "partial", "na"] as CheckStatus[]).map((s) => (
                                                        <button
                                                            key={s}
                                                            onClick={() => updateCheck(page.id, selectedCheck.id, s, result.severity)}
                                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-all ${result.status === s
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

                                                {/* Severity & Notes row */}
                                                <div className="flex flex-col md:flex-row gap-3">
                                                    {(result.status === "fail" || result.status === "partial") && (
                                                        <div className="w-full md:w-32 shrink-0">
                                                            <Select
                                                                value={result.severity ?? ""}
                                                                onValueChange={(v) =>
                                                                    updateCheck(page.id, selectedCheck.id, result.status, v as Severity)
                                                                }
                                                            >
                                                                <SelectTrigger className="h-8 text-xs">
                                                                    <SelectValue placeholder="Severity..." />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {severityOptions.map((s) => (
                                                                        <SelectItem key={s} value={s} className="capitalize text-xs">
                                                                            {s}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    )}
                                                    <Textarea
                                                        placeholder="Findings or notes for this page..."
                                                        value={draftNotes}
                                                        onChange={(e) => handleNotesChange(page.id, selectedCheck.id, e.target.value)}
                                                        className="text-xs min-h-[40px] h-[40px] resize-y flex-1"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {project.pages.length === 0 && (
                                    <div className="text-center py-12 text-sm text-muted-foreground border border-dashed rounded-xl">
                                        No pages added to this project yet.
                                    </div>
                                )}
                            </div>

                            {/* Navigation */}
                            <div className="flex justify-between pt-6 border-t border-border/30">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const idx = phaseChecks.findIndex((c) => c.id === selectedCheck.id);
                                        if (idx > 0) {
                                            const prev = phaseChecks[idx - 1];
                                            setSelectedCheckId(prev.id);
                                        }
                                    }}
                                    disabled={phaseChecks.findIndex((c) => c.id === selectedCheck.id) === 0}
                                >
                                    ← Previous Check
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        const idx = phaseChecks.findIndex((c) => c.id === selectedCheck.id);
                                        if (idx < phaseChecks.length - 1) {
                                            const next = phaseChecks[idx + 1];
                                            setSelectedCheckId(next.id);
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
                                        : "Next Check →"}
                                </Button>
                            </div>

                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                            Select a criteria from the left panel to get started.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
