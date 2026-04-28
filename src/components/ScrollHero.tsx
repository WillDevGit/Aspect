import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { MagneticButton } from "@/components/MagneticButton";
import { Particles } from "@/components/Particles";
import { playRevBurst } from "@/components/EngineAudio";
import { CarTransformHero } from "@/components/CarTransformHero";

/**
 * Scroll-driven cinematic hero.
 * Container is ~250vh tall; inner stage is sticky and animates over scroll progress.
 *  0%   : full black, only two glowing headlights
 * 20%   : headlights sweep forward (light beam) revealing front
 * 50%   : full car visible with upward camera push
 * 80%   : specs float in from sides
 */
export function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const reduce = useReducedMotion();

  // If reduced motion, render a static version
  const p = reduce ? null : scrollYProgress;

  // Headlights: visible 0 → 0.25, fade out as car appears
  const headlightOpacity = useTransform(scrollYProgress, [0, 0.05, 0.18, 0.32], [0, 1, 1, 0]);
  const headlightScale = useTransform(scrollYProgress, [0, 0.18, 0.32], [0.6, 1.1, 1.6]);

  // Light beam sweep: 0.12 → 0.32
  const beamOpacity = useTransform(scrollYProgress, [0.1, 0.18, 0.3, 0.34], [0, 0.85, 0.6, 0]);
  const beamX = useTransform(scrollYProgress, [0.1, 0.34], ["-40%", "120%"]);

  // Car reveal: opacity 0 at 0.18 → 1 at 0.45
  const carOpacity = useTransform(scrollYProgress, [0.18, 0.4, 0.55], [0, 0.85, 1]);
  // Camera push (upward) + slight scale
  const carScale = useTransform(scrollYProgress, [0.18, 0.55, 0.85], [1.18, 1.04, 1]);
  const carY = useTransform(scrollYProgress, [0.18, 0.55, 0.85], ["6%", "0%", "-2%"]);
  const carBlur = useTransform(scrollYProgress, [0.18, 0.45], [12, 0]);

  // Background dim → reveal
  const bgOverlay = useTransform(scrollYProgress, [0, 0.45, 1], [1, 0.55, 0.4]);

  const carFilter = useTransform(carBlur, (b) => `blur(${b}px) contrast(1.1) saturate(1.05)`);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);

  // Headline stays put while we scroll over the hero
  const titleOpacity = useTransform(scrollYProgress, [0.35, 0.55, 0.92, 1], [0, 1, 1, 0.7]);
  const titleY = useTransform(scrollYProgress, [0.35, 0.55], [40, 0]);

  // Specs float in at 0.7+
  const specsOpacity = useTransform(scrollYProgress, [0.62, 0.82], [0, 1]);
  const specsXLeft = useTransform(scrollYProgress, [0.62, 0.82], [-80, 0]);
  const specsXRight = useTransform(scrollYProgress, [0.62, 0.82], [80, 0]);

  return (
    <section
      ref={containerRef}
      className="relative bg-black"
      style={{ height: reduce ? "100vh" : "260vh" }}
      aria-label="Hero"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Layer 1 — pure black base */}
        <div className="absolute inset-0 bg-black" />

        {/* Layer 2 — background scene fades in with scroll */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroBg})`,
            scale: p ? carScale : 1,
            y: p ? carY : 0,
            opacity: p ? carOpacity : 1,
            filter: p ? carFilter : "contrast(1.1) saturate(1.05)",
          }}
        />

        {/* Layer 3 — heavy black overlay that lifts on scroll */}
        <motion.div
          className="absolute inset-0 bg-black"
          style={{ opacity: p ? bgOverlay : 0.45 }}
        />

        {/* Layer 4 — left-edge gradient for legibility */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.55)_25%,rgba(0,0,0,0.15)_45%,transparent_60%)]" />

        {/* Layer 5 — vignette + bottom fade */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.7)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent" />

        {/* Layer 6 — headlights (two glowing dots) */}
        {!reduce && (
          <motion.div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            style={{ opacity: headlightOpacity }}
          >
            <motion.div className="relative" style={{ scale: headlightScale }}>
              <Headlight side="left" />
              <Headlight side="right" />
            </motion.div>
          </motion.div>
        )}

        {/* Layer 7 — light beam sweep */}
        {!reduce && (
          <motion.div
            className="pointer-events-none absolute top-1/2 left-0 h-[180px] w-[60%] -translate-y-1/2 mix-blend-screen"
            style={{
              opacity: beamOpacity,
              x: beamX,
              background:
                "linear-gradient(90deg, transparent, oklch(0.92 0.08 315 / 0.85), oklch(0.78 0.22 315 / 0.4), transparent)",
              filter: "blur(20px)",
            }}
          />
        )}

        <Particles count={20} />
        <div className="beam-sweep" />

        {/* Instant car transformation animation */}
        <div className="pointer-events-none absolute inset-0">
          <CarTransformHero />
        </div>

        {/* Foreground content */}
        <div className="relative z-10 mx-auto grid h-full max-w-7xl grid-cols-1 gap-8 px-6 pt-32 pb-16 md:grid-cols-12 md:px-12">
          <motion.div
            className="md:col-span-7 flex flex-col justify-center"
            style={p ? { opacity: titleOpacity, y: titleY } : undefined}
          >
            <div className="mb-6">
              <span className="font-body text-xs font-medium uppercase tracking-[0.35em] text-ember-glow">
                People buy with their eyes first.
              </span>
            </div>

            <h1 className="font-display text-[3.4rem] leading-[0.95] tracking-tight text-foreground sm:text-7xl md:text-[6rem] lg:text-[7rem] [text-shadow:0_2px_40px_rgba(0,0,0,0.8)]">
              Make your car
              <br />
              impossible to{" "}
              <span className="font-editorial text-gradient-animated [filter:drop-shadow(0_0_32px_oklch(0.72_0.22_315_/_0.7))]">
                ignore.
              </span>
            </h1>

            <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              We transform ordinary car photos into high-impact images that
              grab attention and{" "}
              <span className="text-ember-glow font-medium">sell faster</span>.
            </p>

            <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <MagneticButton
                href="mailto:aspecttdigital@gmail.com"
                className="group relative overflow-hidden rounded-full border border-ember/60 bg-transparent px-9 py-4 text-center font-display text-sm tracking-[0.25em] text-foreground shadow-[0_0_30px_-5px_oklch(0.62_0.25_305_/_0.6)] transition hover:bg-ember/10"
              >
                <span
                  className="relative z-10 inline-flex items-center gap-3"
                  onClick={() => playRevBurst()}
                >
                  GET IN TOUCH <span aria-hidden>→</span>
                </span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </MagneticButton>

              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ember/50 text-ember">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                  </svg>
                </span>
                <div className="leading-tight">
                  <div className="font-display text-sm tracking-[0.2em] text-foreground">
                    FAST. POWERFUL. IRRESISTIBLE.
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    Photos that sell
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Specs float in from sides */}
          <div className="md:col-span-12 mt-auto flex flex-wrap gap-x-10 gap-y-6">
            <motion.div style={p ? { opacity: specsOpacity, x: specsXLeft } : undefined}>
              <InlineStat value="3X" label="More views" />
            </motion.div>
            <span className="hidden h-10 w-px self-center bg-white/15 sm:block" />
            <motion.div style={p ? { opacity: specsOpacity } : undefined}>
              <InlineStat value="2.7X" label="Faster sales" />
            </motion.div>
            <span className="hidden h-10 w-px self-center bg-white/15 sm:block" />
            <motion.div style={p ? { opacity: specsOpacity, x: specsXRight } : undefined}>
              <InlineStat value="100%" label="Pro quality" />
            </motion.div>
          </div>
        </div>

        {/* Scroll hint */}
        {!reduce && (
          <motion.div
            className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-center"
            style={{ opacity: hintOpacity }}
          >
            <div className="font-display text-[10px] tracking-[0.4em] text-ember-glow">SCROLL TO REVEAL</div>
            <div className="mx-auto mt-2 h-8 w-px bg-gradient-to-b from-ember-glow to-transparent" />
          </motion.div>
        )}
      </div>
    </section>
  );
}

function Headlight({ side }: { side: "left" | "right" }) {
  return (
    <div
      className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white"
      style={{
        [side === "left" ? "right" : "left"]: "60px",
        boxShadow:
          "0 0 18px 4px rgba(255,255,255,0.95), 0 0 60px 18px oklch(0.78 0.22 315 / 0.6), 0 0 180px 60px oklch(0.62 0.25 305 / 0.35)",
      }}
    />
  );
}

function InlineStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-display text-4xl leading-none tracking-tight text-foreground md:text-5xl [text-shadow:0_2px_20px_rgba(0,0,0,0.7)]">
        {value}
      </span>
      <span className="mt-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}