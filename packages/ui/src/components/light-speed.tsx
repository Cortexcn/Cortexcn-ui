"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useMemo, useRef, useSyncExternalStore } from "react";
import { Color, type InstancedMesh, Object3D } from "three";

import { cn } from "@/lib/utils";

export interface LightSpeedProps {
  /**
   * Number of light streaks.
   * @default 1000
   */
  particleCount?: number;
  /**
   * Base speed of the warp effect.
   * @default 2.4
   */
  speed?: number;
  /**
   * Color of the light streaks.
   * @default "#b026ff"
   */
  lightColor?: string;
  /**
   * How far the streak color is pushed past full brightness, which the bloom
   * turns into glow.
   * @default 3
   */
  intensity?: number;
  /**
   * Radius of the tunnel the streaks spawn in.
   * @default 25
   */
  radius?: number;
  /**
   * Length of the tunnel before streaks loop back to the far end.
   * @default 150
   */
  cylinderLength?: number;
  /**
   * Hold the current frame, for example while the background is off screen.
   * @default false
   */
  paused?: boolean;
  className?: string;
}

interface Streak {
  x: number;
  y: number;
  z: number;
  speedMultiplier: number;
  length: number;
}

/** The camera sits here; a streak that passes it loops back to the far end. */
const CAMERA_Z = 5;
/** Keeps a clear tunnel around the camera. */
const INNER_RADIUS = 2;
/** Turns `speed` into world units per second. */
const SPEED_SCALE = 50;
/** Frames simulated before the first paint, so the tunnel starts full. */
const PREWARM_FRAMES = 90;
const PREWARM_STEP = 1 / 60;
/** Caps a frame's step after a stall, such as a background tab, so streaks do not jump. */
const MAX_FRAME_STEP = 0.1;
const STREAK_WIDTH = 0.04;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

/** Each streak gets its own speed, so the tunnel has depth. */
function randomSpeedMultiplier() {
  return 0.5 + Math.random() * 0.5;
}

function createStreaks(
  count: number,
  baseSpeed: number,
  radius: number,
  cylinderLength: number,
): Streak[] {
  const streaks: Streak[] = [];
  for (let index = 0; index < count; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const distance = INNER_RADIUS + Math.random() * (radius - INNER_RADIUS);
    let z = (Math.random() - 0.5) * cylinderLength;
    let speedMultiplier = randomSpeedMultiplier();

    for (let frame = 0; frame < PREWARM_FRAMES; frame += 1) {
      z += baseSpeed * speedMultiplier * PREWARM_STEP * SPEED_SCALE;
      if (z > CAMERA_Z) {
        z = -cylinderLength / 2;
        speedMultiplier = randomSpeedMultiplier();
      }
    }

    streaks.push({
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      z,
      speedMultiplier,
      // Uneven lengths look more natural than a uniform grid of lines.
      length: 1 + Math.random() * 2,
    });
  }
  return streaks;
}

function Streaks({
  count,
  baseSpeed,
  lightColor,
  intensity,
  radius,
  cylinderLength,
}: {
  count: number;
  baseSpeed: number;
  lightColor: string;
  intensity: number;
  radius: number;
  cylinderLength: number;
}) {
  const meshRef = useRef<InstancedMesh>(null);
  // One Object3D builds every instance's matrix, instead of one object per streak.
  const dummy = useMemo(() => new Object3D(), []);
  const streaks = useMemo(
    () => createStreaks(count, baseSpeed, radius, cylinderLength),
    [count, baseSpeed, radius, cylinderLength],
  );
  // Values above 1 are what the bloom pass picks up and spreads into a glow.
  const color = useMemo(
    () => new Color(lightColor).multiplyScalar(intensity),
    [lightColor, intensity],
  );

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }
    const step = Math.min(delta, MAX_FRAME_STEP);
    for (const [index, streak] of streaks.entries()) {
      streak.z += baseSpeed * streak.speedMultiplier * step * SPEED_SCALE;
      if (streak.z > CAMERA_Z) {
        streak.z = -cylinderLength / 2;
        streak.speedMultiplier = randomSpeedMultiplier();
      }
      dummy.position.set(streak.x, streak.y, streak.z);
      // Thin on x and y, stretched on z: faster streaks stretch further, like motion blur.
      dummy.scale.set(
        STREAK_WIDTH,
        STREAK_WIDTH,
        streak.length + baseSpeed * streak.speedMultiplier * 0.5,
      );
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      args={[undefined, undefined, count]}
      frustumCulled={false}
      ref={meshRef}
    >
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color={color}
        opacity={0.9}
        toneMapped={false}
        transparent
      />
    </instancedMesh>
  );
}

/**
 * A warp-speed tunnel of glowing light streaks, drawn with three.js and a
 * bloom pass. It fills its nearest positioned parent and ignores the pointer,
 * so content placed on top stays clickable. With reduced motion, it holds a
 * still frame.
 */
export function LightSpeed({
  particleCount = 1000,
  speed = 2.4,
  lightColor = "#b026ff",
  intensity = 3,
  radius = 25,
  cylinderLength = 150,
  paused = false,
  className,
}: LightSpeedProps) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full overflow-hidden bg-light-speed",
        className,
      )}
    >
      {/* The camera looks down -z from inside the tunnel; a wide field of view stretches the streaks toward the edges. */}
      <Canvas
        camera={{ position: [0, 0, CAMERA_Z], fov: 90 }}
        dpr={[1, 2]}
        frameloop={paused || reduceMotion ? "demand" : "always"}
      >
        {/* Fog fades streaks out in the distance, so they never pop in at the far end. */}
        <fogExp2 args={["#000000", 0.025]} attach="fog" />
        <color args={["#000000"]} attach="background" />

        <Streaks
          baseSpeed={speed}
          count={particleCount}
          cylinderLength={cylinderLength}
          intensity={intensity}
          lightColor={lightColor}
          radius={radius}
        />

        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceSmoothing={0.9}
            luminanceThreshold={0.1}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
