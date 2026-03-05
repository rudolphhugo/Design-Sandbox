"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Plus,
  Check,
  RotateCcw,
  Inbox,
  Sun,
  Calendar,
  CheckCheck,
  AlertCircle,
  X,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type ViewId = "inbox" | "today" | "upcoming" | "done";

interface Task {
  id: string;
  title: string;
  dueDate: string; // ISO date string YYYY-MM-DD
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function isOverdue(task: Task): boolean {
  return !task.completed && task.dueDate < todayStr();
}

function isToday(task: Task): boolean {
  return !task.completed && task.dueDate === todayStr();
}

function isUpcoming(task: Task): boolean {
  return !task.completed && task.dueDate > todayStr();
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (dateStr === todayStr()) return "Idag";
  if (date.getTime() === tomorrow.getTime()) return "Imorgon";
  if (date.getTime() === yesterday.getTime()) return "Igår";

  return date.toLocaleDateString("sv-SE", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function daysUntil(dateStr: string): number {
  const today = new Date(todayStr() + "T12:00:00");
  const due = new Date(dateStr + "T12:00:00");
  return Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.dueDate < b.dueDate) return -1;
    if (a.dueDate > b.dueDate) return 1;
    return a.createdAt.localeCompare(b.createdAt);
  });
}

// ─── Seed data ───────────────────────────────────────────────────────────────

const today = todayStr();
const yesterday = new Date(new Date(today).getTime() - 86400000)
  .toISOString()
  .split("T")[0];
const tomorrow = new Date(new Date(today).getTime() + 86400000)
  .toISOString()
  .split("T")[0];
const nextWeek = new Date(new Date(today).getTime() + 7 * 86400000)
  .toISOString()
  .split("T")[0];
const in3Days = new Date(new Date(today).getTime() + 3 * 86400000)
  .toISOString()
  .split("T")[0];

const SEED_TASKS: Task[] = [
  {
    id: "1",
    title: "Skicka in offerten till kunden",
    dueDate: yesterday,
    completed: false,
    createdAt: "2026-03-01T08:00:00Z",
  },
  {
    id: "2",
    title: "Boka tandläkartid",
    dueDate: yesterday,
    completed: false,
    createdAt: "2026-03-02T09:00:00Z",
  },
  {
    id: "3",
    title: "Stäm av projektstatus med teamet",
    dueDate: today,
    completed: false,
    createdAt: "2026-03-03T10:00:00Z",
  },
  {
    id: "4",
    title: "Köp present till mammas födelsedag",
    dueDate: today,
    completed: false,
    createdAt: "2026-03-03T11:00:00Z",
  },
  {
    id: "5",
    title: "Läs igenom designspecen",
    dueDate: tomorrow,
    completed: false,
    createdAt: "2026-03-04T08:00:00Z",
  },
  {
    id: "6",
    title: "Lämna in kvartalsrapporten",
    dueDate: in3Days,
    completed: false,
    createdAt: "2026-03-04T09:00:00Z",
  },
  {
    id: "7",
    title: "Förbereda presentation för styrelsemötet",
    dueDate: nextWeek,
    completed: false,
    createdAt: "2026-03-04T10:00:00Z",
  },
  {
    id: "8",
    title: "Svara på mejl från Jonas",
    dueDate: today,
    completed: true,
    completedAt: "2026-03-05T07:30:00Z",
    createdAt: "2026-03-03T12:00:00Z",
  },
];

// ─── Nav items ───────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: ViewId; label: string; icon: React.ReactNode }[] = [
  { id: "inbox", label: "Inbox", icon: <Inbox size={16} /> },
  { id: "today", label: "Idag", icon: <Sun size={16} /> },
  { id: "upcoming", label: "Kommande", icon: <Calendar size={16} /> },
  { id: "done", label: "Klart", icon: <CheckCheck size={16} /> },
];

// ─── Task Row ─────────────────────────────────────────────────────────────────

