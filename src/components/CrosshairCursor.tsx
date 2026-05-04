import { useEffect, useRef, useState } from "react";

/**
 * Cinematic custom cursor: crosshair that scales on hoverables,
 * leaves a brief particle trail when moved fast.
 * Disabled on touch devices and when prefers-reduced-motion is set.
 */
export function CrosshairCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-none-root");

    let lastX = 0;
    let lastY = 0;
    let lastT = performance.now();
    let ringX = 0;
    let ringY = 0;
    let targetX = 0;
    let targetY = 0;
    let raf = 0;

    const tick = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      const r = ringRef.current;
      if (r) {
        r.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      const c = cursorRef.current;
      if (!c) return;
      c.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      targetX = e.clientX;
      targetY = e.clientY;

      const now = performance.now();
      const dt = Math.max(1, now - lastT);
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const speed = Math.hypot(dx, dy) / dt; // px/ms
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = now;

      if (speed > 0.6 && trailRef.current) {
        const dot = document.createElement("span");
        dot.className = "cursor-trail-dot";
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
        trailRef.current.appendChild(dot);
        setTimeout(() => dot.remove(), 600);
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const interactive = t.closest("a, button, [role='button'], input, textarea, select, [data-cursor]");
      setHovering(!!interactive);
      const cl = interactive?.getAttribute("data-cursor-label") ?? null;
      setLabel(cl);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("cursor-none-root");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={trailRef} className="pointer-events-none fixed inset-0 z-[9998]" aria-hidden />
      {/* Lagging outer reticle ring */}
      <div
        ref={ringRef}
        className={`pointer-events-none fixed left-0 top-0 z-[9999] transition-[opacity] duration-200 ${hovering ? "opacity-100" : "opacity-80"}`}
        aria-hidden
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          className={`text-ember-glow drop-shadow-[0_0_10px_oklch(0.78_0.22_315_/_0.7)] ${hovering ? "scale-125" : "scale-100"} transition-transform duration-200 ease-out`}
          style={{ animation: "cursor-spin 6s linear infinite" }}
        >
          {/* Dashed outer arc */}
          <circle
            cx="32"
            cy="32"
            r="26"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 6"
            opacity="0.6"
          />
          {/* Corner brackets */}
          <path d="M8 18 L8 8 L18 8" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M46 8 L56 8 L56 18" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M56 46 L56 56 L46 56" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M18 56 L8 56 L8 46" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </div>
      <div
        ref={cursorRef}
        className={`pointer-events-none fixed left-0 top-0 z-[10000] transition-transform duration-150 ease-out ${hovering ? "scale-150" : ""}`}
        aria-hidden
      >
        <div className="relative">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            className="text-ember-glow drop-shadow-[0_0_8px_oklch(0.78_0.22_315_/_0.9)]"
          >
            {/* Center dot */}
            <circle cx="14" cy="14" r="1.5" fill="currentColor" />
            {/* Inner pulse ring */}
            <circle
              cx="14"
              cy="14"
              r="6"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
              opacity="0.5"
              style={{ animation: "cursor-pulse 1.6s ease-out infinite" }}
            />
            {/* Crosshair ticks */}
            <line x1="14" y1="0" x2="14" y2="4" stroke="currentColor" strokeWidth="1.2" />
            <line x1="14" y1="24" x2="14" y2="28" stroke="currentColor" strokeWidth="1.2" />
            <line x1="0" y1="14" x2="4" y2="14" stroke="currentColor" strokeWidth="1.2" />
            <line x1="24" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          {label && (
            <span className="absolute left-10 top-10 whitespace-nowrap rounded-sm border border-ember/60 bg-background/80 px-2 py-0.5 font-display text-[10px] tracking-[0.3em] text-ember backdrop-blur-sm">
              {label}
            </span>
          )}
        </div>
      </div>
    </>
  );
}