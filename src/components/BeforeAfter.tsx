import { useRef, useState, useCallback } from "react";
import carBefore from "@/assets/car-before.jpg";
import carAfter from "@/assets/car-after.jpg";

interface BeforeAfterProps {
  beforeSrc?: string;
  afterSrc?: string;
  beforeAlt?: string;
  afterAlt?: string;
  afterLabel?: string;
}

export function BeforeAfter({
  beforeSrc = carBefore,
  afterSrc = carAfter,
  beforeAlt = "Amateur original photo of the car before treatment",
  afterAlt = "Professional car photo processed by Aspect",
  afterLabel = "AFTER — ASPECT",
}: BeforeAfterProps = {}) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, x)));
  }, []);

  const [hasInteracted, setHasInteracted] = useState(false);

  return (
    <div
      ref={ref}
      className="group relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-border select-none cursor-ew-resize glow-ember animate-ember-pulse"
      onMouseDown={(e) => {
        dragging.current = true;
        setHasInteracted(true);
        update(e.clientX);
      }}
      onMouseMove={(e) => dragging.current && update(e.clientX)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchStart={(e) => { setHasInteracted(true); update(e.touches[0].clientX); }}
      onTouchMove={(e) => update(e.touches[0].clientX)}
    >
      {/* After (base) */}
      <img
        src={afterSrc}
        alt={afterAlt}
        width={1280}
        height={800}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
      />
      {/* Before (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img
          src={beforeSrc}
          alt={beforeAlt}
          width={1280}
          height={800}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Labels */}
      <div className="absolute left-4 top-4 rounded-sm bg-background/80 px-3 py-1 font-display text-sm tracking-widest text-muted-foreground backdrop-blur-sm transition-transform duration-300 group-hover:-translate-x-1">
        BEFORE
      </div>
      <div className="absolute right-4 top-4 rounded-sm bg-ember px-3 py-1 font-display text-sm tracking-widest text-accent-foreground shadow-[0_0_20px_oklch(0.62_0.25_305_/_0.6)] transition-transform duration-300 group-hover:translate-x-1">
        {afterLabel}
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 h-full w-px bg-ember shadow-[0_0_12px_oklch(0.62_0.25_305_/_0.8)]"
        style={{ left: `${pos}%` }}
      >
        <div className={`absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ember bg-background shadow-lg transition-shadow ${hasInteracted ? "" : "animate-hint-drag"}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-ember">
            <path d="M8 6L2 12l6 6M16 6l6 6-6 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}