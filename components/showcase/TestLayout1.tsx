"use client";

export function TestLayout1() {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-zinc-900 text-white p-6">
        <h2 className="text-lg font-semibold mb-4">Sidebar</h2>
        <nav className="space-y-2">
          <div className="px-3 py-2 rounded bg-white/10">Dashboard</div>
          <div className="px-3 py-2 rounded hover:bg-white/5">Analytics</div>
          <div className="px-3 py-2 rounded hover:bg-white/5">Settings</div>
        </nav>
      </aside>
      <main className="flex-1 bg-zinc-50 p-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Test Layout 1</h1>
        <p className="text-zinc-500">Sidebar + content layout</p>
      </main>
    </div>
  );
}
