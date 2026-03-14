"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  BarChart2,
  Trash2,
  Pencil,
  Check,
  X,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  getProject,
  saveProject,
  createPage,
  getPageProgress,
  getChecksForTarget,
} from "@/lib/audit-storage";
import type { AuditProject } from "@/lib/audit-types";

interface Props {
  projectId: string;
}

const statusIcon = {
  "not-started": <Circle className="w-4 h-4 text-muted-foreground" />,
  "in-progress": <Clock className="w-4 h-4 text-amber-500" />,
  complete: <CheckCircle2 className="w-4 h-4 text-green-500" />,
};

const statusLabel = {
  "not-started": "Not started",
  "in-progress": "In progress",
  complete: "Complete",
};

export function ProjectOverview({ projectId }: Props) {
  const router = useRouter();
  const [project, setProject] = useState<AuditProject | null>(() =>
    typeof window !== "undefined" ? (getProject(projectId) ?? null) : null
  );
  const [pageName, setPageName] = useState("");
  const [pageUrl, setPageUrl] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // Inline edit state
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");

  useEffect(() => {
    if (!project) router.push("/layouts/a11y-audit");
  }, [project, router]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleAddPage(e: React.FormEvent) {
    e.preventDefault();
    if (!project || !pageName.trim()) return;
    const updated = {
      ...project,
      pages: [...project.pages, createPage(pageName.trim(), pageUrl.trim())],
    };
    saveProject(updated);
    setProject(updated);
    setPageName("");
    setPageUrl("");
  }

  function handleDeletePage(pageId: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!project) return;
    if (!confirm("Remove this page from the audit?")) return;
    const updated = {
      ...project,
      pages: project.pages.filter((p) => p.id !== pageId),
    };
    saveProject(updated);
    setProject(updated);
  }

  function startEdit(page: { id: string; name: string; url: string }, e: React.MouseEvent) {
    e.stopPropagation();
    setEditingPageId(page.id);
    setEditName(page.name);
    setEditUrl(page.url);
  }

  function commitEdit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!project || !editingPageId || !editName.trim()) return;
    const updated = {
      ...project,
      pages: project.pages.map((p) =>
        p.id === editingPageId
          ? { ...p, name: editName.trim(), url: editUrl.trim() }
          : p
      ),
    };
    saveProject(updated);
    setProject(updated);
    setEditingPageId(null);
  }

  function cancelEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setEditingPageId(null);
  }

  if (!project) return null;

  // Criteria-based progress: total = unique criteria, done = criteria where all pages are non-pending
  const projectChecks = getChecksForTarget(project.conformanceTarget);
  const totalCriteria = projectChecks.length;
  const doneCriteria = projectChecks.filter((check) =>
    project.pages.length > 0 &&
    project.pages.every(
      (page) => page.checks.find((r) => r.checkId === check.id)?.status !== "pending"
    )
  ).length;
  const totalPct = totalCriteria > 0 ? Math.round((doneCriteria / totalCriteria) * 100) : 0;

  // Audit CTA
  const anyStarted = project.pages.some((p) => p.status !== "not-started");
  const allComplete = project.pages.length > 0 && project.pages.every((p) => p.status === "complete");
  const auditLabel = allComplete ? "Review Audit" : anyStarted ? "Continue Audit" : "Start Audit";

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header — white at rest, glass on scroll */}
      <div
        className={`border-b border-border/50 sticky top-0 z-10 transition-colors duration-200 ${
          scrolled ? "bg-background/80 backdrop-blur-sm" : "bg-background"
        }`}
      >
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => router.push("/layouts/a11y-audit")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-semibold truncate">{project.clientName}</h1>
            <p className="text-xs text-muted-foreground truncate">{project.websiteUrl}</p>
          </div>
          <Badge variant="secondary" className="text-xs shrink-0 hidden sm:flex">
            {project.conformanceTarget}
          </Badge>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Overall progress */}
        {project.pages.length > 0 && (
          <div className="rounded-xl border border-border/50 bg-card p-5 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Overall progress</span>
              <button
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                onClick={() => router.push(`/layouts/a11y-audit/${projectId}/findings`)}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                View findings
              </button>
            </div>
            <Progress value={totalPct} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {doneCriteria}/{totalCriteria} criteria complete · {totalPct}%
            </p>
          </div>
        )}

        {/* Pages */}
        <div className="space-y-4">
          {/* Section header + single audit CTA */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold">Pages to audit</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add each page you need to audit.
              </p>
            </div>

            {project.pages.length > 0 && (
              <Button
                size="sm"
                className="h-8 text-xs shrink-0"
                onClick={() => router.push(`/layouts/a11y-audit/${projectId}/criteria`)}
              >
                <FileText className="w-3.5 h-3.5 mr-1.5" />
                {auditLabel}
              </Button>
            )}
          </div>

          {project.pages.length > 0 && (
            <div className="divide-y divide-border/50 rounded-xl border border-border/50 overflow-hidden">
              {project.pages.map((page) => {
                const { done, total, pct } = getPageProgress(page);
                const isEditing = editingPageId === page.id;

                return (
                  <div
                    key={page.id}
                    className={`flex items-center gap-3 px-4 py-3 bg-card transition-colors group ${
                      isEditing ? "" : "hover:bg-accent/30 cursor-pointer"
                    }`}
                    onClick={() => {
                      if (!isEditing)
                        router.push(`/layouts/a11y-audit/${projectId}/audit/${page.id}`);
                    }}
                  >
                    <div className="shrink-0">{statusIcon[page.status]}</div>

                    {isEditing ? (
                      /* Inline edit form */
                      <form
                        className="flex-1 flex items-center gap-2 min-w-0"
                        onSubmit={commitEdit}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Input
                          autoFocus
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Page name"
                          className="h-7 text-sm flex-1 bg-white dark:bg-background"
                        />
                        <Input
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                          placeholder="URL (optional)"
                          className="h-7 text-sm flex-1 bg-white dark:bg-background"
                        />
                        <Button type="submit" size="icon" variant="ghost" className="h-7 w-7 text-green-600">
                          <Check className="w-3.5 h-3.5" />
                        </Button>
                        <Button type="button" size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" onClick={cancelEdit}>
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </form>
                    ) : (
                      <>
                        {/* Name + status */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">{page.name}</span>
                            <span className="text-xs text-muted-foreground hidden sm:block">
                              {statusLabel[page.status]}
                            </span>
                          </div>
                          {page.url && (
                            <p className="text-xs text-muted-foreground truncate">{page.url}</p>
                          )}
                        </div>

                        {/* Progress — always visible */}
                        <div className="flex items-center gap-2 shrink-0">
                          <Progress value={pct} className="h-1 w-20 hidden sm:block" />
                          <span className="text-xs text-muted-foreground tabular-nums w-12 text-right">
                            {done}/{total}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {page.url && (
                            <a
                              href={page.url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={(e) => startEdit(page, e)}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={(e) => handleDeletePage(page.id, e)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Add page form */}
          <form
            onSubmit={handleAddPage}
            className="rounded-xl border border-dashed border-border p-4 space-y-3"
          >
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Add a page
            </p>
            <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <Input
                placeholder="Page name (e.g. Homepage)"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                className="h-8 text-sm bg-white dark:bg-background"
              />
              <Input
                placeholder="URL (optional)"
                value={pageUrl}
                onChange={(e) => setPageUrl(e.target.value)}
                className="h-8 text-sm bg-white dark:bg-background"
              />
              <Button type="submit" size="sm" className="h-8" disabled={!pageName.trim()}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add
              </Button>
            </div>
          </form>
        </div>

        {/* Auditor info */}
        <div className="text-xs text-muted-foreground border-t border-border/50 pt-4 flex gap-4">
          <span>Auditor: {project.auditorName}</span>
          <span>Date: {project.auditDate}</span>
        </div>
      </div>
    </div>
  );
}
