"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError(true);
      setPassword("");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100">
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">
            Design Sandbox
          </span>
          <h1 className="text-2xl font-semibold text-stone-800">Enter password</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-72">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="rounded-md border border-stone-300 bg-white px-4 py-3 text-[15px] text-stone-800 outline-none placeholder:text-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-200"
          />

          {error && (
            <p className="text-center text-[13px] text-red-500">
              Wrong password. Try again.
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="rounded-md bg-stone-800 py-3 text-[15px] font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            {loading ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
