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

/**
 * WireframeCar — side-profile blueprint of a sports car drawn with thin neon
 * strokes. Each segment animates its strokeDashoffset from full → 0 in
 * sequence, producing a "progressively drawn" hologram effect. Nodes pulse
 * at key body points (hood, roof, doors, wheels) once their segment is in.
 */
export function WireframeCar({ reduce }: { reduce: boolean }) {
  // All paths share viewBox 0..600. Car is centered around (300, 300),
  // roughly 320 wide × 110 tall.
  const stroke = "oklch(0.86 0.16 290)";
  const strokeSoft = "oklch(0.78 0.14 280)";

  // Segments (rough side silhouette + structural lines)
  const segments: { d: string; len: number; w?: number; color?: string }[] = [
    // Main body silhouette (hood → windshield → roof → rear glass → trunk → bumper → underbody → front)
    {
      d: "M 160 320 L 200 304 L 232 286 L 270 274 L 304 268 L 336 274 L 372 286 L 408 296 L 436 304 L 444 320",
      len: 320,
      w: 1.1,
    },
    // Underbody / rocker
    { d: "M 168 332 L 436 332", len: 268, w: 0.7, color: strokeSoft },
    // Greenhouse (windows)
    { d: "M 248 286 L 268 270 L 332 270 L 360 286", len: 150, w: 0.9 },
    // A-pillar / B-pillar / C-pillar
    { d: "M 268 270 L 280 286", len: 22, w: 0.6, color: strokeSoft },
    { d: "M 304 270 L 304 286", len: 16, w: 0.6, color: strokeSoft },
    { d: "M 332 270 L 322 286", len: 22, w: 0.6, color: strokeSoft },
    // Door cut line
    { d: "M 220 308 L 304 308 L 360 304", len: 144, w: 0.5, color: strokeSoft },
    // Hood seam
    { d: "M 200 304 L 248 296", len: 50, w: 0.5, color: strokeSoft },
    // Front fascia detail
    { d: "M 160 320 L 168 332 L 184 336", len: 36, w: 0.6, color: strokeSoft },
    // Rear fascia detail
    { d: "M 444 320 L 436 332 L 420 336", len: 36, w: 0.6, color: strokeSoft },
    // Wheel arches
    { d: "M 196 332 A 28 28 0 0 1 252 332", len: 90, w: 0.8 },
    { d: "M 360 332 A 28 28 0 0 1 416 332", len: 90, w: 0.8 },
  ];

  // Wheels (drawn as full circles, animated separately)
  const wheels = [
    { cx: 224, cy: 340, r: 22 },
    { cx: 388, cy: 340, r: 22 },
  ];

  // Highlight nodes — subtle pulsing dots on key parts
  const nodes = [
    { cx: 230, cy: 298, label: "hood", delay: 1.6 },
    { cx: 304, cy: 270, label: "roof", delay: 2.0 },
    { cx: 380, cy: 296, label: "panel", delay: 2.4 },
    { cx: 224, cy: 340, label: "wheel-f", delay: 2.8 },
    { cx: 388, cy: 340, label: "wheel-r", delay: 3.0 },
  ];

  // Total draw cycle ~ 4.5s, then a 1.5s "complete" pause before re-loop.
  // Using strokeDasharray + animated dashoffset.
  const baseDelay = 0.15;
  const stagger = 0.18;

  return (
    <g>
      {/* Faint guide box around car */}
      <rect
        x="148"
        y="248"
        width="304"
        height="112"
        rx="3"
        stroke="oklch(0.78 0.14 290)"
        strokeWidth="0.4"
        strokeOpacity="0.25"
        strokeDasharray="2 4"
        fill="none"
      />
      {/* Corner brackets on guide box */}
      {[
        ["M 148 256 L 148 248 L 156 248", ""],
        ["M 444 248 L 452 248 L 452 256", ""],
        ["M 148 352 L 148 360 L 156 360", ""],
        ["M 444 360 L 452 360 L 452 352", ""],
      ].map(([d], i) => (
        <path
          key={i}
          d={d as string}
          stroke="oklch(0.86 0.16 290)"
          strokeWidth="0.9"
          strokeOpacity="0.7"
          fill="none"
          strokeLinecap="round"
        />
      ))}

      {/* Car body segments */}
      {segments.map((seg, i) => (
        <motion.path
          key={i}
          d={seg.d}
          stroke={seg.color || stroke}
          strokeWidth={seg.w ?? 0.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ strokeDasharray: seg.len, strokeDashoffset: reduce ? 0 : seg.len }}
          animate={
            reduce
              ? undefined
              : {
                  strokeDashoffset: [seg.len, 0, 0, seg.len],
                  opacity: [0.2, 1, 1, 0.2],
                }
          }
          transition={
            reduce
              ? undefined
              : {
                  duration: 6.5,
                  times: [0, 0.35, 0.85, 1],
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: baseDelay + i * stagger,
                }
          }
        />
      ))}

      {/* Wheels */}
      {wheels.map((w, i) => {
        const c = 2 * Math.PI * w.r;
        return (
          <g key={i}>
            <motion.circle
              cx={w.cx}
              cy={w.cy}
              r={w.r}
              stroke={stroke}
              strokeWidth="0.9"
              fill="none"
              style={{ strokeDasharray: c, strokeDashoffset: reduce ? 0 : c }}
              animate={
                reduce
                  ? undefined
                  : { strokeDashoffset: [c, 0, 0, c], opacity: [0.2, 1, 1, 0.2] }
              }
              transition={
                reduce
                  ? undefined
                  : {
                      duration: 6.5,
                      times: [0, 0.45, 0.85, 1],
                      ease: "easeInOut",
                      repeat: Infinity,
                      delay: 1.4 + i * 0.2,
                    }
              }
            />
            <circle cx={w.cx} cy={w.cy} r={w.r * 0.45} stroke={strokeSoft} strokeWidth="0.5" strokeOpacity="0.6" fill="none" />
            <circle cx={w.cx} cy={w.cy} r="1.4" fill={stroke} />
          </g>
        );
      })}

      {/* Pulsing highlight nodes */}
      {nodes.map((n, i) => (
        <motion.g
          key={i}
          animate={
            reduce
              ? undefined
              : { opacity: [0, 1, 1, 0] }
          }
          transition={
            reduce
              ? undefined
              : {
                  duration: 6.5,
                  times: [0, n.delay / 6.5, 0.9, 1],
                  repeat: Infinity,
                }
          }
        >
          <circle cx={n.cx} cy={n.cy} r="3.5" fill="none" stroke={stroke} strokeWidth="0.6" strokeOpacity="0.7" />
          <circle cx={n.cx} cy={n.cy} r="1.4" fill="oklch(0.95 0.14 290)" />
          <motion.circle
            cx={n.cx}
            cy={n.cy}
            r="3.5"
            fill="none"
            stroke={stroke}
            strokeWidth="0.6"
            animate={reduce ? undefined : { r: [3.5, 9], opacity: [0.7, 0] }}
            transition={
              reduce
                ? undefined
                : { duration: 1.8, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }
            }
          />
        </motion.g>
      ))}

      {/* Subtle ground reflection */}
      <line
        x1="170"
        y1="368"
        x2="430"
        y2="368"
        stroke="oklch(0.78 0.14 290)"
        strokeWidth="0.4"
        strokeOpacity="0.4"
        strokeDasharray="1 3"
      />
    </g>
  );
}
