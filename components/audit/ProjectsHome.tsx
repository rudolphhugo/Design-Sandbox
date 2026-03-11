"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ShieldCheck, Calendar, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getProjects, deleteProject, getPageProgress } from "@/lib/audit-storage";
import type { AuditProject } from "@/lib/audit-types";

export function ProjectsHome() {
  const router = useRouter();
  const [projects, setProjects] = useState<AuditProject[]>(() =>
    typeof window !== "undefined" ? getProjects() : []
  );

  function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm("Delete this audit project? This cannot be undone.")) {
      deleteProject(id);
      setProjects(getProjects());
    }
  }

  function overallProgress(project: AuditProject) {
    if (project.pages.length === 0) return 0;
    const total = project.pages.reduce(
      (sum, p) => sum + getPageProgress(p).pct,
      0
    );
    return Math.round(total / project.pages.length);
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/40/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-semibold">A11y Audit</h1>
              <p className="text-xs text-muted-foreground">Accessibility audit tool — EN 301 549 / WCAG 2.1 AA</p>
            </div>
          </div>
          <Button onClick={() => router.push("/layouts/a11y-audit/new")} size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            New project
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {projects.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
              <ShieldCheck className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold mb-2">No audit projects yet</h2>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              Create a new project to start a guided accessibility audit for a client website.
            </p>
            <Button onClick={() => router.push("/layouts/a11y-audit/new")}>
              <Plus className="w-4 h-4 mr-1.5" />
              Create first project
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((project) => {
              const pct = overallProgress(project);
              const completedPages = project.pages.filter(
                (p) => p.status === "complete"
              ).length;
              return (
                <Card
                  key={project.id}
                  className="cursor-pointer hover:border-primary/40 transition-colors group"
                  onClick={() => router.push(`/layouts/a11y-audit/${project.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base">{project.clientName}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5 break-all">
                          {project.websiteUrl}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0"
                        onClick={(e) => handleDelete(project.id, e)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {project.conformanceTarget}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {project.auditDate}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <FileText className="w-3 h-3" />
                        {project.pages.length} page{project.pages.length !== 1 ? "s" : ""}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          {completedPages}/{project.pages.length} pages complete
                        </span>
                        <span>{pct}%</span>
                      </div>
                      <Progress value={pct} className="h-1.5" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
