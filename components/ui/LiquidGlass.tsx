"use client";

import { forwardRef, useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { supportsBackdropSvgFilter } from "@/lib/visual/tier";

/**
 * Liquid glass: frosted backdrop, a lens-shaped refraction around the edges (Chromium, via an SVG
 * displacement map fed to backdrop-filter), an inner rim highlight and a specular sheen that follows
 * the pointer. Other browsers get the same frosted glass without the refraction.
 */

interface GlassOptions {
  /** Max refraction offset in px at the very edge. */
  refraction?: number;
  /** How far in from the edge the lens bends, in px. */
  bezel?: number;
  /** Corner radius in px, so the lens follows rounded corners. */
  radius?: number;
  blur?: number;
  saturate?: number;
  enabled?: boolean;
  /** Only bend light along the bottom edge (for bars pinned to the top of the viewport). */
  bottomEdgeOnly?: boolean;
}

/** Build an edge-only displacement map: neutral grey in the middle, pushing inward near the edges. */
function buildDisplacementMap(w: number, h: number, bezel: number, radius: number, bottomOnly = false): string {
  const scale = 0.5; // half resolution is plenty: the map is smooth
  const cw = Math.max(2, Math.round(w * scale));
  const ch = Math.max(2, Math.round(h * scale));
  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(cw, ch);
  const hx = w / 2;
  const hy = h / 2;
  const r = Math.min(radius, hx, hy);
  for (let j = 0; j < ch; j++) {
    for (let i = 0; i < cw; i++) {
      const px = (i + 0.5) / scale - hx;
      const py = (j + 0.5) / scale - hy;
      // Signed distance to a rounded rectangle (negative inside).
      const qx = Math.abs(px) - (hx - r);
      const qy = Math.abs(py) - (hy - r);
      const ox = Math.max(qx, 0);
      const oy = Math.max(qy, 0);
      let dist = -(Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - r);
      let nx = 0;
      let ny = 0;
      if (bottomOnly) {
        dist = hy - py;
        ny = 1;
      } else if (qx > 0 && qy > 0) {
        const len = Math.hypot(qx, qy) || 1;
        nx = (qx / len) * Math.sign(px);
        ny = (qy / len) * Math.sign(py);
      } else if (qx > qy) {
        nx = Math.sign(px);
      } else {
        ny = Math.sign(py);
      }
      const t = Math.min(Math.max(1 - dist / bezel, 0), 1);
      const mag = t * t * (3 - 2 * t); // smooth lens falloff
      const k = (j * cw + i) * 4;
      // Sample from further inside the glass at the rim, like a convex lens.
      img.data[k] = 128 - nx * mag * 127;
      img.data[k + 1] = 128 - ny * mag * 127;
      img.data[k + 2] = 128;
      img.data[k + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}

export function useLiquidGlass<T extends HTMLElement>({
  refraction = 22,
  bezel = 18,
  radius = 16,
  blur = 14,
  saturate = 170,
  enabled = true,
  bottomEdgeOnly = false,
}: GlassOptions = {}) {
  const ref = useRef<T | null>(null);
  const filterId = `lg-${useId().replace(/:/g, "")}`;
  const [map, setMap] = useState<{ url: string; w: number; h: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled || !supportsBackdropSvgFilter()) return;
    let frame = 0;
    let last = "";
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const w = Math.round(el.offsetWidth);
        const h = Math.round(el.offsetHeight);
        const key = `${w}x${h}`;
        if (!w || !h || key === last) return;
        last = key;
        setMap({ url: buildDisplacementMap(w, h, bezel, radius, bottomEdgeOnly), w, h });
      });
    });
    ro.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [enabled, bezel, radius, bottomEdgeOnly]);

  // Specular sheen: written straight to CSS variables, no React state per move.
  const onPointerMove = useCallback((e: React.PointerEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--glass-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--glass-y", `${e.clientY - r.top}px`);
  }, []);

  const frost = `blur(${blur}px) saturate(${saturate}%)`;
  const backdrop = enabled ? (map ? `url(#${filterId}) ${frost}` : frost) : undefined;

  const style: React.CSSProperties = enabled
    ? { backdropFilter: backdrop, WebkitBackdropFilter: frost }
    : {};

  const filter =
    enabled && map ? (
      <svg aria-hidden width="0" height="0" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
        <filter
          id={filterId}
          x="0"
          y="0"
          width={map.w}
          height={map.h}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feImage href={map.url} x="0" y="0" width={map.w} height={map.h} preserveAspectRatio="none" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale={refraction} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
    ) : null;

  return { ref, style, filter, onPointerMove };
}

/** Rim light and pointer sheen. Place inside a `relative` glass element. */
export function GlassHighlights({ tone = "light", enabled = true }: { tone?: "light" | "dark"; enabled?: boolean }) {
  if (!enabled) return null;
  return (
    <>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 rounded-[inherit]",
          tone === "dark"
            ? "shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_0_0_1px_rgba(255,255,255,0.14),inset_0_-16px_28px_-14px_rgba(127,169,255,0.4),inset_0_0_32px_-12px_rgba(0,200,255,0.2),0_0_40px_-12px_rgba(30,106,255,0.35)]"
            : "shadow-[inset_0_1.5px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(30,106,255,0.25),inset_0_-14px_28px_-18px_rgba(30,106,255,0.35)]"
        )}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-30 transition-opacity duration-500 group-hover/glass:opacity-100"
        style={{
          background:
            tone === "dark"
              ? "radial-gradient(420px circle at var(--glass-x, 50%) var(--glass-y, 0%), rgba(160,200,255,0.3), rgba(0,200,255,0.08) 30%, transparent 55%)"
              : "radial-gradient(360px circle at var(--glass-x, 50%) var(--glass-y, 0%), rgba(255,255,255,0.95), rgba(127,169,255,0.25) 30%, transparent 55%)",
        }}
      />
    </>
  );
}

interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement>, GlassOptions {
  tone?: "light" | "dark";
}

const LiquidGlass = forwardRef<HTMLDivElement, LiquidGlassProps>(function LiquidGlass(
  { tone = "dark", refraction, bezel, radius, blur, saturate, enabled = true, bottomEdgeOnly, className, style, children, ...rest },
  forwardedRef
) {
  const glass = useLiquidGlass<HTMLDivElement>({ refraction, bezel, radius, blur, saturate, enabled, bottomEdgeOnly });
  return (
    <div
      {...rest}
      ref={(el) => {
        glass.ref.current = el;
        if (typeof forwardedRef === "function") forwardedRef(el);
        else if (forwardedRef) forwardedRef.current = el;
      }}
      onPointerMove={glass.onPointerMove}
      className={cn("group/glass relative isolate", className)}
      style={{ ...glass.style, ...style }}
    >
      {glass.filter}
      <GlassHighlights tone={tone} enabled={enabled} />
      {children}
    </div>
  );
});

export default LiquidGlass;
