import { useEffect, useRef, useState } from "react";

/**
 * Cinematic custom cursor: crosshair that scales on hoverables,
 * leaves a brief particle trail when moved fast.
 * Disabled on touch devices and when prefers-reduced-motion is set.
 */
export function CrosshairCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
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

    const onMove = (e: MouseEvent) => {
      const c = cursorRef.current;
      if (!c) return;
      c.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;

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
      document.documentElement.classList.remove("cursor-none-root");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={trailRef} className="pointer-events-none fixed inset-0 z-[9998]" aria-hidden />
      <div
        ref={cursorRef}
        className={`pointer-events-none fixed left-0 top-0 z-[9999] transition-[width,height,opacity] duration-200 ease-out ${hovering ? "scale-150" : ""}`}
        aria-hidden
      >
        <div className="relative">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            className="text-ember-glow drop-shadow-[0_0_8px_oklch(0.78_0.22_315_/_0.9)]"
          >
            <circle cx="18" cy="18" r="2" fill="currentColor" />
            <circle cx="18" cy="18" r="11" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.7" />
            <line x1="18" y1="2" x2="18" y2="9" stroke="currentColor" strokeWidth="1.2" />
            <line x1="18" y1="27" x2="18" y2="34" stroke="currentColor" strokeWidth="1.2" />
            <line x1="2" y1="18" x2="9" y2="18" stroke="currentColor" strokeWidth="1.2" />
            <line x1="27" y1="18" x2="34" y2="18" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          {label && (
            <span className="absolute left-8 top-8 whitespace-nowrap rounded-sm bg-ember px-2 py-0.5 font-display text-[10px] tracking-[0.3em] text-accent-foreground">
              {label}
            </span>
          )}
        </div>
      </div>
    </>
  );
}