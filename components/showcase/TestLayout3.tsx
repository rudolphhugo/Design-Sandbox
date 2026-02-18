"use client";

export function TestLayout3() {
  return (
    <div className="flex flex-col h-screen">
      <header className="h-16 bg-zinc-900 text-white flex items-center px-6">
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </header>
      <div className="flex flex-1">
        <aside className="w-56 bg-zinc-800 text-white p-4">
          <nav className="space-y-1 text-sm">
            <div className="px-3 py-2 rounded bg-white/10">Overview</div>
            <div className="px-3 py-2 rounded hover:bg-white/5">Reports</div>
            <div className="px-3 py-2 rounded hover:bg-white/5">Users</div>
          </nav>
        </aside>
        <main className="flex-1 bg-zinc-50 p-8">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Test Layout 3</h1>
          <p className="text-zinc-500">Top nav + sidebar + content layout</p>
        </main>
      </div>
    </div>
  );
}
