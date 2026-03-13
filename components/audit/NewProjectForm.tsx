"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveProject } from "@/lib/audit-storage";
import type { ConformanceTarget } from "@/lib/audit-types";

export function NewProjectForm() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({
    clientName: "",
    websiteUrl: "",
    conformanceTarget: "EN 301 549" as ConformanceTarget,
    auditorName: "",
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const project = {
      id: crypto.randomUUID(),
      ...form,
      auditDate: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
      pages: [],
    };
    saveProject(project);
    router.push(`/layouts/a11y-audit/${project.id}`);
  }

  const conformanceInfo: Record<ConformanceTarget, string> = {
    "EN 301 549":
      "EU standard required for public sector websites under the Web Accessibility Directive. Harmonised with WCAG 2.1 AA + extra requirements for media, forms, and documentation.",
    "WCAG 2.1 AA":
      "The global standard for web accessibility. Level AA is the widely accepted target for commercial and public websites.",
    "WCAG 2.1 AAA":
      "The highest WCAG 2.1 conformance level. Not recommended as a blanket target — some AAA criteria cannot be met for all content types. Best used for specific high-priority pages or components.",
    "WCAG 2.2 AA":
      "Latest WCAG version (2023). Adds improved focus visibility, touch target sizing, and redundant entry rules over WCAG 2.1.",
    "WCAG 2.2 AAA":
      "Highest conformance level for the latest WCAG version. Exceptionally demanding — typically only targeted for specialised services (e.g. services for users with severe disabilities).",
  };

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <div className={`border-b border-border/50 sticky top-0 z-10 transition-colors duration-200 ${scrolled ? "bg-background/80 backdrop-blur-sm" : "bg-background"}`}>
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => router.push("/layouts/a11y-audit")}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <h1 className="text-base font-semibold">New audit project</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Client info */}
          <div className="space-y-5">
            <div>
              <h2 className="text-sm font-semibold mb-0.5">Client information</h2>
              <p className="text-xs text-muted-foreground">
                Basic details about the client and the website you are auditing.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="clientName">
                  Client name
                </label>
                <Input
                  id="clientName"
                  placeholder="e.g. Nilsson & Partners AB"
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  required
                  className="bg-white dark:bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="websiteUrl">
                  Website URL
                </label>
                <Input
                  id="websiteUrl"
                  placeholder="example.se"
                  value={form.websiteUrl}
                  onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                  onBlur={(e) => {
                    const val = e.target.value.trim();
                    if (val && !/^https?:\/\//i.test(val)) {
                      setForm((f) => ({ ...f, websiteUrl: `https://${val}` }));
                    }
                  }}
                  required
                  className="bg-white dark:bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium" htmlFor="auditorName">
                  Your name
                </label>
                <Input
                  id="auditorName"
                  placeholder="Your name (for the report)"
                  value={form.auditorName}
                  onChange={(e) => setForm({ ...form, auditorName: e.target.value })}
                  required
                  className="bg-white dark:bg-background"
                />
              </div>
            </div>
          </div>

          {/* Conformance */}
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold mb-0.5">Conformance target</h2>
              <p className="text-xs text-muted-foreground">
                The accessibility standard you are auditing against.
              </p>
            </div>

            <Select
              value={form.conformanceTarget}
              onValueChange={(v) =>
                setForm({ ...form, conformanceTarget: v as ConformanceTarget })
              }
            >
              <SelectTrigger className="bg-white dark:bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EN 301 549">EN 301 549</SelectItem>
                <SelectItem value="WCAG 2.1 AA">WCAG 2.1 AA</SelectItem>
                <SelectItem value="WCAG 2.1 AAA">WCAG 2.1 AAA</SelectItem>
                <SelectItem value="WCAG 2.2 AA">WCAG 2.2 AA</SelectItem>
                <SelectItem value="WCAG 2.2 AAA">WCAG 2.2 AAA</SelectItem>
              </SelectContent>
            </Select>

            <div className="rounded-lg bg-muted/50 border border-border/50 p-4 text-sm text-muted-foreground">
              {conformanceInfo[form.conformanceTarget]}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Create project and add pages
          </Button>
        </form>
      </div>
    </div>
  );
}
