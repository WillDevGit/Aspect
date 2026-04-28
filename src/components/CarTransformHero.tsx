import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import carBefore from "@/assets/car-before.jpg";
import carAfter from "@/assets/car-after.jpg";

/**
 * "Instant Car Transformation Machine" hero animation.
 * Lightweight: two images + animated CSS mask + a scanning beam.
 * Loops every ~5s. Respects prefers-reduced-motion.
 */
export function CarTransformHero({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState<"idle" | "scan" | "done">("idle");
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduce) {
      setPhase("done");
      return;
    }
    let t1: number, t2: number, t3: number;
    const run = () => {
      setPhase("idle");
      t1 = window.setTimeout(() => setPhase("scan"), 600);
      t2 = window.setTimeout(() => setPhase("done"), 600 + 2200);
      t3 = window.setTimeout(() => setCycle((c) => c + 1), 600 + 2200 + 1800);
    };
    run();
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [cycle, reduce]);

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`} aria-hidden="true">
      {/* BEFORE — dull, desaturated */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${carBefore})`,
          filter: "saturate(0.35) brightness(0.55) contrast(0.9)",
        }}
      />

      {/* AFTER — glossy, revealed by an animated horizontal wipe */}
      <motion.div
        key={`after-${cycle}`}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${carAfter})`,
          filter: "saturate(1.15) contrast(1.1)",
          willChange: "clip-path",
        }}
        initial={reduce ? { clipPath: "inset(0 0 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
        animate={
          phase === "idle"
            ? { clipPath: "inset(0 100% 0 0)" }
            : phase === "scan"
            ? { clipPath: "inset(0 0% 0 0)" }
            : { clipPath: "inset(0 0% 0 0)" }
        }
        transition={{ duration: 2.2, ease: [0.7, 0, 0.2, 1] }}
      />

      {/* Glitch slices — three thin horizontal bands that briefly flash the after */}
      {!reduce && phase === "scan" && (
        <>
          <GlitchSlice top="22%" delay={0.2} cycle={cycle} />
          <GlitchSlice top="55%" delay={0.6} cycle={cycle} />
          <GlitchSlice top="78%" delay={1.0} cycle={cycle} />
        </>
      )}

      {/* Scanning beam — sweeps across in sync with the wipe */}
      {!reduce && (
        <AnimatePresence>
          {phase === "scan" && (
            <motion.div
              key={`beam-${cycle}`}
              className="pointer-events-none absolute inset-y-0 w-[8%] mix-blend-screen"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.95 0.05 315 / 0.9), oklch(0.78 0.22 315 / 0.6), transparent)",
                filter: "blur(12px)",
                willChange: "transform",
              }}
              initial={{ left: "-10%" }}
              animate={{ left: "102%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, ease: [0.7, 0, 0.2, 1] }}
            />
          )}
        </AnimatePresence>
      )}

      {/* Scan grid overlay during transformation */}
      {!reduce && phase === "scan" && (
        <motion.div
          key={`grid-${cycle}`}
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, oklch(0.78 0.22 315 / 0.08) 0px, oklch(0.78 0.22 315 / 0.08) 1px, transparent 1px, transparent 6px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0] }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
        />
      )}

      {/* Subtle vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}

function GlitchSlice({ top, delay, cycle }: { top: string; delay: number; cycle: number }) {
  return (
    <motion.div
      key={`slice-${top}-${cycle}`}
      className="pointer-events-none absolute left-0 right-0 bg-cover bg-center mix-blend-screen"
      style={{
        top,
        height: "10px",
        backgroundImage: `url(${carAfter})`,
        backgroundPosition: `center ${top}`,
        filter: "saturate(1.4) brightness(1.3)",
        willChange: "transform, opacity",
      }}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: [0, 8, -4, 0], opacity: [0, 1, 1, 0] }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    />
  );
}
