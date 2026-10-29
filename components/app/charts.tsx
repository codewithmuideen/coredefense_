"use client";

import { useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Hand-built SVG charts: thin marks, recessive grid, one y-axis, a hover layer on every chart,
// and a legend plus direct labels whenever there is more than one series.

const GRID = "#E6E9EF";
const AXIS_TEXT = "#8A94A6";

export interface Series {
  name: string;
  color: string;
  values: number[];
}

function niceMax(v: number) {
  if (v <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(v));
  const step = [1, 2, 2.5, 5, 10].find((s) => (s * pow * 4) >= v) ?? 10;
  return step * pow * 4;
}

export function Legend({ items }: { items: { name: string; color: string; value?: string | number }[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {items.map((i) => (
        <li key={i.name} className="flex items-center gap-1.5 text-xs text-slate-600">
          <span className="h-2 w-2 rounded-full" style={{ background: i.color }} aria-hidden />
          {i.name}
          {i.value !== undefined && <span className="font-semibold text-ink-900">{i.value}</span>}
        </li>
      ))}
    </ul>
  );
}

/** Line/area chart over categorical x labels with a crosshair tooltip. */
export function TrendChart({ labels, series, height = 240, area = true, formatValue = (v: number) => String(v) }: {
  labels: string[];
  series: Series[];
  height?: number;
  area?: boolean;
  formatValue?: (v: number) => string;
}) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const W = 640;
  const H = height;
  const pad = { t: 12, r: 52, b: 28, l: 34 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const max = niceMax(Math.max(1, ...series.flatMap((s) => s.values)));
  const x = (i: number) => pad.l + (labels.length <= 1 ? iw / 2 : (i / (labels.length - 1)) * iw);
  const y = (v: number) => pad.t + ih - (v / max) * ih;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));
  const labelEvery = Math.ceil(labels.length / 7);

  function onMove(e: React.PointerEvent) {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    const px = ((e.clientX - box.left) / box.width) * W;
    const i = Math.round(((px - pad.l) / iw) * (labels.length - 1));
    setHover(Math.max(0, Math.min(labels.length - 1, i)));
  }

  const path = (vals: number[]) => vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");

  return (
    <div className="relative">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full touch-none select-none" role="img" aria-label={series.map((s) => s.name).join(" and ") + " over time"} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
        <defs>
          {series.map((s, si) => (
            <linearGradient key={s.name} id={`g-${id}-${si}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.18} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth={1} strokeDasharray={t === 0 ? undefined : "3 4"} />
            <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" fontSize={11} fill={AXIS_TEXT}>{formatValue(t)}</text>
          </g>
        ))}
        {labels.map((l, i) => (i % labelEvery === 0 || i === labels.length - 1) && (
          <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize={11} fill={AXIS_TEXT}>{l}</text>
        ))}
        {series.map((s, si) => (
          <g key={s.name}>
            {area && <path d={`${path(s.values)}L${x(s.values.length - 1)},${y(0)}L${x(0)},${y(0)}Z`} fill={`url(#g-${id}-${si})`} />}
            <path d={path(s.values)} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {/* Direct label at the line end, when there is more than one series */}
            {series.length > 1 && (
              <text x={x(s.values.length - 1) + 8} y={y(s.values.at(-1) ?? 0) + 4} fontSize={11} fontWeight={600} fill="#475467">{s.name}</text>
            )}
          </g>
        ))}
        {hover !== null && (
          <g pointerEvents="none">
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={pad.t + ih} stroke="#98A2B3" strokeWidth={1} />
            {series.map((s) => (
              <circle key={s.name} cx={x(hover)} cy={y(s.values[hover] ?? 0)} r={4.5} fill={s.color} stroke="#fff" strokeWidth={2} />
            ))}
          </g>
        )}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-2 z-10 min-w-[140px] rounded-lg border border-ink-900/10 bg-white px-3 py-2 text-xs shadow-lg"
          style={{ left: `${(x(hover) / W) * 100}%`, transform: `translateX(${hover > labels.length / 2 ? "-108%" : "8%"})` }}
        >
          <p className="mb-1 font-semibold text-ink-900">{labels[hover]}</p>
          {series.map((s) => (
            <p key={s.name} className="flex items-center justify-between gap-4 text-slate-600">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: s.color }} />{s.name}</span>
              <span className="font-semibold text-ink-900">{formatValue(s.values[hover] ?? 0)}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

/** Single-series column chart with per-bar hover. */
export function ColumnChart({ labels, values, color = "#1E6AFF", height = 220, name = "Value" }: { labels: string[]; values: number[]; color?: string; height?: number; name?: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 640;
  const H = height;
  const pad = { t: 12, r: 8, b: 28, l: 30 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const max = niceMax(Math.max(1, ...values));
  const slot = iw / Math.max(1, values.length);
  const bw = Math.max(3, Math.min(28, slot - 2));
  const y = (v: number) => pad.t + ih - (v / max) * ih;
  const labelEvery = Math.ceil(labels.length / 8);
  const ticks = [0, 0.5, 1].map((f) => Math.round(max * f));

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`${name} by day`} onPointerLeave={() => setHover(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke={GRID} strokeDasharray={t ? "3 4" : undefined} />
            <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" fontSize={11} fill={AXIS_TEXT}>{t}</text>
          </g>
        ))}
        {values.map((v, i) => {
          const cx = pad.l + slot * i + slot / 2;
          const h = Math.max(v > 0 ? 3 : 0, (v / max) * ih);
          return (
            <g key={i} onPointerEnter={() => setHover(i)}>
              <rect x={pad.l + slot * i} y={pad.t} width={slot} height={ih} fill="transparent" />
              <path
                d={`M${cx - bw / 2},${pad.t + ih}V${pad.t + ih - h + Math.min(4, h)}q0,-${Math.min(4, h)} ${Math.min(4, bw / 2)},-${Math.min(4, h)}H${cx + bw / 2 - Math.min(4, bw / 2)}q${Math.min(4, bw / 2)},0 ${Math.min(4, bw / 2)},${Math.min(4, h)}V${pad.t + ih}Z`}
                fill={color}
                opacity={hover === null || hover === i ? 1 : 0.45}
              />
              {(i % labelEvery === 0) && <text x={cx} y={H - 8} textAnchor="middle" fontSize={11} fill={AXIS_TEXT}>{labels[i]}</text>}
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-1 z-10 rounded-lg border border-ink-900/10 bg-white px-3 py-2 text-xs shadow-lg"
          style={{ left: `${((pad.l + slot * hover + slot / 2) / W) * 100}%`, transform: "translateX(-50%)" }}
        >
          <p className="font-semibold text-ink-900">{labels[hover]}</p>
          <p className="text-slate-600">{name}: <span className="font-semibold text-ink-900">{values[hover]}</span></p>
        </div>
      )}
    </div>
  );
}

/** Donut with a 2px surface gap between segments; the centre shows the hovered slice or the total. */
export function Donut({ data, size = 184, thickness = 22, centerLabel = "Total" }: {
  data: { name: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const gap = total > 0 && data.filter((d) => d.value > 0).length > 1 ? 2 : 0;

  const arcs = useMemo(() => {
    let offset = 0;
    return data.map((d) => {
      const len = total ? (d.value / total) * c : 0;
      const arc = { ...d, dash: Math.max(0, len - gap), offset };
      offset += len;
      return arc;
    });
  }, [data, total, c, gap]);

  const active = hover !== null ? data[hover] : null;
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90" role="img" aria-label={data.map((d) => `${d.name}: ${d.value}`).join(", ")}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EEF1F5" strokeWidth={thickness} />
        {arcs.map((a, i) => a.value > 0 && (
          <circle
            key={a.name}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={a.color}
            strokeWidth={hover === i ? thickness + 4 : thickness}
            strokeDasharray={`${a.dash} ${c - a.dash}`}
            strokeDashoffset={-a.offset}
            className="cursor-pointer transition-[stroke-width] duration-200"
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
          />
        ))}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold tracking-tight text-ink-900">{active ? active.value : total}</span>
        <span className="text-xs font-medium text-slate-500">{active ? active.name : centerLabel}</span>
      </div>
    </div>
  );
}

/** A single 0–100 score as a ring. Colour bands follow the status scale and are always labelled. */
export function ScoreRing({ score, size = 132, label }: { score: number; size?: number; label: string }) {
  const stroke = 11;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, score));
  const color = clamped >= 75 ? "#0CA30C" : clamped >= 50 ? "#FAB219" : clamped >= 30 ? "#EC835A" : "#D03B3B";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EEF1F5" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(clamped / 100) * c} ${c}`}
          className="transition-[stroke-dasharray] duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[34px] font-bold leading-none tracking-tight text-ink-900">{Math.round(clamped)}</span>
        <span className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      </div>
    </div>
  );
}

export function ProgressBar({ value, className, color = "bg-primary-500" }: { value: number; className?: string; color?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-100", className)} role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100}>
      <div className={cn("h-full rounded-full transition-[width] duration-700 ease-out", color)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

/** Tiny trend line for stat tiles. Decorative: the tile's number carries the value. */
export function Sparkline({ values, color = "#1E6AFF", width = 96, height = 32 }: { values: number[]; color?: string; width?: number; height?: number }) {
  const max = Math.max(1, ...values);
  const pts = values.map((v, i) => `${(i / Math.max(1, values.length - 1)) * width},${height - 2 - (v / max) * (height - 4)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
