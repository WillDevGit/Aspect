import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { MagneticButton } from "@/components/MagneticButton";
import { JarvisHUD } from "@/components/JarvisHUD";

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

  // HUD subtle parallax/fade as user scrolls past hero
  const hudOpacity = useTransform(scrollYProgress, [0, 0.5, 0.95], [1, 0.85, 0.2]);
  const hudScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
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
      className="relative bg-transparent"
      style={{ height: reduce ? "100vh" : "115vh" }}
      aria-label="Hero"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Layer 1 — translucent base lets the neural net mesh show through */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Layer 2 — left-edge gradient for legibility */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.55)_25%,rgba(0,0,0,0.15)_45%,transparent_60%)]" />

        {/* Layer 3 — vignette + bottom fade */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.7)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent" />

        {/* Layer 4 — Jarvis-style AI HUD */}
        <motion.div
          className="absolute inset-0"
          style={p ? { opacity: hudOpacity, scale: hudScale } : undefined}
        >
          <JarvisHUD />
        </motion.div>

        {/* Foreground content */}
        <div className="relative z-10 mx-auto grid h-full max-w-7xl grid-cols-1 gap-8 px-6 pt-32 pb-16 md:grid-cols-12 md:px-12">
          <motion.div
            className="md:col-span-7 flex flex-col justify-center"
            style={p ? { opacity: titleOpacity, y: titleY } : undefined}
          >
            <div className="mb-6">
              <span className="font-body text-xs font-medium uppercase tracking-[0.35em] text-ember-glow">
                Your competitors are already doing this.
              </span>
            </div>

            <h1 className="font-display text-[3.4rem] leading-[0.95] tracking-tight text-foreground sm:text-7xl md:text-[6rem] lg:text-[7rem] [text-shadow:0_2px_40px_rgba(0,0,0,0.8)]">
              First
              <br />
              impressions are
              <br />
              built{" "}
              <span className="font-editorial text-gradient-animated [filter:drop-shadow(0_0_32px_oklch(0.72_0.22_315_/_0.7))]">
                here.
              </span>
            </h1>

            <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              We transform ordinary vehicle photos into high-impact images
              that grab attention—and{" "}
              <span className="text-ember-glow font-medium">close the sale</span>.
            </p>

            <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <MagneticButton
                href="mailto:aspecttdigital@gmail.com"
                className="group relative overflow-hidden rounded-full border border-ember/60 bg-transparent px-9 py-4 text-center font-display text-sm tracking-[0.25em] text-foreground shadow-[0_0_30px_-5px_oklch(0.62_0.25_305_/_0.6)] transition hover:bg-ember/10"
              >
                <span className="relative z-10 inline-flex items-center gap-3">
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