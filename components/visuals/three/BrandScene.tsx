"use client";

// Loaded only on the client (next/dynamic, ssr: false). Everything that moves is driven from refs
// inside useFrame, so scrolling and pointer movement never cause a React re-render.

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  BoxGeometry,
  Color,
  DoubleSide,
  EdgesGeometry,
  Vector2,
  Vector3,
  type Group,
} from "three";
import type { MotionValue } from "framer-motion";
import type { VisualTier } from "@/lib/visual/tier";
import { brand, fresnelFragment, fresnelVertex, gradientFragment, gradientVertex } from "./shaders";

type Pointer = { x: number; y: number; tx: number; ty: number };

export interface BrandSceneProps {
  tier: Exclude<VisualTier, "none">;
  active: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
  /** 0 → 1 as the section scrolls away. */
  scroll?: MotionValue<number>;
  /** Where the light pools, in 0–1 canvas space (y up). */
  focus?: [number, number];
  intensity?: number;
  /** Show the 3D core, centred on this element. */
  coreAnchorRef?: React.RefObject<HTMLElement | null>;
  /** Vertical px offset currently applied to the anchor by parallax, so we can measure its resting place. */
  anchorOffset?: MotionValue<number>;
  onReady?: () => void;
}

function usePointer(containerRef: React.RefObject<HTMLElement | null>, enabled: boolean) {
  const pointer = useRef<Pointer>({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });
  useEffect(() => {
    if (!enabled) return;
    function onMove(e: PointerEvent) {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      pointer.current.tx = (e.clientX - r.left) / Math.max(r.width, 1);
      pointer.current.ty = 1 - (e.clientY - r.top) / Math.max(r.height, 1);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [containerRef, enabled]);
  return pointer;
}

function GradientPlane({
  pointer,
  scroll,
  focus,
  intensity,
  animate,
}: {
  pointer: React.RefObject<Pointer>;
  scroll?: MotionValue<number>;
  focus: [number, number];
  intensity: number;
  animate: boolean;
}) {
  const size = useThree((s) => s.size);
  const uniforms = useMemo(
    () => ({
      // Start part-way into the noise field so the static (reduced-motion) frame is already composed.
      uTime: { value: 18 },
      uRes: { value: new Vector2(1, 1) },
      uPointer: { value: new Vector2(0.5, 0.5) },
      uFocus: { value: new Vector2(focus[0], focus[1]) },
      uScroll: { value: 0 },
      uIntensity: { value: intensity },
      uBase: { value: new Vector3(...brand.ink) },
      uDeep: { value: new Vector3(...brand.deep) },
      uBrand: { value: new Vector3(...brand.primary) },
      uGlow: { value: new Vector3(...brand.light) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    uniforms.uRes.value.set(size.width, size.height);
  }, [size, uniforms]);

  useFrame((_, delta) => {
    if (!animate) return;
    uniforms.uTime.value += Math.min(delta, 0.05);
    const p = pointer.current;
    p.x += (p.tx - p.x) * 0.08;
    p.y += (p.ty - p.y) * 0.08;
    uniforms.uPointer.value.set(p.x, p.y);
    uniforms.uScroll.value = scroll?.get() ?? 0;
  });

  return (
    <mesh frustumCulled={false} renderOrder={-1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={gradientVertex}
        fragmentShader={gradientFragment}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

// Faces stay faint (a hint of glass); the edges carry the form, like the line-work of the logo mark.
const SHELLS = [
  { size: 2.6, opacity: 0.25, power: 3.0, edge: 0.55, spin: -0.13 },
  { size: 1.75, opacity: 0.32, power: 3.0, edge: 0.65, spin: 0.2 },
  { size: 1.05, opacity: 0.42, power: 2.8, edge: 0.85, spin: -0.3 },
];

/**
 * The brand mark in 3D: the logo's nested frames become nested glass shells around a solid core.
 * It sits behind the hero card so the card reads as the "core" being protected.
 */
function Core({
  pointer,
  scroll,
  containerRef,
  anchorRef,
  anchorOffset,
}: {
  pointer: React.RefObject<Pointer>;
  scroll?: MotionValue<number>;
  containerRef: React.RefObject<HTMLElement | null>;
  anchorRef: React.RefObject<HTMLElement | null>;
  anchorOffset?: MotionValue<number>;
}) {
  const root = useRef<Group>(null);
  const tilt = useRef<Group>(null);
  const shells = useRef<(Group | null)[]>([]);
  const core = useRef<Group>(null);
  const placement = useRef({ cx: 0.75, cy: 0.5, w: 0.3, ready: false });
  const viewport = useThree((s) => s.viewport);

  const box = useMemo(() => new BoxGeometry(1, 1, 1), []);
  const edges = useMemo(() => new EdgesGeometry(box), [box]);
  useEffect(
    () => () => {
      box.dispose();
      edges.dispose();
    },
    [box, edges]
  );

  const shellUniforms = useMemo(
    () =>
      SHELLS.map((s) => ({
        uColor: { value: new Vector3(...brand.primary) },
        uOpacity: { value: s.opacity },
        uPower: { value: s.power },
      })),
    []
  );
  const edgeColor = useMemo(() => new Color("#9CC2FF"), []);

  // Measure where the anchor rests inside the section (centre is unaffected by scale animations).
  useEffect(() => {
    const anchor = anchorRef.current;
    const container = containerRef.current;
    if (!anchor || !container) return;
    function measure() {
      const a = anchor!.getBoundingClientRect();
      const c = container!.getBoundingClientRect();
      const offset = anchorOffset?.get() ?? 0;
      placement.current = {
        cx: (a.left + a.width / 2 - c.left) / Math.max(c.width, 1),
        cy: (a.top + a.height / 2 - offset - c.top) / Math.max(c.height, 1),
        w: a.width / Math.max(c.width, 1),
        ready: true,
      };
    }
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(anchor);
    ro.observe(container);
    return () => ro.disconnect();
  }, [anchorRef, containerRef, anchorOffset]);

  useFrame((state, delta) => {
    const g = root.current;
    const t = state.clock.elapsedTime;
    if (!g || !tilt.current) return;
    const p = scroll?.get() ?? 0;
    const place = placement.current;

    const x = (place.cx - 0.5) * viewport.width;
    const y = -(place.cy - 0.5) * viewport.height;
    // Slightly larger than the card so the frames break past its edges and read as surrounding it.
    const scale = (place.w * viewport.width * 1.5) / SHELLS[0].size;
    g.position.set(x, y + Math.sin(t * 0.7) * 0.12 + p * 0.9, -1.5);
    g.scale.setScalar(scale * (1 + p * 0.25));

    // Pointer tilts the whole object; scroll turns it as the visitor moves into the page.
    const pt = pointer.current;
    tilt.current.rotation.x += ((0.5 - pt.y) * 0.7 + 0.42 + p * 1.6 - tilt.current.rotation.x) * 0.08;
    tilt.current.rotation.y += ((pt.x - 0.5) * 1.0 + 0.6 + p * 2.2 - tilt.current.rotation.y) * 0.08;

    shells.current.forEach((s, i) => {
      if (!s) return;
      s.rotation.y += delta * SHELLS[i].spin;
      s.rotation.z += delta * SHELLS[i].spin * 0.4;
      // Layers drift apart a little as the hero scrolls away.
      s.scale.setScalar(SHELLS[i].size * (1 + Math.sin(t * 1.0 + i) * 0.02 + p * (0.15 + i * 0.12)));
    });
    if (core.current) {
      core.current.rotation.y -= delta * 0.5;
      core.current.rotation.x += delta * 0.2;
      core.current.scale.setScalar(0.42 * (1 + Math.sin(t * 1.8) * 0.06));
    }
    g.visible = place.ready;
  });

  return (
    <group ref={root} visible={false}>
      <group ref={tilt}>
        {SHELLS.map((s, i) => (
          <group
            key={s.size}
            ref={(el) => {
              shells.current[i] = el;
            }}
            scale={s.size}
          >
            <mesh geometry={box}>
              <shaderMaterial
                vertexShader={fresnelVertex}
                fragmentShader={fresnelFragment}
                uniforms={shellUniforms[i]}
                transparent
                depthWrite={false}
                blending={AdditiveBlending}
                side={DoubleSide}
              />
            </mesh>
            <lineSegments geometry={edges}>
              <lineBasicMaterial color={edgeColor} transparent opacity={s.edge} depthWrite={false} />
            </lineSegments>
          </group>
        ))}
        <group ref={core} scale={0.42}>
          <mesh geometry={box}>
            <meshBasicMaterial color="#3D82FF" />
          </mesh>
          <lineSegments geometry={edges}>
            <lineBasicMaterial color="#D5E3FF" transparent opacity={0.9} />
          </lineSegments>
        </group>
      </group>
    </group>
  );
}

export default function BrandScene({
  tier,
  active,
  containerRef,
  scroll,
  focus = [0.5, 0.5],
  intensity = 1,
  coreAnchorRef,
  anchorOffset,
  onReady,
}: BrandSceneProps) {
  const animate = tier !== "static";
  const pointer = usePointer(containerRef, animate);
  const frameloop = !active ? "never" : animate ? "always" : "demand";

  return (
    <Canvas
      frameloop={frameloop}
      dpr={tier === "full" ? [1, 1.75] : [1, 1.5]}
      flat
      gl={{ antialias: tier === "full", alpha: false, stencil: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 10], fov: 35 }}
      onCreated={() => onReady?.()}
      style={{ pointerEvents: "none" }}
    >
      <GradientPlane pointer={pointer} scroll={scroll} focus={focus} intensity={intensity} animate={animate} />
      {coreAnchorRef && (
        <Core
          pointer={pointer}
          scroll={scroll}
          containerRef={containerRef}
          anchorRef={coreAnchorRef}
          anchorOffset={anchorOffset}
        />
      )}
    </Canvas>
  );
}
