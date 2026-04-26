import { useRef, type MouseEvent } from "react";
import { playRevBurst } from "@/components/EngineAudio";

/**
 * Full-screen black "DRIVE IT." section.
 * Liquid mercury hover fill on the CTA + animated speed-line grid background.
 */
export function DriveItCTA() {
  const btnRef = useRef<HTMLAnchorElement>(null);

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  };

  return (
    <section
      id="drive-it"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black"
    >
      {/* Speed-line grid */}
      <div className="speed-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      {/* Soft top glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,oklch(0.32_0.18_305_/_0.35),transparent_60%)]" />
      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.85)_100%)]" />

      <div className="relative z-10 px-6 text-center md:px-12">
        <h2 className="font-display text-[20vw] leading-[0.85] tracking-tight text-foreground md:text-[14vw] [text-shadow:0_4px_60px_rgba(0,0,0,0.8)]">
          DRIVE
          <span className="text-gradient-animated [filter:drop-shadow(0_0_40px_oklch(0.72_0.22_315_/_0.7))]">
            {" "}IT.
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-sm uppercase tracking-[0.4em] text-muted-foreground md:text-base">
          Stop scrolling past your own listings.
        </p>

        <div className="mt-12 flex justify-center">
          <a
            ref={btnRef}
            href="mailto:aspecttdigital@gmail.com"
            onMouseMove={onMove}
            onClick={() => playRevBurst()}
            className="liquid-btn group relative inline-flex items-center gap-4 overflow-hidden rounded-full border border-ember/60 px-12 py-5 font-display text-base tracking-[0.3em] text-foreground"
            data-cursor-label="START"
          >
            <span className="relative z-10 transition-colors duration-500 group-hover:text-accent-foreground">
              START YOUR PROJECT
            </span>
            <span className="relative z-10 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-accent-foreground" aria-hidden>
              →
            </span>
            {/* Liquid mercury fill — radial gradient from cursor position */}
            <span
              aria-hidden
              className="liquid-fill pointer-events-none absolute inset-0"
            />
          </a>
        </div>

        <p className="mt-10 font-display text-[11px] tracking-[0.4em] text-muted-foreground">
          aspecttdigital@gmail.com
        </p>
      </div>
    </section>
  );
}