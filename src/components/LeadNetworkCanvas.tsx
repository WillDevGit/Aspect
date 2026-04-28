import { useEffect, useRef } from "react";

/**
 * Lead-generation network animation.
 * - Canvas 2D, devicePixelRatio aware.
 * - Nodes = businesses; lines = relationships; scanner = AI lead targeting.
 * - Pauses when offscreen (IntersectionObserver) and when tab hidden.
 * - Particle count auto-scales with viewport size.
 * - Respects prefers-reduced-motion (renders a single static frame).
 */
export function LeadNetworkCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let raf = 0;
    let running = true;
    let visible = true;
    let lastT = performance.now();

    type Node = {
      x: number; y: number;
      vx: number; vy: number;
      r: number;
      hue: number;        // 270 (blue) → 305 (purple)
      pulse: number;      // 0..1 highlight intensity
      targeted: boolean;  // currently selected by scanner
    };

    const isMobile = () => window.innerWidth < 768;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const build = () => {
      const area = width * height;
      // density: ~1 node / 14000px² desktop, halved on mobile
      const base = Math.round(area / 14000);
      const count = Math.min(isMobile() ? Math.round(base * 0.5) : base, isMobile() ? 32 : 80);
      nodes = Array.from({ length: count }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: 1.2 + Math.random() * 1.6,
        hue: 270 + Math.random() * 40,
        pulse: 0,
        targeted: false,
      }));
    };

    // Scanner — sweeps a soft "AI radar" across the field, picking nodes inside.
    const scanner = { x: 0, y: 0, tx: 0, ty: 0, radius: 0, nextAt: 0 };
    const pickNewTarget = (now: number) => {
      scanner.tx = width * (0.15 + Math.random() * 0.7);
      scanner.ty = height * (0.15 + Math.random() * 0.7);
      scanner.nextAt = now + 2200 + Math.random() * 1400;
    };

    const draw = (now: number) => {
      if (!running) return;
      const dt = Math.min(now - lastT, 50); // clamp to 50ms (avoid jumps)
      lastT = now;

      // Soft trailing fade — cheaper than clearRect + redraw of background.
      ctx.fillStyle = "rgba(8, 8, 12, 0.32)";
      ctx.fillRect(0, 0, width, height);

      // Scanner movement
      if (now > scanner.nextAt) pickNewTarget(now);
      scanner.x += (scanner.tx - scanner.x) * 0.018;
      scanner.y += (scanner.ty - scanner.y) * 0.018;
      scanner.radius = Math.min(width, height) * (isMobile() ? 0.22 : 0.18);

      // Update nodes
      const maxDist = isMobile() ? 110 : 150;
      const maxDistSq = maxDist * maxDist;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx * dt * 0.06;
        n.y += n.vy * dt * 0.06;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        const dx = n.x - scanner.x;
        const dy = n.y - scanner.y;
        const inside = dx * dx + dy * dy < scanner.radius * scanner.radius;
        n.targeted = inside;
        const target = inside ? 1 : 0;
        n.pulse += (target - n.pulse) * 0.06;
      }

      // Connections — single pass, O(n²) but n ≤ 80
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxDistSq) {
            const alpha = (1 - d2 / maxDistSq) * 0.22;
            const boost = (a.pulse + b.pulse) * 0.5;
            const hue = 280 + boost * 25;
            ctx.strokeStyle = `hsla(${hue}, 90%, ${55 + boost * 20}%, ${alpha + boost * 0.45})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Scanner ring (subtle)
      const grad = ctx.createRadialGradient(
        scanner.x, scanner.y, 0,
        scanner.x, scanner.y, scanner.radius,
      );
      grad.addColorStop(0, "hsla(290, 90%, 65%, 0.10)");
      grad.addColorStop(0.7, "hsla(285, 90%, 60%, 0.05)");
      grad.addColorStop(1, "hsla(285, 90%, 60%, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(scanner.x, scanner.y, scanner.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "hsla(290, 95%, 70%, 0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(scanner.x, scanner.y, scanner.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const r = n.r + n.pulse * 2.2;
        const hue = n.hue + n.pulse * 20;

        // glow halo for targeted ones
        if (n.pulse > 0.05) {
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 6);
          g.addColorStop(0, `hsla(${hue}, 95%, 70%, ${0.5 * n.pulse})`);
          g.addColorStop(1, `hsla(${hue}, 95%, 60%, 0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r * 6, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = `hsla(${hue}, 95%, ${65 + n.pulse * 25}%, ${0.7 + n.pulse * 0.3})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (raf) return;
      lastT = performance.now();
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    pickNewTarget(performance.now());

    if (reduce) {
      // Single static frame — no animation.
      ctx.fillStyle = "rgba(8, 8, 12, 1)";
      ctx.fillRect(0, 0, width, height);
      // draw nodes once
      for (const n of nodes) {
        ctx.fillStyle = `hsla(${n.hue}, 90%, 65%, 0.8)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }

    // Pause when offscreen
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        running = visible && !document.hidden;
        if (running) start();
        else stop();
      },
      { threshold: 0.01 },
    );
    io.observe(canvas);

    const onVis = () => {
      running = visible && !document.hidden;
      if (running) start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVis);

    let resizeTimer = 0 as unknown as number;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    };
    window.addEventListener("resize", onResize);

    start();

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ willChange: "transform" }}
    />
  );
}