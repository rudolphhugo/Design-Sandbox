"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function FadeInBasics() {
  const [isVisible, setIsVisible] = useState(true);
  const [duration, setDuration] = useState(0.5);
  const [delay, setDelay] = useState(0);

  return (
    <div className="space-y-10">
      {/* Explanation */}
      <section className="max-w-2xl space-y-4">
        <h3 className="text-lg font-semibold">What is a Fade In?</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          A fade in transitions an element from invisible (<code className="bg-muted px-1.5 py-0.5 rounded text-xs">opacity: 0</code>) to visible (<code className="bg-muted px-1.5 py-0.5 rounded text-xs">opacity: 1</code>).
          In Motion (Framer Motion), you define the <strong>initial</strong> state
          and the <strong>animate</strong> target — the library handles the transition between them.
        </p>

        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs font-mono text-muted-foreground mb-2">The core concept:</p>
          <pre className="text-sm font-mono">
{`<motion.div
  initial={{ opacity: 0 }}    // start invisible
  animate={{ opacity: 1 }}    // end visible
  transition={{ duration: 0.5 }}
/>`}
          </pre>
        </div>
      </section>

      {/* Controls */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Play with it</h3>

        <div className="flex flex-wrap gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Duration: <span className="text-primary">{duration}s</span>
            </label>
            <input
              type="range"
              min={0.1}
              max={2}
              step={0.1}
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              className="w-48 accent-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Delay: <span className="text-primary">{delay}s</span>
            </label>
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={delay}
              onChange={(e) => setDelay(parseFloat(e.target.value))}
              className="w-48 accent-primary"
            />
          </div>

          <button
            onClick={() => setIsVisible(!isVisible)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors self-end"
          >
            {isVisible ? "Hide" : "Show"}
          </button>
        </div>
      </section>

      {/* Demo */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Demo</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic fade */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Basic Fade</p>
            <div className="h-48 rounded-xl border border-border bg-muted/20 flex items-center justify-center">
              <AnimatePresence>
                {isVisible && (
                  <motion.div
                    key="basic-fade"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration, delay }}
                    className="w-24 h-24 rounded-2xl bg-primary"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Fade + slide up */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Fade + Slide Up</p>
            <div className="h-48 rounded-xl border border-border bg-muted/20 flex items-center justify-center overflow-hidden">
              <AnimatePresence>
                {isVisible && (
                  <motion.div
                    key="fade-slide"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration, delay }}
                    className="w-24 h-24 rounded-2xl bg-primary"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Fade + scale */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Fade + Scale</p>
            <div className="h-48 rounded-xl border border-border bg-muted/20 flex items-center justify-center">
              <AnimatePresence>
                {isVisible && (
                  <motion.div
                    key="fade-scale"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration, delay }}
                    className="w-24 h-24 rounded-2xl bg-primary"
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Code reference */}
      <section className="space-y-4 max-w-2xl">
        <h3 className="text-lg font-semibold">Your current code</h3>
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <pre className="text-sm font-mono whitespace-pre-wrap">
{`// Basic Fade
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: ${duration}, delay: ${delay} }}
/>

// Fade + Slide Up (add y offset)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 20 }}
  transition={{ duration: ${duration}, delay: ${delay} }}
/>

// Fade + Scale
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.8 }}
  transition={{ duration: ${duration}, delay: ${delay} }}
/>`}
          </pre>
        </div>

        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-4">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            <strong>Key concept:</strong> <code className="bg-muted px-1 rounded text-xs">AnimatePresence</code> is
            what makes <code className="bg-muted px-1 rounded text-xs">exit</code> animations work.
            Without it, the element just disappears instantly when removed from the DOM.
          </p>
        </div>
      </section>
    </div>
  );
}
