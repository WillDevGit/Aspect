import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import carHologram from "@/assets/car-hologram.png";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * JarvisHUD — a clean, minimal AI HUD overlay.
 * Concentric rotating rings, tick marks, crosshair, and small data labels
 * that cycle through scan stages. Pure SVG + Framer Motion. Lightweight.
 */
const STAGES = [
  "Surface integrity: OK",
  "Paint quality: Low",
  "Enhancement ready",
  "Reflection map: 92%",
  "Color grade: locked",
];

export function JarvisHUD({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const [stage, setStage] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  // Pause all animations when HUD scrolls offscreen — major scroll-perf win.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "100px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const animate = !reduce && inView;

  useEffect(() => {
    if (!animate) return;
    const id = setInterval(() => setStage((s) => (s + 1) % STAGES.length), 2200);
    return () => clearInterval(id);
  }, [animate]);

  return (
    <div
      ref={rootRef}
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
        {/* Car hologram (real wireframe car image) */}
        <motion.img
          src={carHologram}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 w-[82%] -translate-x-1/2 -translate-y-[68%] select-none"
          style={{
            filter: "drop-shadow(0 0 30px oklch(0.78 0.22 290 / 0.55)) brightness(1.1) contrast(1.05)",
            maskImage: "radial-gradient(ellipse 60% 70% at 50% 50%, black 55%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 60% 70% at 50% 50%, black 55%, transparent 100%)",
            willChange: "transform, opacity",
          }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          loading="lazy"
          decoding="async"
        />
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
            style={{ transformOrigin: "300px 300px", willChange: "transform" }}
            animate={animate ? { rotate: 360 } : { rotate: 0 }}
            transition={animate ? { duration: 80, ease: "linear", repeat: Infinity } : { duration: 0 }}
          >
            <circle cx="300" cy="300" r="270" stroke="url(#hud-stroke)" strokeWidth="0.6" strokeOpacity="0.6" />
            {Array.from({ length: isMobile ? 36 : 72 }).map((_, i) => {
              const long = i % 6 === 0;
              const total = isMobile ? 36 : 72;
              const a = (i / total) * Math.PI * 2;
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
            style={{ transformOrigin: "300px 300px", willChange: "transform" }}
            animate={animate ? { rotate: -360 } : { rotate: 0 }}
            transition={animate ? { duration: 120, ease: "linear", repeat: Infinity } : { duration: 0 }}
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
            style={{ transformOrigin: "300px 300px", willChange: "transform" }}
            animate={animate ? { rotate: 360 } : { rotate: 0 }}
            transition={animate ? { duration: 6, ease: "linear", repeat: Infinity } : { duration: 0 }}
          >
            <path
              d="M 300 120 A 180 180 0 0 1 456 240"
              stroke="url(#hud-stroke-soft)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </motion.g>

          {/* Wireframe car blueprint (side profile) */}
          <WireframeCar reduce={!animate} isMobile={isMobile} />

          {/* Radar sweep arc (rotating wedge) */}
          {animate && (
            <motion.g
              style={{ transformOrigin: "300px 300px", willChange: "transform" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, ease: "linear", repeat: Infinity }}
            >
              <defs>
                <linearGradient id="radar-sweep" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="oklch(0.85 0.2 290)" stopOpacity="0" />
                  <stop offset="100%" stopColor="oklch(0.92 0.2 290)" stopOpacity="0.55" />
                </linearGradient>
              </defs>
              <path
                d="M 300 300 L 530 300 A 230 230 0 0 0 460 137 Z"
                fill="url(#radar-sweep)"
                opacity="0.7"
              />
            </motion.g>
          )}

          {/* Telemetry block under the car — fills lower empty space */}
          <TelemetryBlock animate={animate} stage={stage} isMobile={isMobile} />

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

        {/* Center label below telemetry */}
        <div className="absolute left-1/2 top-[94%] -translate-x-1/2 text-center">
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

/**
 * TelemetryBlock — animated SVG telemetry placed just below the car hologram
 * to fill the empty lower hemisphere of the HUD. Includes:
 *  - animated waveform / spectrum
 *  - dual progress bars
 *  - lat/long-style coordinate readout
 *  - boot log lines that cycle
 */
function TelemetryBlock({
  animate,
  stage,
  isMobile,
}: {
  animate: boolean;
  stage: number;
  isMobile: boolean;
}) {
  const stroke = "oklch(0.88 0.16 290)";
  const strokeSoft = "oklch(0.78 0.14 280)";
  // Spectrum bars
  const bars = isMobile ? 24 : 40;
  const barHeights = useWaveform(bars, animate);

  return (
    <g>
      {/* Frame */}
      <path
        d="M 110 470 L 100 470 L 100 482"
        stroke={stroke}
        strokeWidth="0.9"
        strokeOpacity="0.7"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 490 470 L 500 470 L 500 482"
        stroke={stroke}
        strokeWidth="0.9"
        strokeOpacity="0.7"
        fill="none"
        strokeLinecap="round"
      />
      <line x1="110" y1="470" x2="490" y2="470" stroke={strokeSoft} strokeWidth="0.4" strokeOpacity="0.5" />

      {/* Section label */}
      <text x="120" y="464" fill="oklch(0.92 0.14 290)" fontSize="8" letterSpacing="3">
        TELEMETRY · LIVE
      </text>
      <circle cx="115" cy="461" r="2" fill="oklch(0.92 0.18 290)">
        {animate && <animate attributeName="opacity" values="1;0.2;1" dur="1.4s" repeatCount="indefinite" />}
      </circle>

      {/* Spectrum / waveform */}
      <g transform="translate(118 482)">
        {barHeights.map((h, i) => {
          const w = (364 / bars) - 1.2;
          const x = i * (364 / bars);
          return (
            <rect
              key={i}
              x={x}
              y={26 - h}
              width={w}
              height={h}
              fill={i % 5 === 0 ? "oklch(0.92 0.2 290)" : strokeSoft}
              opacity={0.55 + (h / 28) * 0.45}
              rx="0.6"
            />
          );
        })}
        <line x1="0" y1="26" x2="364" y2="26" stroke={strokeSoft} strokeWidth="0.4" strokeOpacity="0.4" />
      </g>

      {/* Dual progress bars */}
      <g transform="translate(118 522)">
        <text x="0" y="0" fill="oklch(0.92 0.14 290)" fontSize="7" letterSpacing="2.5">
          ENHANCEMENT
        </text>
        <rect x="0" y="4" width="170" height="4" fill="oklch(0.3 0.05 290 / 0.6)" rx="1" />
        <ProgressBar x={0} y={4} max={170} duration={5} animate={animate} />

        <text x="194" y="0" fill="oklch(0.92 0.14 290)" fontSize="7" letterSpacing="2.5">
          NOISE REDUCTION
        </text>
        <rect x="194" y="4" width="170" height="4" fill="oklch(0.3 0.05 290 / 0.6)" rx="1" />
        <ProgressBar x={194} y={4} max={170} duration={7} animate={animate} delay={0.6} />
      </g>

      {/* Coordinates / readouts row */}
      <g transform="translate(118 548)" fill="oklch(0.85 0.1 280)" fontSize="8" letterSpacing="2">
        <text x="0" y="0">LAT 23°33'01"S</text>
        <text x="120" y="0">LON 46°38'02"W</text>
        <text x="240" y="0">FPS 60</text>
        <text x="290" y="0">PASS {String(stage + 1).padStart(2, "0")}/05</text>
      </g>

      {/* Pulsing marker line */}
      {animate && !isMobile && (
        <motion.line
          x1="118"
          y1="482"
          x2="118"
          y2="508"
          stroke="oklch(0.97 0.18 290)"
          strokeWidth="0.8"
          animate={{ x1: [118, 482], x2: [118, 482] }}
          transition={{ duration: 4, ease: "linear", repeat: Infinity }}
        />
      )}
    </g>
  );
}

function ProgressBar({
  x,
  y,
  max,
  duration,
  delay = 0,
  animate,
}: {
  x: number;
  y: number;
  max: number;
  duration: number;
  delay?: number;
  animate: boolean;
}) {
  return (
    <motion.rect
      x={x}
      y={y}
      height={4}
      fill="oklch(0.85 0.2 290)"
      rx={1}
      initial={{ width: 0 }}
      animate={animate ? { width: [0, max, max * 0.65, max] } : { width: max * 0.7 }}
      transition={animate ? { duration, delay, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
    />
  );
}

function useWaveform(count: number, animate: boolean) {
  const [heights, setHeights] = useState<number[]>(() =>
    Array.from({ length: count }, () => 4 + Math.random() * 18),
  );
  useEffect(() => {
    if (!animate) return;
    const id = setInterval(() => {
      setHeights((prev) =>
        prev.map((h) => {
          const target = 4 + Math.random() * 22;
          return h + (target - h) * 0.55;
        }),
      );
    }, 110);
    return () => clearInterval(id);
  }, [animate, count]);
  return heights;
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
export function WireframeCar({ reduce, isMobile = false }: { reduce: boolean; isMobile?: boolean }) {
  // Pure HUD overlay around the hologram image: guide brackets, bounding
  // boxes on car parts, sweeping scan line, holographic projection platform.
  const stroke = "oklch(0.88 0.16 290)";
  const strokeSoft = "oklch(0.78 0.14 280)";

  // Coordinates calibrated to the car hologram image (centered ~300,290,
  // ~440 wide × ~200 tall in the 600 viewBox).
  const parts = [
    // x, y, w, h on viewBox; anchor path ends at label x,y
    { x: 138, y: 222, w: 240, h: 50, label: "HOOD",       anchor: "M 258 222 L 258 188 L 320 188" },
    { x: 270, y: 200, w: 200, h: 64, label: "GLASS",      anchor: "M 470 218 L 520 178 L 588 178" },
    { x: 132, y: 280, w: 110, h: 110, label: "WHEEL",     anchor: "M 132 332 L 78 380 L 30 380" },
    { x: 388, y: 280, w: 110, h: 110, label: "WHEEL  R",  anchor: "M 498 332 L 552 380 L 590 380" },
    { x: 196, y: 240, w: 250, h: 36, label: "SURFACE",    anchor: "M 446 252 L 520 252 L 590 252" },
  ];

  return (
    <g>
      {/* Outer guide bracket frame around the car hologram */}
      {[
        "M 80 192 L 70 192 L 70 204",
        "M 520 192 L 530 192 L 530 204",
        "M 80 398 L 70 398 L 70 386",
        "M 520 398 L 530 398 L 530 386",
      ].map((d, i) => (
        <path key={i} d={d} stroke={stroke} strokeWidth="0.9" strokeOpacity="0.7" fill="none" strokeLinecap="round" />
      ))}

      {/* Bounding boxes on parts + connector + label */}
      {parts.map((p, i) => (
        <motion.g
          key={p.label}
          initial={{ opacity: 0.55 }}
          animate={reduce ? { opacity: 1 } : { opacity: [0.55, 1, 0.7, 1, 0.55] }}
          transition={
            reduce
              ? undefined
              : { duration: 4.5, times: [0, 0.2, 0.5, 0.8, 1], delay: i * 0.5, repeat: Infinity }
          }
        >
          {/* Bracket corners only — no full rectangle, keeps it minimal */}
          {[
            [p.x, p.y + 8, p.x, p.y, p.x + 8, p.y],
            [p.x + p.w - 8, p.y, p.x + p.w, p.y, p.x + p.w, p.y + 8],
            [p.x, p.y + p.h - 8, p.x, p.y + p.h, p.x + 8, p.y + p.h],
            [p.x + p.w - 8, p.y + p.h, p.x + p.w, p.y + p.h, p.x + p.w, p.y + p.h - 8],
          ].map((c, j) => (
            <path
              key={j}
              d={`M ${c[0]} ${c[1]} L ${c[2]} ${c[3]} L ${c[4]} ${c[5]}`}
              stroke={stroke}
              strokeWidth="1.3"
              fill="none"
              strokeLinecap="round"
            />
          ))}
          <path d={p.anchor} stroke={strokeSoft} strokeWidth="0.6" strokeOpacity="0.7" fill="none" />
          <PartLabel anchor={p.anchor} label={p.label} />
        </motion.g>
      ))}

      {/* Vertical scan beam sweeping left → right across the car */}
      {!reduce && !isMobile && (
        <motion.g
          initial={{ x: -440 }}
          animate={{ x: 0 }}
          transition={{ duration: 3.6, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        >
          <defs>
            <linearGradient id="scan-vertical" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(0.85 0.18 290)" stopOpacity="0" />
              <stop offset="50%" stopColor="oklch(0.95 0.18 290)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="oklch(0.85 0.18 290)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect x="80" y="192" width="14" height="206" fill="url(#scan-vertical)" />
          <line x1="87" y1="192" x2="87" y2="398" stroke="oklch(0.97 0.18 290)" strokeWidth="0.8" strokeOpacity="0.95" />
        </motion.g>
      )}

      {/* Holographic projection platform under the car */}
      <g>
        {[0, 1, 2, 3].map((i) => (
          <ellipse
            key={i}
            cx="300"
            cy="426"
            rx={210 - i * 40}
            ry={(210 - i * 40) * 0.16}
            stroke={i === 0 ? stroke : strokeSoft}
            strokeWidth={i === 0 ? 0.9 : 0.5}
            strokeOpacity={0.7 - i * 0.12}
            fill="none"
            strokeDasharray={i % 2 ? "3 4" : undefined}
          />
        ))}
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * Math.PI * 2;
          const rx = 210, ry = 210 * 0.16;
          const x1 = 300 + Math.cos(a) * rx;
          const y1 = 426 + Math.sin(a) * ry;
          const x2 = 300 + Math.cos(a) * (rx + 4);
          const y2 = 426 + Math.sin(a) * (ry + 0.6);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth="0.5" strokeOpacity={i % 9 === 0 ? 0.9 : 0.4} />
          );
        })}
        {!reduce && !isMobile &&
          [-160, -100, -40, 40, 100, 160].map((dx, i) => (
            <motion.line
              key={i}
              x1={300 + dx}
              y1={426}
              x2={300 + dx}
              y2={398}
              stroke="oklch(0.92 0.16 290)"
              strokeWidth="0.7"
              strokeLinecap="round"
              animate={{ opacity: [0.15, 0.85, 0.15] }}
              transition={{ duration: 2.4, delay: i * 0.18, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        <ellipse cx="300" cy="426" rx="180" ry="22" fill="oklch(0.78 0.20 290 / 0.18)" />
      </g>
    </g>
  );
}

export function PartLabel({ anchor, label }: { anchor: string; label: string }) {
  // Extract last "x y" pair from path
  const tokens = anchor.trim().split(/\s+/);
  const y = Number(tokens[tokens.length - 1]);
  const x = Number(tokens[tokens.length - 2]);
  return (
    <text
      x={x}
      y={y - 6}
      fill="oklch(0.92 0.14 290)"
      fontSize="9"
      letterSpacing="3"
      fontFamily="ui-sans-serif, system-ui"
    >
      {label}
    </text>
  );
}
