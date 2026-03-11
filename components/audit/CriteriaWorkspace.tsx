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
    Lightbulb,
    Wrench,
    BookOpen,
    Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import type { AuditProject, CheckStatus, Severity, Phase, Role } from "@/lib/audit-types";

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

const roleConfig: Record<Role, { label: string; className: string }> = {
    developer: { label: "Developer", className: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30" },
    designer:  { label: "Designer",  className: "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30" },
    content:   { label: "Content",   className: "bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30" },
    qa:        { label: "QA",        className: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30" },
};

const ALL_ROLES: Role[] = ["developer", "designer", "content", "qa"];

export function CriteriaWorkspace({ projectId }: Props) {
    const router = useRouter();
    const [activePhase, setActivePhase] = useState<Phase>("automated");
    const [collapsedPhases, setCollapsedPhases] = useState<Set<Phase>>(new Set());
    const [activeRoles, setActiveRoles] = useState<Set<Role>>(new Set());

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

    const filterByRole = (checks: typeof ALL_CHECKS) =>
        activeRoles.size === 0 ? checks : checks.filter(c => c.roles?.some(r => activeRoles.has(r)));

    const phaseChecks = filterByRole(ALL_CHECKS.filter((c) => c.phase === activePhase));
    const selectedCheck = selectedCheckId ? ALL_CHECKS.find((c) => c.id === selectedCheckId) : null;

    // Calculate total project progress
    const totalChecks = project.pages.length * ALL_CHECKS.length;
    const completedChecks = project.pages.reduce((acc, page) => {
        return acc + page.checks.filter(c => c.status !== "pending").length;
    }, 0);
    const pct = totalChecks === 0 ? 0 : Math.round((completedChecks / totalChecks) * 100);

    return (
        <div className="h-screen flex flex-col bg-muted/40 overflow-hidden">
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
                            <h1 className="text-base font-semibold truncate">Batch Audit: By Criteria</h1>
                            <p className="text-sm text-muted-foreground truncate">{project.clientName}</p>
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
                    {/* Role filters */}
                    <div className="px-3 py-2.5 border-b border-border/30 flex flex-wrap gap-1.5">
                        {ALL_ROLES.map((role) => {
                            const active = activeRoles.has(role);
                            return (
                                <button
                                    key={role}
                                    onClick={() => setActiveRoles(prev => {
                                        const next = new Set(prev);
                                        active ? next.delete(role) : next.add(role);
                                        return next;
                                    })}
                                    className={`px-2 py-0.5 rounded-full border text-[11px] font-medium transition-all ${
                                        active ? roleConfig[role].className : "border-border/50 text-muted-foreground hover:border-foreground/30"
                                    }`}
                                >
                                    {roleConfig[role].label}
                                </button>
                            );
                        })}
                        {activeRoles.size > 0 && (
                            <button
                                onClick={() => setActiveRoles(new Set())}
                                className="px-2 py-0.5 rounded-full border border-border/50 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {PHASES.map((phase) => {
                        // Count criteria done = at least one page has a non-pending result
                        const phaseCheckIds = ALL_CHECKS.filter(c => c.phase === phase.id).map(c => c.id);
                        const pt = phaseCheckIds.length;
                        const pd = phaseCheckIds.filter(checkId =>
                            project.pages.some(page =>
                                page.checks.find(r => r.checkId === checkId)?.status !== "pending"
                            )
                        ).length;

                        const isActive = activePhase === phase.id;
                        const isCollapsed = collapsedPhases.has(phase.id);
                        const phaseChecksLocal = filterByRole(ALL_CHECKS.filter((c) => c.phase === phase.id));

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
                                        <div className="text-sm font-semibold truncate">{phase.label}</div>
                                        <div className="text-xs text-muted-foreground">{pd}/{pt} done</div>
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
                                                    className={`w-full flex items-center gap-2.5 pr-4 pl-[14px] py-2.5 text-left hover:bg-accent/30 transition-colors border-l-2 ${
                                        isSelected
                                            ? "border-primary bg-primary/5 text-foreground font-medium"
                                            : "border-transparent text-muted-foreground"
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
                <div className="flex-1 overflow-y-auto bg-muted/40">
                    {selectedCheck ? (
                        <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">

                            {/* Always-visible header */}
                            <div className="space-y-3">
                                <div>
                                    <h2 className="text-3xl font-semibold leading-snug">{selectedCheck.title}</h2>
                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                        <Badge variant="outline" className="text-xs">WCAG {selectedCheck.wcag}</Badge>
                                        <Badge variant="outline" className="text-xs">Level {selectedCheck.level}</Badge>
                                        <span className="text-xs text-muted-foreground capitalize">{selectedCheck.category}</span>
                                        {selectedCheck.roles?.map(role => (
                                            <span key={role} className={`px-2 py-0.5 rounded-full border text-[11px] font-medium ${roleConfig[role].className}`}>
                                                {roleConfig[role].label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-base leading-relaxed text-muted-foreground">{selectedCheck.whyItMatters}</p>
                            </div>

                            {/* Tabs */}
                            <Tabs defaultValue="audit">
                                <TabsList variant="line">
                                    <TabsTrigger value="audit" className="text-sm">Audit</TabsTrigger>
                                    <TabsTrigger value="reference" className="text-sm">Tools</TabsTrigger>
                                </TabsList>

                                {/* Tab 1: Audit — what to check + pass condition + pages */}
                                <TabsContent value="audit" className="mt-6 space-y-6">

                                    {/* What to check */}
                                    <div className="space-y-3">
                                        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                            <BookOpen className="w-3.5 h-3.5" /> What to check
                                        </div>
                                        <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
                                            {selectedCheck.howToTest.split("\n").map((step, i) => (
                                                <div key={i} className="px-5 py-4 flex gap-4 text-sm">
                                                    <span className="text-muted-foreground shrink-0 font-mono text-sm w-5 text-right mt-px">
                                                        {i + 1}.
                                                    </span>
                                                    <span className="leading-relaxed">{step.replace(/^\d+\.\s*/, "")}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pass condition */}
                                    <div className="rounded-lg bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 px-4 py-3 flex gap-3">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-[11px] font-semibold uppercase tracking-widest text-green-700 dark:text-green-500 mb-1">Passes when</div>
                                            <p className="text-sm text-green-900 dark:text-green-200 leading-relaxed">{selectedCheck.passCondition}</p>
                                        </div>
                                    </div>

                                    {selectedCheck.conditional && (
                                        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-3.5 py-2.5 flex items-start gap-2 text-sm">
                                            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                                            <span className="text-amber-900 dark:text-amber-200">
                                                <strong>Conditional check:</strong> {selectedCheck.conditional}
                                            </span>
                                        </div>
                                    )}

                                    {/* Pages header */}
                                    <div className="flex justify-between items-center border-b border-border/50 pb-2">
                                        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                                            Pages ({project.pages.length})
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 text-xs"
                                            onClick={() => {
                                                let updated = { ...project };
                                                updated.pages.forEach(p => {
                                                    const existing = p.checks.find(c => c.checkId === selectedCheck.id);
                                                    if (existing && existing.status === "pending") {
                                                        updated = updateCheckResult(updated, p.id, { ...existing, status: "pass" });
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

                                    {/* Pages list */}
                                    {project.pages.length === 0 ? (
                                        <div className="text-center py-12 text-sm text-muted-foreground border border-dashed rounded-xl">
                                            No pages added to this project yet.
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-border/50 overflow-hidden divide-y divide-border/50">
                                            {project.pages.map((page) => {
                                                const result = page.checks.find(c => c.checkId === selectedCheck.id);
                                                if (!result) return null;
                                                const draftNotes = notesDrafts[page.id] ?? result.notes;
                                                return (
                                                    <div key={page.id} className="bg-card px-4 py-3 space-y-2">
                                                        {/* Row 1: icon + name/url + buttons */}
                                                        <div className="flex items-center gap-3">
                                                            <div className="shrink-0">{statusConfig[result.status].icon}</div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-medium truncate">{page.name}</div>
                                                                {page.url && (
                                                                    <a href={page.url} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-foreground hover:underline truncate block">
                                                                        {page.url}
                                                                    </a>
                                                                )}
                                                            </div>
                                                            <div className="shrink-0 flex items-center gap-1.5 flex-wrap">
                                                                {(["pass", "fail", "partial", "na"] as CheckStatus[]).map((s) => (
                                                                    <button
                                                                        key={s}
                                                                        onClick={() => updateCheck(page.id, selectedCheck.id, s, result.severity)}
                                                                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-medium transition-all ${
                                                                            result.status === s
                                                                                ? s === "pass" ? "bg-green-500/20 border-green-500 text-green-800 dark:text-green-300"
                                                                                : s === "fail" ? "bg-red-500/20 border-red-500 text-red-800 dark:text-red-300"
                                                                                : s === "partial" ? "bg-amber-500/20 border-amber-500 text-amber-800 dark:text-amber-300"
                                                                                : "bg-zinc-500/20 border-zinc-400 text-zinc-700 dark:text-zinc-300"
                                                                                : "border-border hover:bg-accent/50 text-muted-foreground"
                                                                        }`}
                                                                    >
                                                                        {statusConfig[s].icon}
                                                                        {statusConfig[s].label}
                                                                    </button>
                                                                ))}
                                                                {(result.status === "fail" || result.status === "partial") && (
                                                                    <Select
                                                                        value={result.severity ?? ""}
                                                                        onValueChange={(v) => updateCheck(page.id, selectedCheck.id, result.status, v as Severity)}
                                                                    >
                                                                        <SelectTrigger className="h-7 text-xs w-28">
                                                                            <SelectValue placeholder="Severity..." />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {severityOptions.map((s) => (
                                                                                <SelectItem key={s} value={s} className="capitalize text-xs">{s}</SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {/* Row 2: notes */}
                                                        <div className="pl-7">
                                                            <Textarea
                                                                placeholder="Notes..."
                                                                value={draftNotes}
                                                                onChange={(e) => handleNotesChange(page.id, selectedCheck.id, e.target.value)}
                                                                className="text-xs min-h-[60px] resize-y"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Navigation */}
                                    <div className="flex justify-between pt-4 border-t border-border/30">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const idx = phaseChecks.findIndex((c) => c.id === selectedCheck.id);
                                                if (idx > 0) setSelectedCheckId(phaseChecks[idx - 1].id);
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
                                                    setSelectedCheckId(phaseChecks[idx + 1].id);
                                                } else {
                                                    const phaseIdx = PHASES.findIndex((p) => p.id === activePhase);
                                                    if (phaseIdx < PHASES.length - 1) setActivePhase(PHASES[phaseIdx + 1].id);
                                                }
                                            }}
                                        >
                                            {phaseChecks.findIndex((c) => c.id === selectedCheck.id) === phaseChecks.length - 1 ? "Next phase →" : "Next Check →"}
                                        </Button>
                                    </div>
                                </TabsContent>

                                {/* Tab 2: Tools */}
                                <TabsContent value="reference" className="mt-6 space-y-5">
                                    {selectedCheck.tool && (
                                        <div className="space-y-3">
                                            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                                <Wrench className="w-3.5 h-3.5" /> Recommended tools
                                            </div>
                                            <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
                                                {selectedCheck.tool.split("+").map((t, i) => (
                                                    <div key={i} className="px-5 py-4 flex gap-4 text-sm border-b border-border/30 last:border-0">
                                                        <span className="text-muted-foreground shrink-0 font-mono text-sm w-5 text-right mt-px">{i + 1}.</span>
                                                        <span className="leading-relaxed">{t.trim()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {selectedCheck.voiceOverTip && (
                                        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-3.5 py-2.5 flex gap-2">
                                            <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                            <p className="text-sm text-blue-900 dark:text-blue-200">
                                                <strong>VoiceOver:</strong> {selectedCheck.voiceOverTip}
                                            </p>
                                        </div>
                                    )}
                                    {!selectedCheck.tool && !selectedCheck.voiceOverTip && (
                                        <p className="text-sm text-muted-foreground">No tools listed for this check.</p>
                                    )}
                                </TabsContent>
                            </Tabs>

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
