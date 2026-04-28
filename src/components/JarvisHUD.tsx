import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * JarvisHUD — a clean, minimal AI HUD overlay.
 * Concentric rotating rings, tick marks, crosshair, and small data labels
 * that cycle through scan stages. Pure SVG + Framer Motion. Lightweight.
 */
const STAGES = [
  "Surface integrity: OK",
  "Paint quality: Low",
  "Enhancement ready",
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

        {/* Center label below car */}
        <div className="absolute left-1/2 top-[78%] -translate-x-1/2 text-center">
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
  // Coordinate system: 600x600 viewBox. Car centered at (300, 320),
  // ~440px wide × ~150px tall — large, unmistakably a car.
  const stroke = "oklch(0.88 0.16 290)";
  const strokeSoft = "oklch(0.78 0.14 280)";

  // Full sports-car side silhouette as a single closed path (filled faintly + outlined).
  const SILHOUETTE =
    "M 92 360 " +
    "L 108 340 L 132 332 " +                       // front bumper / lower
    "L 152 326 L 176 314 " +                        // hood front
    "L 208 296 L 240 282 " +                        // hood rise to A-pillar
    "L 268 258 L 332 252 " +                        // roof line
    "L 376 274 L 412 296 " +                        // C-pillar to rear deck
    "L 448 308 L 484 318 " +                        // trunk / rear quarter
    "L 504 326 L 512 344 L 508 360 " +              // rear bumper
    "L 470 360 " +                                  // rear bumper bottom
    "A 38 38 0 0 0 394 360 " +                      // rear wheel arch (cut up)
    "L 240 360 " +
    "A 38 38 0 0 0 164 360 " +                      // front wheel arch (cut up)
    "L 92 360 Z";

  // Greenhouse (windows) — second filled shape on top
  const GREENHOUSE =
    "M 244 282 L 268 258 L 332 252 L 372 272 L 360 286 L 256 286 Z";

  // Structural detail lines
  const DETAILS: { d: string; w?: number; soft?: boolean }[] = [
    // Door cut
    { d: "M 220 300 L 220 358", w: 0.7, soft: true },
    // Door handle line
    { d: "M 286 296 L 348 294", w: 0.7, soft: true },
    // Hood seam
    { d: "M 176 314 L 244 296", w: 0.6, soft: true },
    // Side body crease
    { d: "M 144 332 L 500 326", w: 0.6, soft: true },
    // Rocker panel
    { d: "M 200 360 L 380 360", w: 0.5, soft: true },
    // Window cross-frame
    { d: "M 304 252 L 304 286", w: 0.5, soft: true },
    // Front headlight
    { d: "M 108 340 L 138 336", w: 1.0 },
    // Rear taillight
    { d: "M 484 318 L 506 326", w: 1.0 },
  ];

  // Wheels
  const wheels = [
    { cx: 202, cy: 360, r: 38 },
    { cx: 432, cy: 360, r: 38 },
  ];

  // Highlighted parts with bounding boxes + labels
  const parts = [
    { x: 150, y: 296, w: 100, h: 24, label: "HOOD",   anchor: "M 250 308 L 296 230 L 360 230" },
    { x: 244, y: 246, w: 132, h: 44, label: "GLASS",  anchor: "M 376 268 L 446 220 L 510 220" },
    { x: 162, y: 320, w: 80,  h: 40, label: "WHEEL",  anchor: "M 162 360 L 110 410 L 50 410" },
    { x: 392, y: 320, w: 80,  h: 40, label: "PANEL",  anchor: "M 472 340 L 528 410 L 588 410" },
  ];

  return (
    <g>
      {/* Faint guide bracket frame around car */}
      {[
        "M 80 232 L 70 232 L 70 244",
        "M 520 232 L 530 232 L 530 244",
        "M 80 388 L 70 388 L 70 376",
        "M 520 388 L 530 388 L 530 376",
      ].map((d, i) => (
        <path key={i} d={d} stroke={stroke} strokeWidth="0.9" strokeOpacity="0.6" fill="none" strokeLinecap="round" />
      ))}

      {/* Car silhouette — always visible */}
      <path
        d={SILHOUETTE}
        fill="oklch(0.78 0.18 290 / 0.10)"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d={GREENHOUSE}
        fill="oklch(0.78 0.18 290 / 0.06)"
        stroke={stroke}
        strokeWidth="1.0"
        strokeLinejoin="round"
      />

      {/* Detail lines */}
      {DETAILS.map((d, i) => (
        <path
          key={i}
          d={d.d}
          stroke={d.soft ? strokeSoft : stroke}
          strokeWidth={d.w ?? 0.7}
          strokeOpacity={d.soft ? 0.55 : 0.85}
          strokeLinecap="round"
          fill="none"
        />
      ))}

      {/* Wheels — outer rim + spokes */}
      {wheels.map((w, i) => (
        <g key={i}>
          <circle cx={w.cx} cy={w.cy} r={w.r} stroke={stroke} strokeWidth="1.2" fill="oklch(0.12 0.02 290)" />
          <circle cx={w.cx} cy={w.cy} r={w.r * 0.62} stroke={strokeSoft} strokeWidth="0.7" fill="none" strokeOpacity="0.7" />
          <circle cx={w.cx} cy={w.cy} r={w.r * 0.22} stroke={stroke} strokeWidth="0.8" fill="none" />
          <motion.g
            style={{ transformOrigin: `${w.cx}px ${w.cy}px` }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={reduce ? undefined : { duration: 14 + i * 2, ease: "linear", repeat: Infinity }}
          >
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <line
                key={deg}
                x1={w.cx}
                y1={w.cy}
                x2={w.cx + Math.cos((deg * Math.PI) / 180) * w.r * 0.55}
                y2={w.cy + Math.sin((deg * Math.PI) / 180) * w.r * 0.55}
                stroke={strokeSoft}
                strokeWidth="0.6"
                strokeOpacity="0.6"
              />
            ))}
          </motion.g>
          <circle cx={w.cx} cy={w.cy} r="2" fill={stroke} />
        </g>
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
              : { duration: 4.5, times: [0, 0.2, 0.5, 0.8, 1], delay: i * 0.6, repeat: Infinity }
          }
        >
          <rect
            x={p.x}
            y={p.y}
            width={p.w}
            height={p.h}
            stroke={stroke}
            strokeWidth="0.8"
            strokeOpacity="0.9"
            fill="oklch(0.78 0.18 290 / 0.05)"
            rx="2"
          />
          {/* Bracket corners */}
          {[
            [p.x, p.y + 6, p.x, p.y, p.x + 6, p.y],
            [p.x + p.w - 6, p.y, p.x + p.w, p.y, p.x + p.w, p.y + 6],
            [p.x, p.y + p.h - 6, p.x, p.y + p.h, p.x + 6, p.y + p.h],
            [p.x + p.w - 6, p.y + p.h, p.x + p.w, p.y + p.h, p.x + p.w, p.y + p.h - 6],
          ].map((c, j) => (
            <path
              key={j}
              d={`M ${c[0]} ${c[1]} L ${c[2]} ${c[3]} L ${c[4]} ${c[5]}`}
              stroke={stroke}
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            />
          ))}
          {/* Anchor line out to label */}
          <path d={p.anchor} stroke={strokeSoft} strokeWidth="0.6" strokeOpacity="0.7" fill="none" />
          {/* Label text on the anchor end */}
          <PartLabel anchor={p.anchor} label={p.label} />
        </motion.g>
      ))}

      {/* Scan line sweeping left → right across the car */}
      {!reduce && (
        <motion.g
          initial={{ x: -440 }}
          animate={{ x: 0 }}
          transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
        >
          <defs>
            <linearGradient id="scan-vertical" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(0.85 0.18 290)" stopOpacity="0" />
              <stop offset="50%" stopColor="oklch(0.92 0.18 290)" stopOpacity="0.85" />
              <stop offset="100%" stopColor="oklch(0.85 0.18 290)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect x="80" y="232" width="14" height="160" fill="url(#scan-vertical)" />
          <line x1="87" y1="232" x2="87" y2="392" stroke="oklch(0.95 0.18 290)" strokeWidth="0.8" strokeOpacity="0.9" />
        </motion.g>
      )}

      {/* Holographic projection platform under the car */}
      <g>
        {/* Concentric ellipses suggesting a 3D disc */}
        {[0, 1, 2, 3].map((i) => (
          <ellipse
            key={i}
            cx="300"
            cy="408"
            rx={210 - i * 40}
            ry={(210 - i * 40) * 0.16}
            stroke={i === 0 ? stroke : strokeSoft}
            strokeWidth={i === 0 ? 0.9 : 0.5}
            strokeOpacity={0.7 - i * 0.12}
            fill="none"
            strokeDasharray={i % 2 ? "3 4" : undefined}
          />
        ))}
        {/* Tiny tick markers around outer ring */}
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * Math.PI * 2;
          const rx = 210, ry = 210 * 0.16;
          const x1 = 300 + Math.cos(a) * rx;
          const y1 = 408 + Math.sin(a) * ry;
          const x2 = 300 + Math.cos(a) * (rx + 4);
          const y2 = 408 + Math.sin(a) * (ry + 0.6);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={stroke}
              strokeWidth="0.5"
              strokeOpacity={i % 9 === 0 ? 0.9 : 0.4}
            />
          );
        })}
        {/* Vertical light pillars rising from the disc */}
        {!reduce &&
          [-160, -100, -40, 40, 100, 160].map((dx, i) => (
            <motion.line
              key={i}
              x1={300 + dx}
              y1={408}
              x2={300 + dx}
              y2={368}
              stroke="oklch(0.92 0.16 290)"
              strokeWidth="0.7"
              strokeLinecap="round"
              animate={{ opacity: [0.15, 0.85, 0.15] }}
              transition={{ duration: 2.4, delay: i * 0.18, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        {/* Soft glow under the car */}
        <ellipse
          cx="300"
          cy="408"
          rx="180"
          ry="22"
          fill="oklch(0.78 0.20 290 / 0.18)"
        />
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
