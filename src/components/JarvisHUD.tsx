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

      {/* Side panels — fill empty horizontal space with neural / data readouts */}
      {!isMobile && <SidePanels animate={animate} stage={stage} />}

      {/* HUD core */}
      <div className="relative aspect-square h-[min(70vmin,640px)] w-[min(70vmin,640px)]">
        {/* Car hologram (real wireframe car image) */}
        <motion.img
          src={carHologram}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 w-[88%] -translate-x-1/2 -translate-y-[68%] select-none"
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

          {/* Telemetry block under the car — fills lower empty space */}
          <TelemetryBlock animate={animate} stage={stage} isMobile={isMobile} />

        </svg>

        {/* Standardized status indicators — LABEL · VALUE monospace */}
        <StatusTag position="top-left"     label="SYS"    value="ONLINE" dot />
        <StatusTag position="top-right"    label="STATUS" value={STAGES[stage]} live />
        <StatusTag position="bottom-left"  label="MODEL"  value="ASPECT.v3" />
        <StatusTag position="bottom-right" label="OUTPUT" value="4096×2731" />

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

/**
 * StatusTag — unified status indicator. Format: LABEL · VALUE
 * monospace 10px, letter-spacing 0.08em, accent-purple separator dot.
 */
function StatusTag({
  position,
  label,
  value,
  live,
  dot,
}: {
  position: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  label: string;
  value: string;
  live?: boolean;
  dot?: boolean;
}) {
  const pos = {
    "top-right":    "top-[6%] right-[-2%] justify-end text-right",
    "top-left":     "top-[6%] left-[-2%] justify-start text-left",
    "bottom-right": "bottom-[2%] right-[-2%] justify-end text-right",
    "bottom-left":  "bottom-[2%] left-[-2%] justify-start text-left",
  }[position];

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`absolute flex items-center gap-1.5 font-mono text-[10px] tracking-[0.08em] ${pos}`}
      style={{ letterSpacing: "0.08em" }}
    >
      {dot && (
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#7F77DD] shadow-[0_0_8px_#7F77DD]" />
      )}
      <span className="text-foreground/55">{label}</span>
      <span className="text-[#7F77DD]">·</span>
      {live ? (
        <motion.span
          key={value}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="text-foreground/90"
        >
          {value}
        </motion.span>
      ) : (
        <span className="text-foreground/90">{value}</span>
      )}
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
    // anchor format: { ax, ay (point on car), tx, ty (label position) }
    { x: 138, y: 222, w: 240, h: 50,  label: "HOOD",   sub: "Front Panel",         ax: 258, ay: 222, tx: 320, ty: 178 },
    { x: 270, y: 200, w: 200, h: 64,  label: "GI",     sub: "Global Illumination", ax: 470, ay: 218, tx: 588, ty: 168 },
    { x: 132, y: 280, w: 110, h: 110, label: "WHEEL",  sub: "Front Left",          ax: 156, ay: 360, tx: 30,  ty: 405 },
    { x: 388, y: 280, w: 110, h: 110, label: "SI",     sub: "Surface Integrity",   ax: 470, ay: 360, tx: 590, ty: 405 },
    { x: 196, y: 240, w: 250, h: 36,  label: "PAINT",  sub: "Reflectance",         ax: 320, ay: 250, tx: 590, ty: 252 },
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
          <Annotation
            ax={p.ax}
            ay={p.ay}
            tx={p.tx}
            ty={p.ty}
            label={p.label}
            sub={p.sub}
            stroke={strokeSoft}
          />
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

/**
 * Annotation — blueprint-style leader: anchor dot on the car, dashed leader
 * line with an elbow, short horizontal underline, then label + sublabel.
 */
function Annotation({
  ax,
  ay,
  tx,
  ty,
  label,
  sub,
  stroke,
}: {
  ax: number;
  ay: number;
  tx: number;
  ty: number;
  label: string;
  sub?: string;
  stroke: string;
}) {
  const goingRight = tx > ax;
  // Elbow midpoint creates a 2-segment leader
  const ex = goingRight ? tx - 24 : tx + 24;
  const underlineX1 = goingRight ? tx - 22 : tx + 22;
  const underlineX2 = goingRight ? tx - 2 : tx + 2;
  return (
    <g>
      {/* Anchor dot on the car */}
      <circle cx={ax} cy={ay} r="2.4" fill="oklch(0.92 0.18 290)" />
      <circle cx={ax} cy={ay} r="4.2" fill="none" stroke={stroke} strokeWidth="0.5" strokeOpacity="0.5" />
      {/* Dashed leader: car → elbow → label */}
      <path
        d={`M ${ax} ${ay} L ${ex} ${ty} L ${goingRight ? tx - 4 : tx + 4} ${ty}`}
        stroke={stroke}
        strokeWidth="0.5"
        strokeOpacity="0.7"
        strokeDasharray="2 2.5"
        fill="none"
      />
      {/* Short solid underline below the label */}
      <line
        x1={underlineX1}
        y1={ty + 3}
        x2={underlineX2}
        y2={ty + 3}
        stroke="oklch(0.92 0.14 290)"
        strokeWidth="0.7"
        strokeOpacity="0.85"
      />
      {/* Label */}
      <text
        x={tx}
        y={ty}
        fill="oklch(0.92 0.14 290)"
        fontSize="9"
        letterSpacing="2.5"
        textAnchor={goingRight ? "end" : "start"}
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
      >
        {label}
      </text>
      {sub && (
        <text
          x={tx}
          y={ty + 12}
          fill="oklch(0.92 0.14 290)"
          fillOpacity="0.55"
          fontSize="6.5"
          letterSpacing="1.5"
          textAnchor={goingRight ? "end" : "start"}
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        >
          {sub.toUpperCase()}
        </text>
      )}
    </g>
  );
}

