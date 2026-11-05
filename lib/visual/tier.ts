"use client";

import { useEffect, useState } from "react";

/**
 * How much visual richness this device should get.
 * - "full":   desktop-class device, fine pointer: shader + 3D.
 * - "lite":   phones, tablets, low-core or data-saver devices: shader only, capped pixel ratio.
 * - "static": prefers-reduced-motion: shader painted once, nothing moves.
 * - "none":   no WebGL: the existing CSS backgrounds stay as they are.
 * `null` until mounted, so server and first client render match (no hydration mismatch).
 */
export type VisualTier = "full" | "lite" | "static" | "none";

let webglCache: boolean | null = null;

export function hasWebGL(): boolean {
  if (webglCache !== null) return webglCache;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    webglCache = Boolean(gl);
    // Release the probe context straight away.
    (gl as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglCache = false;
  }
  return webglCache;
}

function computeTier(): VisualTier {
  if (!hasWebGL()) return "none";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "static";
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  const lowPower =
    nav.connection?.saveData === true ||
    (nav.hardwareConcurrency ?? 8) < 4 ||
    (nav.deviceMemory ?? 8) < 4;
  const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
  return desktop && !lowPower ? "full" : "lite";
}

export function useVisualTier(): VisualTier | null {
  const [tier, setTier] = useState<VisualTier | null>(null);
  useEffect(() => {
    const update = () => setTier(computeTier());
    update();
    const mqs = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(min-width: 1024px) and (pointer: fine)"),
    ];
    mqs.forEach((mq) => mq.addEventListener("change", update));
    return () => mqs.forEach((mq) => mq.removeEventListener("change", update));
  }, []);
  return tier;
}

/** True when the element is on (or near) screen. Used to stop rendering WebGL we can't see. */
export function useInView<T extends Element>(ref: React.RefObject<T | null>, rootMargin = "120px"): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

/** Chromium is the only engine that renders SVG filters inside backdrop-filter (used for glass refraction). */
export function supportsBackdropSvgFilter(): boolean {
  if (typeof navigator === "undefined") return false;
  const brands = (navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } }).userAgentData?.brands;
  return Boolean(brands?.some((b) => b.brand === "Chromium"));
}
