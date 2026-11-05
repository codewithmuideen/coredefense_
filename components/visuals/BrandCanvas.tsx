"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { MotionValue } from "framer-motion";
import { useInView, useVisualTier } from "@/lib/visual/tier";
import { cn } from "@/lib/utils";

// three.js and R3F live in their own chunk and are only fetched once a canvas scrolls near the viewport.
const BrandScene = dynamic(() => import("./three/BrandScene"), { ssr: false, loading: () => null });

interface BrandCanvasProps {
  /** The section the canvas fills; used for visibility, pointer and layout measurement. */
  containerRef: React.RefObject<HTMLElement | null>;
  scroll?: MotionValue<number>;
  focus?: [number, number];
  intensity?: number;
  coreAnchorRef?: React.RefObject<HTMLElement | null>;
  anchorOffset?: MotionValue<number>;
  className?: string;
}

/**
 * Shader-gradient background (plus the 3D core on capable desktops) layered over a section's existing
 * CSS background. Until it is ready, or where WebGL isn't available, the CSS background shows unchanged.
 */
export default function BrandCanvas({ containerRef, className, ...scene }: BrandCanvasProps) {
  const tier = useVisualTier();
  const inView = useInView(containerRef);
  const [hasEntered, setHasEntered] = useState(false);
  const [ready, setReady] = useState(false);
  if (inView && !hasEntered) setHasEntered(true);

  if (!tier || tier === "none" || !hasEntered) return null;

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 transition-opacity duration-[1400ms] ease-out", className)}
      style={{ opacity: ready ? 1 : 0 }}
    >
      <BrandScene
        tier={tier}
        active={inView}
        containerRef={containerRef}
        onReady={() => setReady(true)}
        {...scene}
      />
    </div>
  );
}
