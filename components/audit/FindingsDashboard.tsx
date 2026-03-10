"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, MinusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getProject, getFindings, getPageProgress } from "@/lib/audit-storage";
import { ALL_CHECKS, PHASES } from "@/lib/audit-checks";
import type { AuditProject } from "@/lib/audit-types";

interface Props {
  projectId: string;
}

const severityConfig = {
  critical: { label: "Critical", className: "bg-red-500/10 text-red-600 border-red-500/20" },
  high: { label: "High", className: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  medium: { label: "Medium", className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  low: { label: "Low", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
};

export function FindingsDashboard({ projectId }: Props) {
  const router = useRouter();
  const [project] = useState<AuditProject | null>(() =>
    typeof window !== "undefined" ? (getProject(projectId) ?? null) : null
  );

  useEffect(() => {
    if (!project) router.push("/layouts/a11y-audit");
  }, [project, router]);

  if (!project) return null;

  const findings = getFindings(project);
  const allChecks = project.pages.flatMap((p) => p.checks);
  const passed = allChecks.filter((c) => c.status === "pass").length;
  const failed = allChecks.filter((c) => c.status === "fail").length;
  const partial = allChecks.filter((c) => c.status === "partial").length;
  const na = allChecks.filter((c) => c.status === "na").length;
  const pending = allChecks.filter((c) => c.status === "pending").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => router.push(`/layouts/a11y-audit/${projectId}`)}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-base font-semibold">Findings — {project.clientName}</h1>
            <p className="text-xs text-muted-foreground">
              {project.auditDate} · {project.conformanceTarget}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Score cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { icon: <CheckCircle2 className="w-4 h-4 text-green-500" />, label: "Pass", count: passed, className: "border-green-500/20" },
            { icon: <XCircle className="w-4 h-4 text-red-500" />, label: "Fail", count: failed, className: "border-red-500/20" },
            { icon: <AlertCircle className="w-4 h-4 text-amber-500" />, label: "Partial", count: partial, className: "border-amber-500/20" },
            { icon: <MinusCircle className="w-4 h-4 text-muted-foreground" />, label: "N/A", count: na, className: "" },
            { icon: <MinusCircle className="w-4 h-4 text-muted-foreground" />, label: "Pending", count: pending, className: "" },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-xl border bg-card p-4 text-center ${item.className}`}
            >
              <div className="flex justify-center mb-1.5">{item.icon}</div>
              <div className="text-2xl font-bold">{item.count}</div>
              <div className="text-xs text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Per-page breakdown */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Pages</h2>
          <div className="divide-y divide-border/50 rounded-xl border border-border/50 overflow-hidden">
            {project.pages.map((page) => {
              const { done, total, pct } = getPageProgress(page);
              const pageFails = page.checks.filter(
                (c) => c.status === "fail" || c.status === "partial"
              ).length;
              return (
                <div
                  key={page.id}
                  className="flex items-center gap-4 px-4 py-3 bg-card hover:bg-accent/30 transition-colors cursor-pointer"
                  onClick={() =>
                    router.push(`/layouts/a11y-audit/${projectId}/audit/${page.id}`)
                  }
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{page.name}</p>
                    {page.url && (
                      <p className="text-xs text-muted-foreground truncate">{page.url}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {pageFails > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {pageFails} issue{pageFails !== 1 ? "s" : ""}
                      </Badge>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Progress value={pct} className="w-16 h-1.5" />
                      <span>{done}/{total}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Phase completion */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">By phase</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PHASES.map((phase) => {
              const phaseChecks = project.pages.flatMap((p) =>
                p.checks.filter((c) => {
                  const def = ALL_CHECKS.find((ac) => ac.id === c.checkId);
                  return def?.phase === phase.id;
                })
              );
              const phaseDone = phaseChecks.filter((c) => c.status !== "pending").length;
              const phasePct = phaseChecks.length > 0
                ? Math.round((phaseDone / phaseChecks.length) * 100)
                : 0;
              const phaseFails = phaseChecks.filter(
                (c) => c.status === "fail" || c.status === "partial"
              ).length;
              return (
                <div key={phase.id} className="rounded-xl border border-border/50 bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{phase.emoji}</span>
                      <span className="text-sm font-medium">{phase.label}</span>
                    </div>
                    {phaseFails > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {phaseFails}
                      </Badge>
                    )}
                  </div>
                  <Progress value={phasePct} className="h-1.5" />
                  <p className="text-xs text-muted-foreground">{phaseDone}/{phaseChecks.length} checks done</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Findings list */}
        {findings.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold">Issues found ({findings.length})</h2>
            <div className="space-y-2">
              {findings.map(({ page, check, checkDef }) => (
                <div
                  key={`${page.id}-${check.checkId}`}
                  className="rounded-xl border border-border/50 bg-card p-4 space-y-2 cursor-pointer hover:border-primary/30 transition-colors"
                  onClick={() =>
                    router.push(`/layouts/a11y-audit/${projectId}/audit/${page.id}`)
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{checkDef.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {page.name} · WCAG {checkDef.wcag}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {check.severity && (
                        <Badge
                          variant="outline"
                          className={`text-xs ${severityConfig[check.severity].className}`}
                        >
                          {severityConfig[check.severity].label}
                        </Badge>
                      )}
                      <Badge
                        variant={check.status === "fail" ? "destructive" : "outline"}
                        className="text-xs"
                      >
                        {check.status === "partial" ? "Partial" : "Fail"}
                      </Badge>
                    </div>
                  </div>
                  {check.notes && (
                    <p className="text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
                      {check.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {findings.length === 0 && allChecks.every((c) => c.status !== "pending") && (
          <div className="text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-1">No issues found</h3>
            <p className="text-sm text-muted-foreground">
              All checks passed or marked N/A. Excellent work!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
