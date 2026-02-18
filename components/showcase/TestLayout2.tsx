"use client";

export function TestLayout2() {
  return (
    <div className="flex flex-col h-screen">
      <header className="h-16 bg-white border-b flex items-center px-6">
        <h2 className="text-lg font-semibold">Top Nav Layout</h2>
        <nav className="ml-8 flex gap-4 text-sm text-zinc-500">
          <span className="text-zinc-900 font-medium">Home</span>
          <span className="hover:text-zinc-700 cursor-pointer">Products</span>
          <span className="hover:text-zinc-700 cursor-pointer">About</span>
        </nav>
      </header>
      <main className="flex-1 bg-zinc-50 p-8">
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Test Layout 2</h1>
        <p className="text-zinc-500">Top nav + content layout</p>
      </main>
    </div>
  );
}
