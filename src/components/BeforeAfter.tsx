import { useRef, useState, useCallback } from "react";
import carBefore from "@/assets/car-before.jpg";
import carAfter from "@/assets/car-after.jpg";

export function BeforeAfter() {
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

  return (
    <div
      ref={ref}
      className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-border select-none cursor-ew-resize glow-ember"
      onMouseDown={(e) => {
        dragging.current = true;
        update(e.clientX);
      }}
      onMouseMove={(e) => dragging.current && update(e.clientX)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchStart={(e) => update(e.touches[0].clientX)}
      onTouchMove={(e) => update(e.touches[0].clientX)}
    >
      {/* After (base) */}
      <img
        src={carAfter}
        alt="Foto profissional do carro processada pela Aspect"
        width={1280}
        height={800}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Before (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img
          src={carBefore}
          alt="Foto amadora original do carro antes do tratamento"
          width={1280}
          height={800}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Labels */}
      <div className="absolute left-4 top-4 rounded-sm bg-background/80 px-3 py-1 font-display text-sm tracking-widest text-muted-foreground backdrop-blur-sm">
        ANTES
      </div>
      <div className="absolute right-4 top-4 rounded-sm bg-ember px-3 py-1 font-display text-sm tracking-widest text-accent-foreground">
        DEPOIS — ASPECT
      </div>

      {/* Slider handle */}
      <div
        className="absolute top-0 h-full w-px bg-ember"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-ember bg-background shadow-lg">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-ember">
            <path d="M8 6L2 12l6 6M16 6l6 6-6 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}