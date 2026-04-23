import { useMemo } from "react";

interface ParticlesProps {
  count?: number;
  className?: string;
}

/**
 * Lightweight CSS-only particle field. No JS animation loop.
 */
export function Particles({ count = 28, className = "" }: ParticlesProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const size = 2 + Math.random() * 4;
        return {
          id: i,
          left: `${Math.random() * 100}%`,
          duration: `${10 + Math.random() * 14}s`,
          delay: `${-Math.random() * 18}s`,
          drift: `${(Math.random() - 0.5) * 200}px`,
          size: `${size}px`,
          opacity: 0.3 + Math.random() * 0.7,
        };
      }),
    [count],
  );

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: p.opacity,
            ["--drift" as string]: p.drift,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}