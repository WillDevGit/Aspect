import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * JarvisHUD — a clean, minimal AI HUD overlay.
 * Concentric rotating rings, tick marks, crosshair, and small data labels
 * that cycle through scan stages. Pure SVG + Framer Motion. Lightweight.
 */
const STAGES = [
  "Surface mapped",
  "Geometry analyzed",
  "Enhancement ready",
  "Reflections calibrated",
  "Render complete",
];

export function JarvisHUD({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setStage((s) => (s + 1) % STAGES.length), 2200);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Background gradient wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, oklch(0.22 0.06 290 / 0.35) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, oklch(0.18 0.08 260 / 0.25) 0%, transparent 60%)",
        }}
      />

      {/* HUD core */}
      <div className="relative aspect-square h-[min(78vmin,720px)] w-[min(78vmin,720px)]">
        <svg
          viewBox="0 0 600 600"
          className="absolute inset-0 h-full w-full"
          fill="none"
        >
          <defs>
            <linearGradient id="hud-stroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.78 0.16 290)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="oklch(0.72 0.18 250)" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="hud-stroke-soft" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(0.78 0.16 290)" stopOpacity="0" />
              <stop offset="50%" stopColor="oklch(0.78 0.16 290)" stopOpacity="0.75" />
              <stop offset="100%" stopColor="oklch(0.78 0.16 290)" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="hud-glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="oklch(0.78 0.18 290)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="oklch(0.78 0.18 290)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Soft inner glow */}
          <circle cx="300" cy="300" r="220" fill="url(#hud-glow)" />

          {/* Outer ring with tick marks */}
          <motion.g
            style={{ transformOrigin: "300px 300px" }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 80, ease: "linear", repeat: Infinity }}
          >
            <circle cx="300" cy="300" r="270" stroke="url(#hud-stroke)" strokeWidth="0.6" strokeOpacity="0.6" />
            {Array.from({ length: 72 }).map((_, i) => {
              const long = i % 6 === 0;
              const a = (i / 72) * Math.PI * 2;
              const r1 = 270;
              const r2 = long ? 256 : 263;
              const x1 = 300 + Math.cos(a) * r1;
              const y1 = 300 + Math.sin(a) * r1;
              const x2 = 300 + Math.cos(a) * r2;
              const y2 = 300 + Math.sin(a) * r2;
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="oklch(0.78 0.16 290)"
                  strokeWidth={long ? 1 : 0.5}
                  strokeOpacity={long ? 0.9 : 0.45}
                />
              );
            })}
          </motion.g>

          {/* Counter-rotating thinner ring */}
          <motion.g
            style={{ transformOrigin: "300px 300px" }}
            animate={reduce ? undefined : { rotate: -360 }}
            transition={{ duration: 120, ease: "linear", repeat: Infinity }}
          >
            <circle cx="300" cy="300" r="230" stroke="oklch(0.72 0.16 280)" strokeWidth="0.4" strokeOpacity="0.35" strokeDasharray="2 6" />
            {/* Four corner brackets */}
            {[0, 90, 180, 270].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 300 300)`}>
                <path
                  d="M 300 60 L 300 50 L 314 50"
                  stroke="url(#hud-stroke)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </g>
            ))}
          </motion.g>

          {/* Mid ring with sweeping arc */}
          <circle cx="300" cy="300" r="180" stroke="oklch(0.78 0.16 290)" strokeWidth="0.5" strokeOpacity="0.45" />
          <motion.g
            style={{ transformOrigin: "300px 300px" }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 6, ease: "linear", repeat: Infinity }}
          >
            <path
              d="M 300 120 A 180 180 0 0 1 456 240"
              stroke="url(#hud-stroke-soft)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </motion.g>

          {/* Inner ring + crosshair */}
          <circle cx="300" cy="300" r="120" stroke="oklch(0.78 0.16 290)" strokeWidth="0.5" strokeOpacity="0.5" />
          <motion.g
            style={{ transformOrigin: "300px 300px" }}
            animate={reduce ? undefined : { rotate: -360 }}
            transition={{ duration: 24, ease: "linear", repeat: Infinity }}
          >
            <path d="M 300 180 L 300 200" stroke="oklch(0.85 0.14 290)" strokeWidth="1" strokeLinecap="round" />
            <path d="M 300 400 L 300 420" stroke="oklch(0.85 0.14 290)" strokeWidth="1" strokeLinecap="round" />
            <path d="M 180 300 L 200 300" stroke="oklch(0.85 0.14 290)" strokeWidth="1" strokeLinecap="round" />
            <path d="M 400 300 L 420 300" stroke="oklch(0.85 0.14 290)" strokeWidth="1" strokeLinecap="round" />
          </motion.g>

          {/* Wireframe car blueprint (side profile) */}
          <WireframeCar reduce={!!reduce} />

          {/* Connector lines to data labels (top-right & bottom-left) */}
          <g stroke="oklch(0.78 0.16 290)" strokeWidth="0.6" strokeOpacity="0.55">
            <path d="M 470 170 L 520 130 L 590 130" />
            <path d="M 130 430 L 80 470 L 10 470" />
            <path d="M 470 430 L 520 470 L 590 470" />
            <path d="M 130 170 L 80 130 L 10 130" />
          </g>
          <g fill="oklch(0.92 0.14 290)">
            <circle cx="470" cy="170" r="2" />
            <circle cx="130" cy="430" r="2" />
            <circle cx="470" cy="430" r="2" />
            <circle cx="130" cy="170" r="2" />
          </g>
        </svg>

        {/* Data labels (HTML, crisp text) */}
        <DataLabel position="top-right" title="STATUS" value={STAGES[stage]} live />
        <DataLabel position="bottom-right" title="OUTPUT" value="4096 × 2731" />
        <DataLabel position="bottom-left" title="MODEL" value="ASPECT.v3" />
        <DataLabel position="top-left" title="SYS" value="ONLINE" dot />

        {/* Center label */}
        <div className="absolute left-1/2 top-[68%] -translate-x-1/2 text-center">
          <div className="font-display text-[10px] tracking-[0.5em] text-foreground/70">
            A · S · P · E · C · T
          </div>
          <div className="mt-1 font-body text-[9px] tracking-[0.35em] text-foreground/40">
            VISUAL INTELLIGENCE
          </div>
        </div>
      </div>
    </div>
  );
}

function DataLabel({
  position,
  title,
  value,
  live,
  dot,
}: {
  position: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  title: string;
  value: string;
  live?: boolean;
  dot?: boolean;
}) {
  const pos = {
    "top-right": "top-[14%] right-[-2%] items-start text-left",
    "top-left": "top-[14%] left-[-2%] items-end text-right",
    "bottom-right": "bottom-[14%] right-[-2%] items-start text-left",
    "bottom-left": "bottom-[14%] left-[-2%] items-end text-right",
  }[position];

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`absolute flex flex-col gap-0.5 ${pos}`}
    >
      <span className="font-display text-[9px] tracking-[0.4em] text-foreground/45">
        {title}
      </span>
      <span className="flex items-center gap-1.5 font-body text-[11px] tracking-[0.18em] text-foreground/85">
        {dot && (
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.85_0.16_290)] shadow-[0_0_8px_oklch(0.85_0.16_290)]" />
        )}
        {live ? (
          <motion.span
            key={value}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {value}
          </motion.span>
        ) : (
          value
        )}
      </span>
    </motion.div>
  );
}
