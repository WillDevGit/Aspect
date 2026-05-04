import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { JarvisHUD } from "@/components/JarvisHUD";
import { HeroHeadline } from "@/components/HeroHeadline";

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
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.4, 0.8], [1, 0.9, 0]);
  const headlineY = useTransform(scrollYProgress, [0, 0.6], [0, -30]);

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

        {/* Layer 2 — top fade for headline legibility */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-black/85 via-black/40 to-transparent" />

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

        {/* Foreground — centered editorial headline above the car */}
        <motion.div
          className="pointer-events-none relative z-20 mx-auto flex w-full flex-col items-center pt-28 text-center md:pt-32"
          style={p ? { opacity: headlineOpacity, y: headlineY } : undefined}
        >
          <HeroHeadline />
        </motion.div>

        {/* Scroll hint */}
        {!reduce && (
          <motion.div
            className="pointer-events-none absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center pt-4 text-center"
            style={{ opacity: hintOpacity }}
          >
            <div
              className="font-mono text-[11px] uppercase text-ember-glow"
              style={{ letterSpacing: "0.15em" }}
            >
              Scroll to reveal
            </div>
            <motion.svg
              width="14"
              height="22"
              viewBox="0 0 14 22"
              className="mt-3 text-ember-glow"
              animate={{ y: [0, 6, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
            >
              <path
                d="M2 4 L7 10 L12 4 M2 12 L7 18 L12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
            <div className="mt-2 h-6 w-px bg-gradient-to-b from-ember-glow to-transparent" />
          </motion.div>
        )}
      </div>
    </section>
  );
}