function TaskRow({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: (id: string) => void;
}) {
  const overdue = isOverdue(task);
  const today = isToday(task);
  const days = daysUntil(task.dueDate);

  return (
    <div
      className={cn(
        "group flex items-start gap-3 px-4 py-3 rounded-xl transition-all duration-150",
        task.completed
          ? "opacity-60"
          : overdue
          ? "bg-red-50/60 hover:bg-red-50"
          : "hover:bg-neutral-50"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          "mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150",
          task.completed
            ? "bg-emerald-500 border-emerald-500"
            : overdue
            ? "border-red-300 hover:border-red-400 hover:bg-red-50"
            : today
            ? "border-amber-400 hover:border-amber-500 hover:bg-amber-50"
            : "border-neutral-300 hover:border-neutral-400 hover:bg-neutral-100"
        )}
      >
        {task.completed && <Check size={11} strokeWidth={3} className="text-white" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium leading-snug",
            task.completed
              ? "line-through text-neutral-400"
              : "text-neutral-800"
          )}
        >
          {task.title}
        </p>

        {/* Due date badge */}
        <div className="flex items-center gap-1 mt-1">
          {overdue && (
            <AlertCircle size={11} className="text-red-400 flex-shrink-0" />
          )}
          <span
            className={cn(
              "text-xs",
              task.completed
                ? "text-neutral-400"
                : overdue
                ? "text-red-500 font-medium"
                : today
                ? "text-amber-600 font-medium"
                : "text-neutral-400"
            )}
          >
            {formatDate(task.dueDate)}
            {overdue && days < 0 && (
              <span className="ml-1">
                ({Math.abs(days)} dag{Math.abs(days) !== 1 ? "ar" : ""} sen)
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Undo button for completed tasks */}
      {task.completed && (
        <button
          onClick={() => onToggle(task.id)}
          className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600 transition-all duration-150 flex-shrink-0"
        >
          <RotateCcw size={11} />
          <span>Ångra</span>
        </button>
      )}
    </div>
  );
}

// ─── Add Task Form ────────────────────────────────────────────────────────────

