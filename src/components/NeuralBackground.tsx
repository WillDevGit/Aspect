import { useEffect, useRef } from "react";

/**
 * Sci-fi neural network background.
 * Nodes drift slowly; lines connect nearby nodes.
 * The cursor pushes/attracts nodes and lights up nearby connections,
 * creating the feeling of an AI mesh reacting in real time.
 */
export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = 0;
    let height = 0;

    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    let nodes: Node[] = [];

    const buildNodes = () => {
      const area = width * height;
      // density tuned for performance
      const density = isMobile ? 14000 : 9000;
      const count = Math.max(28, Math.min(110, Math.round(area / density)));
      nodes = Array.from({ length: count }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.4 + 0.6,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: -9999, y: -9999, active: false };
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    // Visibility gating
    let visible = true;
    const onVis = () => (visible = document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);

    const linkDist = isMobile ? 110 : 140;
    const linkDist2 = linkDist * linkDist;
    const mouseRadius = isMobile ? 140 : 200;
    const mouseRadius2 = mouseRadius * mouseRadius;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const dt = Math.min(40, now - last);
      last = now;
      const t = dt / 16.67;

      ctx.clearRect(0, 0, width, height);

      // Update nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        // Subtle attraction toward cursor
        if (mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < mouseRadius2 && d2 > 1) {
            const f = (1 - d2 / mouseRadius2) * 0.04;
            n.vx += (dx / Math.sqrt(d2)) * f;
            n.vy += (dy / Math.sqrt(d2)) * f;
          }
        }
        // Damping
        n.vx *= 0.985;
        n.vy *= 0.985;
        n.x += n.vx * t;
        n.y += n.vy * t;
        // Wrap edges
        if (n.x < -10) n.x = width + 10;
        if (n.x > width + 10) n.x = -10;
        if (n.y < -10) n.y = height + 10;
        if (n.y > height + 10) n.y = -10;
      }

      // Draw connections
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkDist2) {
            const alpha = 1 - d2 / linkDist2;
            // Boost lines near cursor
            let boost = 0;
            if (mouse.active) {
              const mx = (a.x + b.x) * 0.5 - mouse.x;
              const my = (a.y + b.y) * 0.5 - mouse.y;
              const md2 = mx * mx + my * my;
              if (md2 < mouseRadius2) {
                boost = (1 - md2 / mouseRadius2) * 0.7;
              }
            }
            const a1 = Math.min(0.9, alpha * 0.18 + boost);
            ctx.strokeStyle = boost > 0.05
              ? `oklch(0.78 0.22 315 / ${a1})`
              : `oklch(0.7 0.12 280 / ${a1})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        let glow = 0;
        if (mouse.active) {
          const dx = n.x - mouse.x;
          const dy = n.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < mouseRadius2) glow = 1 - d2 / mouseRadius2;
        }
        const r = n.r + glow * 1.5;
        ctx.fillStyle = glow > 0.05
          ? `oklch(0.85 0.2 315 / ${0.5 + glow * 0.5})`
          : `oklch(0.75 0.15 290 / 0.45)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-60 mix-blend-screen"
    />
  );
}