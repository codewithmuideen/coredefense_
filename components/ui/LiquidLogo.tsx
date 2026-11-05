"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * The original logo artwork, untouched, seen through an SVG displacement filter.
 * On load it settles out of a liquid ripple into its exact shape; on hover a brief ripple runs
 * through it and calms again. At rest the filter is at zero, so the logo is pixel-identical.
 */
interface LiquidLogoProps {
  src: string;
  width: number;
  height: number;
  className?: string;
  label?: string;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function LiquidLogo({ src, width, height, className, label = "CoreDefense" }: LiquidLogoProps) {
  const id = `liquid-logo-${useId().replace(/:/g, "")}`;
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const frame = useRef(0);

  useEffect(() => {
    const disp = dispRef.current;
    const turb = turbRef.current;
    const svg = svgRef.current;
    if (!disp || !turb || !svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Animate displacement from `from` to 0 while the noise field drifts, then switch the filter off.
    function ripple(from: number, duration: number) {
      cancelAnimationFrame(frame.current);
      const start = performance.now();
      svg!.style.filter = `url(#${id})`;
      const step = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const k = 1 - easeOut(t);
        disp!.setAttribute("scale", (from * k).toFixed(2));
        turb!.setAttribute("baseFrequency", `${(0.015 + 0.03 * k).toFixed(4)} ${(0.06 + 0.09 * k).toFixed(4)}`);
        turb!.setAttribute("seed", String(Math.floor(now / 90) % 40));
        if (t < 1) frame.current = requestAnimationFrame(step);
        else svg!.style.filter = "";
      };
      frame.current = requestAnimationFrame(step);
    }

    ripple(70, 2600);
    const onEnter = () => ripple(32, 1400);
    // A wave runs through the logo every few seconds so the effect is seen without hovering.
    const idle = window.setInterval(() => {
      if (document.visibilityState === "visible") ripple(22, 1600);
    }, 6000);
    const host = svg.closest("a") ?? svg;
    host.addEventListener("pointerenter", onEnter);
    return () => {
      cancelAnimationFrame(frame.current);
      window.clearInterval(idle);
      host.removeEventListener("pointerenter", onEnter);
    };
  }, [id]);

  return (
    <svg
      ref={svgRef}
      role="img"
      aria-label={label}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("liquid-logo h-7 w-auto overflow-visible sm:h-8", className)}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <defs>
        <filter id={id} x="-10%" y="-60%" width="120%" height="220%" colorInterpolationFilters="sRGB">
          <feTurbulence ref={turbRef} type="fractalNoise" baseFrequency="0.012 0.05" numOctaves={2} seed={3} result="noise" />
          <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="noise" scale={0} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <image href={src} width={width} height={height} preserveAspectRatio="xMidYMid meet" />
    </svg>
  );
}