function AddTaskForm({
  onAdd,
  onClose,
}: {
  onAdd: (title: string, dueDate: string) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(todayStr());
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Ange en titel");
      return;
    }
    if (!dueDate) {
      setError("Välj ett slutdatum");
      return;
    }
    onAdd(title.trim(), dueDate);
    setTitle("");
    setDueDate(todayStr());
    setError("");
    onClose();
  }

  function handleCancel() {
    setTitle("");
    setDueDate(todayStr());
    setError("");
    onClose();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-0 px-4 py-3 rounded-xl border border-neutral-200 bg-white shadow-sm"
    >
      <input
        autoFocus
        type="text"
        placeholder="Uppgiftens titel..."
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setError("");
        }}
        className="w-full text-sm font-medium text-neutral-800 placeholder:text-neutral-300 outline-none bg-transparent"
      />

      <div className="flex items-center gap-2 mt-3">
        <div className="flex items-center gap-1.5 flex-1">
          <Calendar size={13} className="text-neutral-400" />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="text-xs text-neutral-600 outline-none bg-transparent cursor-pointer"
          />
        </div>

        {error && (
          <span className="text-xs text-red-500">{error}</span>
        )}

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCancel}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            <X size={13} />
          </button>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-700 transition-colors"
          >
            Spara
          </button>
        </div>
      </div>
    </form>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ view }: { view: ViewId }) {
  const messages: Record<ViewId, { emoji: string; title: string; sub: string }> = {
    inbox: {
      emoji: "📭",
      title: "Inboxen är tom",
      sub: "Lägg till en ny uppgift för att komma igång.",
    },
    today: {
      emoji: "🌤",
      title: "Inget för idag",
      sub: "Du är ajour! Inga uppgifter är planerade för idag.",
    },
    upcoming: {
      emoji: "📅",
      title: "Inga kommande uppgifter",
      sub: "Planera framtida uppgifter och håll koll på deadlines.",
    },
    done: {
      emoji: "✨",
      title: "Inget klart ännu",
      sub: "Slutförda uppgifter visas här.",
    },
  };

  const msg = messages[view];

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-4xl mb-4">{msg.emoji}</span>
      <p className="text-sm font-medium text-neutral-600 mb-1">{msg.title}</p>
      <p className="text-xs text-neutral-400 max-w-[220px]">{msg.sub}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS);
  const [activeView, setActiveView] = useState<ViewId>("today");
  const [addFormOpen, setAddFormOpen] = useState(false);

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? new Date().toISOString() : undefined,
            }
          : t
      )
    );
  }

  function addTask(title: string, dueDate: string) {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
  }

  // ── Filtered + sorted views ──

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const viewTasks = (() => {
    switch (activeView) {
      case "inbox":
        return sortTasks(activeTasks);
      case "today":
        return sortTasks(activeTasks.filter((t) => isToday(t) || isOverdue(t)));
      case "upcoming":
        return sortTasks(activeTasks.filter((t) => isUpcoming(t)));
      case "done":
        return [...completedTasks].sort((a, b) =>
          (b.completedAt ?? "").localeCompare(a.completedAt ?? "")
        );
    }
  })();

  // ── Badge counts ──

  const counts: Record<ViewId, number> = {
    inbox: activeTasks.length,
    today: activeTasks.filter((t) => isToday(t) || isOverdue(t)).length,
    upcoming: activeTasks.filter((t) => isUpcoming(t)).length,
    done: completedTasks.length,
  };

  const overdueCount = activeTasks.filter(isOverdue).length;

  // ── View titles ──

  const viewTitle: Record<ViewId, string> = {
    inbox: "Inbox",
    today: "Idag",
    upcoming: "Kommande",
    done: "Klart",
  };

  const viewSubtitle: Record<ViewId, string> = {
    inbox: "Alla aktiva uppgifter",
    today: `${new Date().toLocaleDateString("sv-SE", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })}`,
    upcoming: "Framtida uppgifter sorterade efter datum",
    done: "Slutförda uppgifter",
  };

  return (
    <div className="flex h-screen w-full bg-neutral-50 font-sans">
      {/* ── Sidebar ── */}
      <aside className="w-56 flex-shrink-0 bg-white border-r border-neutral-100 flex flex-col py-6">
        {/* Logo */}
        <div className="px-5 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center">
              <CheckCheck size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-neutral-800 tracking-tight">
              ToDo
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = activeView === item.id;
            const count = counts[item.id];

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                  active
                    ? "bg-neutral-100 text-neutral-900 font-medium"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
                )}
              >
                <span
                  className={cn(
                    "transition-colors",
                    active ? "text-neutral-700" : "text-neutral-400"
                  )}
                >
                  {item.icon}
                </span>
                <span className="flex-1 text-left">{item.label}</span>
                {count > 0 && (
                  <span
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded-md font-medium",
                      item.id === "today" && overdueCount > 0 && activeView !== "today"
                        ? "bg-red-100 text-red-600"
                        : active
                        ? "bg-neutral-200 text-neutral-600"
                        : "bg-neutral-100 text-neutral-400"
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Ny uppgift-knapp */}
        <div className="px-3 mb-4">
          <button
            onClick={() => setAddFormOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#3c3c3c] hover:bg-[#2a2a2a] text-white text-sm transition-colors duration-150"
          >
            <span className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
              <Plus size={11} strokeWidth={2.5} />
            </span>
            <span>Ny uppgift</span>
          </button>
        </div>

        {/* Footer stats */}
        <div className="px-5 pt-4 border-t border-neutral-100">
          <p className="text-xs text-neutral-400">
            {activeTasks.length} aktiva uppgifter
          </p>
          {overdueCount > 0 && (
            <p className="text-xs text-red-400 mt-0.5 flex items-center gap-1">
              <AlertCircle size={10} />
              {overdueCount} försenad{overdueCount !== 1 ? "e" : ""}
            </p>
          )}
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="px-8 pt-8 pb-4 flex-shrink-0">
          <h1 className="text-xl font-semibold text-neutral-900">
            {viewTitle[activeView]}
          </h1>
          <p className="text-sm text-neutral-400 mt-0.5 capitalize">
            {viewSubtitle[activeView]}
          </p>
        </header>

        {/* Overdue banner (today view) */}
        {activeView === "today" && overdueCount > 0 && (
          <div className="mx-8 mb-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2">
            <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
            <p className="text-xs text-red-600 font-medium">
              {overdueCount} forsenad{overdueCount !== 1 ? "e" : ""} uppgift
              {overdueCount !== 1 ? "er" : ""} — ta tag i dem forst!
            </p>
          </div>
        )}

        {/* Task list */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          {viewTasks.length === 0 ? (
            <EmptyState view={activeView} />
          ) : (
            <div className="space-y-0.5">
              {/* Section: Overdue (only in today/inbox) */}
              {(activeView === "today" || activeView === "inbox") &&
                viewTasks.some(isOverdue) && (
                  <>
                    <div className="flex items-center gap-2 px-4 pt-2 pb-1">
                      <AlertCircle size={11} className="text-red-400" />
                      <span className="text-xs font-medium text-red-500 uppercase tracking-wide">
                        Forsenade
                      </span>
                    </div>
                    {viewTasks
                      .filter(isOverdue)
                      .map((task) => (
                        <TaskRow key={task.id} task={task} onToggle={toggleTask} />
                      ))}

                    {viewTasks.some(
                      (t) => !isOverdue(t) && !t.completed
                    ) && (
                      <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                        <Sun size={11} className="text-amber-400" />
                        <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">
                          Idag
                        </span>
                      </div>
                    )}
                    {viewTasks
                      .filter((t) => !isOverdue(t) && !t.completed)
                      .map((task) => (
                        <TaskRow key={task.id} task={task} onToggle={toggleTask} />
                      ))}
                  </>
                )}

              {/* No overdue — just render all tasks */}
              {!(
                (activeView === "today" || activeView === "inbox") &&
                viewTasks.some(isOverdue)
              ) &&
                viewTasks.map((task) => (
                  <TaskRow key={task.id} task={task} onToggle={toggleTask} />
                ))}
            </div>
          )}

          {/* Add task form (not on done view) */}
          {activeView !== "done" && addFormOpen && (
            <div className="mt-3">
              <AddTaskForm onAdd={addTask} onClose={() => setAddFormOpen(false)} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