/**
 * SidePanels — fills empty horizontal space on left/right of the HUD with
 * mini neural-net visualizations and rolling data feeds (Jarvis style).
 */
function SidePanels({ animate, stage }: { animate: boolean; stage: number }) {
  return (
    <>
      <div className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 lg:block">
        <SidePanel side="left" animate={animate} stage={stage} />
      </div>
      <div className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 lg:block">
        <SidePanel side="right" animate={animate} stage={stage} />
      </div>
    </>
  );
}

function SidePanel({
  side,
  animate,
  stage,
}: {
  side: "left" | "right";
  animate: boolean;
  stage: number;
}) {
  const stroke = "oklch(0.88 0.16 290)";
  const soft = "oklch(0.78 0.14 280)";
  const align = side === "left" ? "items-start text-left" : "items-end text-right";
  // Rolling log lines
  const logs = [
    "› init.matrix(4096×2731)",
    "› load.model aspect.v3",
    "› analyze.surface ✓",
    "› map.reflections 92%",
    "› denoise.kernel ✓",
    "› color.grade locked",
    "› export.ready",
  ];
  const visibleLogs = logs.slice(0, 4 + (stage % 3));

  return (
    <div className={`flex w-[230px] flex-col gap-4 ${align}`}>
      {/* Header */}
      <div className="flex w-full items-center gap-2">
        <span className="font-display text-[9px] tracking-[0.4em] text-foreground/55">
          {side === "left" ? "NEURAL · INPUT" : "NEURAL · OUTPUT"}
        </span>
        <span className="h-px flex-1 bg-foreground/15" />
      </div>

      {/* Mini neural net SVG */}
      <svg viewBox="0 0 230 130" className="w-full">
        <NeuralMini animate={animate} mirror={side === "right"} />
      </svg>

      {/* Rolling data feed */}
      <div className={`w-full font-mono text-[10px] leading-relaxed text-foreground/65 ${side === "right" ? "text-right" : ""}`}>
        {visibleLogs.map((l, i) => (
          <div
            key={l}
            className="truncate"
            style={{ opacity: 1 - i * 0.12 }}
          >
            {l}
          </div>
        ))}
      </div>

      {/* Mini gauges */}
      <svg viewBox="0 0 230 60" className="w-full">
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${i * 78} 12)`}>
            <circle cx="22" cy="22" r="18" stroke={soft} strokeWidth="1" strokeOpacity="0.4" fill="none" />
            <motion.circle
              cx="22"
              cy="22"
              r="18"
              stroke={stroke}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1 1"
              initial={{ strokeDashoffset: 1 }}
              animate={animate ? { strokeDashoffset: [1, 0.25 + i * 0.15, 1] } : { strokeDashoffset: 0.4 }}
              transition={animate ? { duration: 4 + i, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
              transform="rotate(-90 22 22)"
            />
            <text x="22" y="26" fill="oklch(0.92 0.14 290)" fontSize="9" textAnchor="middle">
              {["AI", "GPU", "NET"][i]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function NeuralMini({ animate, mirror }: { animate: boolean; mirror: boolean }) {
  // 3-layer feedforward network: 4 → 5 → 3 nodes
  const layers = [4, 5, 3];
  const W = 230;
  const H = 130;
  const colX = layers.map((_, i) => 25 + i * ((W - 50) / (layers.length - 1)));
  const nodes: { x: number; y: number; layer: number; idx: number }[] = [];
  layers.forEach((count, li) => {
    for (let i = 0; i < count; i++) {
      const y = 15 + (i + 0.5) * ((H - 30) / count);
      nodes.push({ x: mirror ? W - colX[li] : colX[li], y, layer: li, idx: i });
    }
  });
  const edges: { a: typeof nodes[number]; b: typeof nodes[number]; key: string }[] = [];
  for (let li = 0; li < layers.length - 1; li++) {
    const aNodes = nodes.filter((n) => n.layer === li);
    const bNodes = nodes.filter((n) => n.layer === li + 1);
    aNodes.forEach((a) =>
      bNodes.forEach((b) => edges.push({ a, b, key: `${a.layer}-${a.idx}-${b.idx}` })),
    );
  }
  return (
    <g>
      {edges.map((e, i) => (
        <motion.line
          key={e.key}
          x1={e.a.x}
          y1={e.a.y}
          x2={e.b.x}
          y2={e.b.y}
          stroke="oklch(0.78 0.16 290)"
          strokeWidth="0.6"
          initial={{ opacity: 0.2 }}
          animate={animate ? { opacity: [0.15, 0.8, 0.15] } : { opacity: 0.4 }}
          transition={animate ? { duration: 2.4, delay: (i % 7) * 0.18, repeat: Infinity, ease: "easeInOut" } : { duration: 0 }}
        />
      ))}
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={2.6}
          fill="oklch(0.92 0.18 290)"
          initial={{ opacity: 0.6 }}
          animate={animate ? { opacity: [0.5, 1, 0.5], r: [2.4, 3.4, 2.4] } : { opacity: 1 }}
          transition={animate ? { duration: 2 + (i % 3) * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 } : { duration: 0 }}
        />
      ))}
    </g>
  );
}
