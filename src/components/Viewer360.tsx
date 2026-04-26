import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import heroCar from "@/assets/hero-car.jpg";
import carAfter from "@/assets/car-after.jpg";
import sedanAfter from "@/assets/portfolio/sedan-after.jpg";
import sportAfter from "@/assets/portfolio/sport-after.jpg";
import suvAfter from "@/assets/portfolio/suv-after.jpg";

/**
 * Viewer360 — drag-to-rotate viewer using existing project images as frames.
 * - Mouse drag / touch swipe cycles through frames
 * - lerp(0.12) smoothing so the rotation feels weighted
 * - Preloads all frames on mount (new Image()) — zero flicker
 * - Auto-rotates once on section enter (3s ease-in-out)
 * - prefers-reduced-motion: static first frame, no animation
 */
export function Viewer360() {
  const frames = useMemo(
    () => [heroCar, sportAfter, sedanAfter, suvAfter, carAfter],
    [],
  );
  const TOTAL = frames.length;

  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.4, once: true });

  const [frame, setFrame] = useState(0); // displayed frame
  const [hintVisible, setHintVisible] = useState(true);
  const [progress, setProgress] = useState(0); // 0..1 of full rotation

  // Refs for animation state (avoid re-renders during drag/RAF)
  const targetRef = useRef(0); // continuous virtual frame index (can exceed TOTAL)
  const currentRef = useRef(0); // smoothed value
  const rafRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const autoRotatingRef = useRef(false);
  const interactedRef = useRef(false);

  // Preload all frames once on mount
  useEffect(() => {
    frames.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [frames]);

  // Smoothing loop
  useEffect(() => {
    if (reduce) return;
    const tick = () => {
      const cur = currentRef.current;
      const tgt = targetRef.current;
      const next = cur + (tgt - cur) * 0.12;
      currentRef.current = next;

      const f = ((Math.round(next) % TOTAL) + TOTAL) % TOTAL;
      setFrame(f);

      // Progress = position around a full revolution (TOTAL frames = 360°)
      const norm = ((next % TOTAL) + TOTAL) % TOTAL;
      setProgress(norm / TOTAL);

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [TOTAL, reduce]);

  // Auto-rotate once on enter (3s ease-in-out through all frames)
  useEffect(() => {
    if (!inView || reduce || autoRotatingRef.current) return;
    autoRotatingRef.current = true;
    const start = performance.now();
    const duration = 3000;
    const startTarget = targetRef.current;
    const endTarget = startTarget + TOTAL; // one full pass

    const easeInOut = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const step = (now: number) => {
      const elapsed = Math.min(1, (now - start) / duration);
      // Drive targetRef directly so the lerp loop chases it smoothly
      targetRef.current = startTarget + (endTarget - startTarget) * easeInOut(elapsed);
      if (elapsed < 1 && !interactedRef.current) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [inView, TOTAL, reduce]);

  // Drag handlers — convert horizontal pixel delta into frame delta
  const PX_PER_FRAME = 70; // sensitivity

  const onPointerDown = (clientX: number) => {
    if (reduce) return;
    draggingRef.current = true;
    lastXRef.current = clientX;
    interactedRef.current = true;
    if (hintVisible) setHintVisible(false);
  };
  const onPointerMove = (clientX: number) => {
    if (!draggingRef.current) return;
    const dx = clientX - lastXRef.current;
    lastXRef.current = clientX;
    targetRef.current += dx / PX_PER_FRAME;
  };
  const onPointerUp = () => {
    draggingRef.current = false;
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#080808] py-24 md:py-36"
      aria-label="360 degree car viewer"
    >
      {/* Soft purple ambient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,oklch(0.32_0.18_305_/_0.18),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
          className="font-display text-5xl text-white md:text-7xl lg:text-8xl"
          style={{ letterSpacing: "0.15em" }}
        >
          EVERY ANGLE.
        </motion.h2>
        <p className="mt-4 max-w-md text-sm uppercase tracking-[0.3em] text-white/50">
          Drag the car. See it move.
        </p>

        {/* Stage */}
        <div
          role="img"
          aria-label={`Car rotation, frame ${frame + 1} of ${TOTAL}`}
          className="relative mt-12 aspect-[16/9] w-full overflow-hidden rounded-sm border border-white/10 bg-black select-none"
          style={{ cursor: reduce ? "default" : "ew-resize", touchAction: "pan-y" }}
          onMouseDown={(e) => {
            e.preventDefault();
            onPointerDown(e.clientX);
          }}
          onMouseMove={(e) => onPointerMove(e.clientX)}
          onMouseUp={onPointerUp}
          onMouseLeave={onPointerUp}
          onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
          onTouchMove={(e) => onPointerMove(e.touches[0].clientX)}
          onTouchEnd={onPointerUp}
        >
          {/* Render all frames stacked, swap opacity for instant snap with no flicker */}
          {frames.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              draggable={false}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              style={{
                opacity: i === frame ? 1 : 0,
                transition: reduce ? undefined : "opacity 60ms linear",
              }}
            />
          ))}

          {/* Vignette + bottom fade */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.7)_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
        </div>

        {/* Hint + progress arc */}
        <div className="mt-8 flex flex-col items-center">
          <div
            className="font-display text-xs tracking-[0.4em] text-white/70 transition-opacity duration-500"
            style={{ opacity: hintVisible && !reduce ? 1 : 0 }}
            aria-hidden={!hintVisible}
          >
            ⟵ DRAG TO ROTATE ⟶
          </div>

          {/* Thin SVG arc — 0..360° based on progress */}
          <ProgressArc progress={progress} />
        </div>
      </div>
    </section>
  );
}

function ProgressArc({ progress }: { progress: number }) {
  // Half-circle arc (180°) below the hint, fills clockwise based on progress (0..1)
  const R = 60;
  const CIRC = 2 * Math.PI * R;
  const HALF = CIRC / 2;
  const filled = HALF * progress;
  return (
    <svg
      width="160"
      height="46"
      viewBox="0 0 160 46"
      className="mt-4"
      aria-hidden
    >
      <path
        d={`M 20 36 A ${R} ${R} 0 0 1 140 36`}
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d={`M 20 36 A ${R} ${R} 0 0 1 140 36`}
        fill="none"
        stroke="oklch(0.78 0.22 315)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${HALF}`}
        style={{ filter: "drop-shadow(0 0 6px oklch(0.78 0.22 315 / 0.8))" }}
      />
      <text
        x="80"
        y="30"
        textAnchor="middle"
        className="font-display"
        fontSize="9"
        fill="rgba(255,255,255,0.55)"
        style={{ letterSpacing: "0.3em" }}
      >
        {Math.round(progress * 360)}°
      </text>
    </svg>
  );
}