"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { TASTES, tune, type TasteTokens } from "@/lib/tokens";
import { springUI } from "@/lib/motion";
import { SpecimenWall } from "./SpecimenWall";

export function TasteSampler() {
  const [presetIndex, setPresetIndex] = useState(0);
  const [generation, setGeneration] = useState(0);
  const preset = TASTES[presetIndex];
  const [radius, setRadius] = useState(preset.radius);
  const [density, setDensity] = useState(preset.density);

  const tokens: TasteTokens = tune(preset, radius, density);

  function extract(i: number) {
    if (i === presetIndex) return;
    setPresetIndex(i);
    setRadius(TASTES[i].radius);
    setDensity(TASTES[i].density);
    setGeneration((g) => g + 1);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr] lg:gap-5">
      <div className="flex flex-col gap-3">
        <div className="rounded-2xl border border-line bg-surface p-4">
          <div className="eyebrow mb-3 text-[10px] text-faint">Taste Sampler</div>
          <div className="flex flex-col gap-1.5">
            {TASTES.map((t, i) => {
              const active = i === presetIndex;
              return (
                <button
                  key={t.id}
                  onClick={() => extract(i)}
                  aria-pressed={active}
                  className={`group relative flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                    active
                      ? "border-line-strong bg-surface-strong"
                      : "border-transparent hover:bg-surface"
                  }`}
                >
                  <span
                    className="size-5 shrink-0 rounded-md ring-1 ring-white/10"
                    style={{ background: t.accent }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-mono text-[12px] text-ink">{t.url}</span>
                    <span className="block truncate text-[11px] text-faint">{t.mood}</span>
                  </span>
                  {active && (
                    <motion.span
                      layoutId="sampler-dot"
                      transition={springUI}
                      className="size-1.5 shrink-0 rounded-full bg-ok"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-4">
          <div className="eyebrow mb-4 text-[10px] text-faint">Parametric Tweaker</div>

          <label className="mb-1.5 flex items-baseline justify-between text-[12px]">
            <span className="text-muted">Radius</span>
            <span className="font-mono text-[11px] text-ink">{radius}px</span>
          </label>
          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full"
            aria-label="Corner radius"
          />

          <label className="mt-4 mb-1.5 flex items-baseline justify-between text-[12px]">
            <span className="text-muted">Density</span>
            <span className="font-mono text-[11px] text-ink">{density.toFixed(2)}×</span>
          </label>
          <input
            type="range"
            min={0.7}
            max={1.4}
            step={0.02}
            value={density}
            onChange={(e) => setDensity(Number(e.target.value))}
            className="w-full"
            aria-label="Visual density"
          />
          <div className="mt-1 flex justify-between text-[10px] text-faint">
            <span>Compact</span>
            <span>Airy</span>
          </div>

          <div className="mt-4 border-t border-line pt-3">
            <code className="block truncate font-mono text-[10.5px] text-faint">
              {preset.recipe}
            </code>
          </div>
        </div>
      </div>

      <SpecimenWall tokens={tokens} generation={generation} />
    </div>
  );
}
