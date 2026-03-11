"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Play,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  BarChart2,
  Trash2,
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

  useEffect(() => {
    if (!project) router.push("/layouts/a11y-audit");
  }, [project, router]);

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

  function handleDeletePage(pageId: string) {
    if (!project) return;
    if (!confirm("Remove this page from the audit?")) return;
    const updated = {
      ...project,
      pages: project.pages.filter((p) => p.id !== pageId),
    };
    saveProject(updated);
    setProject(updated);
  }

  if (!project) return null;

  const totalPct =
    project.pages.length === 0
      ? 0
      : Math.round(
        project.pages.reduce((sum, p) => sum + getPageProgress(p).pct, 0) /
        project.pages.length
      );

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/40/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => router.push("/layouts/a11y-audit")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-base font-semibold truncate">{project.clientName}</h1>
              <p className="text-xs text-muted-foreground truncate">{project.websiteUrl}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="secondary" className="text-xs hidden sm:flex">
              {project.conformanceTarget}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/layouts/a11y-audit/${projectId}/criteria`)}
            >
              <BarChart2 className="w-3.5 h-3.5 mr-1.5" />
              Batch Audit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/layouts/a11y-audit/${projectId}/findings`)}
            >
              <BarChart2 className="w-3.5 h-3.5 mr-1.5" />
              Findings
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Overall progress */}
        {project.pages.length > 0 && (
          <div className="rounded-xl border border-border/50 bg-card p-5 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Overall progress</span>
              <span className="text-muted-foreground">
                {project.pages.filter((p) => p.status === "complete").length}/
                {project.pages.length} pages complete
              </span>
            </div>
            <Progress value={totalPct} className="h-2" />
            <p className="text-xs text-muted-foreground">{totalPct}% of all checks completed</p>
          </div>
        )}

        {/* Pages */}
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold">Pages to audit</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add each page you need to audit. Typically: homepage, key landing pages, forms, and any page in a user journey.
            </p>
          </div>

          {project.pages.length > 0 && (
            <div className="divide-y divide-border/50 rounded-xl border border-border/50 overflow-hidden">
              {project.pages.map((page) => {
                const { done, total, pct } = getPageProgress(page);
                return (
                  <div
                    key={page.id}
                    className="flex items-center gap-4 px-4 py-3.5 bg-card hover:bg-accent/30 transition-colors group"
                  >
                    <div className="shrink-0">{statusIcon[page.status]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{page.name}</span>
                        <span className="text-xs text-muted-foreground hidden sm:block truncate">
                          {statusLabel[page.status]}
                        </span>
                      </div>
                      {page.url && (
                        <p className="text-xs text-muted-foreground truncate">{page.url}</p>
                      )}
                      <div className="mt-1.5 flex items-center gap-2">
                        <Progress value={pct} className="h-1 flex-1 max-w-[120px]" />
                        <span className="text-xs text-muted-foreground">
                          {done}/{total}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {page.url && (
                        <a
                          href={page.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeletePage(page.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant={page.status === "not-started" ? "default" : "outline"}
                        className="h-7 text-xs"
                        onClick={() =>
                          router.push(
                            `/layouts/a11y-audit/${projectId}/audit/${page.id}`
                          )
                        }
                      >
                        <Play className="w-3 h-3 mr-1" />
                        {page.status === "not-started"
                          ? "Start"
                          : page.status === "complete"
                            ? "Review"
                            : "Continue"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add page form */}
          <form onSubmit={handleAddPage} className="rounded-xl border border-dashed border-border p-4 space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Add a page
            </p>
            <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <Input
                placeholder="Page name (e.g. Homepage)"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                className="h-8 text-sm"
              />
              <Input
                placeholder="URL (optional)"
                value={pageUrl}
                onChange={(e) => setPageUrl(e.target.value)}
                className="h-8 text-sm"
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
