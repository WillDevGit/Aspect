import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import carAfter from "@/assets/car-after.jpg";

/**
 * "AI Reconstruction" hero animation.
 * Black → scattered pixel fragments → scan line reconstructs the image →
 * fully sharp with subtle glow → micro glitch resets loop.
 * Lightweight: single canvas + one scan overlay. ~60fps on mobile.
 * Respects prefers-reduced-motion.
 */
export function CarTransformHero({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<"scatter" | "scan" | "clear" | "glitch">("scatter");

  useEffect(() => {
    if (reduce) { setPhase("clear"); return; }
    let t1: number, t2: number, t3: number, t4: number;
    const loop = () => {
      setPhase("scatter");
      t1 = window.setTimeout(() => setPhase("scan"), 1200);
      t2 = window.setTimeout(() => setPhase("clear"), 1200 + 2200);
      t3 = window.setTimeout(() => setPhase("glitch"), 1200 + 2200 + 2200);
      t4 = window.setTimeout(loop, 1200 + 2200 + 2200 + 350);
    };
    loop();
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [reduce]);

  // Canvas: draw shuffled tiles of the image, then converge to grid.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = carAfter;
    let raf = 0;
    let start = 0;
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };

    type Tile = { sx: number; sy: number; ox: number; oy: number; jx: number; jy: number; rot: number; alpha: number };
    let tiles: Tile[] = [];
    let cols = 0, rows = 0, tw = 0, th = 0;

    const buildTiles = () => {
      const W = canvas.width, H = canvas.height;
      const isMobile = W < 900;
      cols = isMobile ? 28 : 44;
      rows = isMobile ? 18 : 26;
      tw = W / cols; th = H / rows;
      tiles = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          tiles.push({
            sx: x, sy: y,
            ox: (Math.random() - 0.5) * W * 0.6,
            oy: (Math.random() - 0.5) * H * 0.6,
            jx: (Math.random() - 0.5) * 8,
            jy: (Math.random() - 0.5) * 8,
            rot: (Math.random() - 0.5) * 0.4,
            alpha: 0,
          });
        }
      }
    };

    img.onload = () => {
      resize();
      buildTiles();
      start = performance.now();
      raf = requestAnimationFrame(draw);
    };
    const onResize = () => { resize(); buildTiles(); };
    window.addEventListener("resize", onResize);

    // Loop timing must mirror phases above (total ~5950ms)
    const T_SCATTER = 1200;
    const T_SCAN = 2200;
    const T_CLEAR = 2200;
    const T_GLITCH = 350;
    const TOTAL = T_SCATTER + T_SCAN + T_CLEAR + T_GLITCH;

    const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    function draw(now: number) {
      if (!running || !ctx) return;
      const W = canvas.width, H = canvas.height;
      const t = ((now - start) % TOTAL);
      ctx.fillStyle = "#080808";
      ctx.fillRect(0, 0, W, H);

      // Phase progress
      let scanProgress = 0; // 0..1 across scan phase
      let convergence = 0;  // 0 = scattered, 1 = aligned
      let clarity = 0;      // 0 = dim/blocky, 1 = sharp/full image
      let glitchAmt = 0;

      if (t < T_SCATTER) {
        // pixels appear gradually, fully scattered
        const p = t / T_SCATTER;
        convergence = 0;
        clarity = 0;
        scanProgress = 0;
        for (const tile of tiles) {
          tile.alpha = Math.min(1, tile.alpha + 0.04 * p + 0.005);
        }
      } else if (t < T_SCATTER + T_SCAN) {
        const p = (t - T_SCATTER) / T_SCAN;
        scanProgress = p;
        // Tiles converge as the scan passes their row
        const eP = easeInOut(p);
        convergence = eP;
        clarity = eP * 0.85;
      } else if (t < T_SCATTER + T_SCAN + T_CLEAR) {
        const p = (t - T_SCATTER - T_SCAN) / T_CLEAR;
        convergence = 1;
        clarity = 0.85 + 0.15 * Math.min(1, p * 2);
        scanProgress = 1;
      } else {
        const p = (t - T_SCATTER - T_SCAN - T_CLEAR) / T_GLITCH;
        convergence = 1 - p * 0.08;
        clarity = 1 - p * 0.4;
        glitchAmt = Math.sin(p * Math.PI) * 12;
      }

      // Draw tiles
      const scanY = scanProgress * H;
      for (const tile of tiles) {
        const targetX = tile.sx * tw;
        const targetY = tile.sy * th;
        // Per-tile convergence: rows above the scan line snap; below stay scattered
        let local = convergence;
        if (t >= T_SCATTER && t < T_SCATTER + T_SCAN) {
          const tileY = tile.sy * th;
          const dist = (scanY - tileY) / H;
          local = Math.max(0, Math.min(1, 0.4 + dist * 2.5));
        }
        const x = targetX + tile.ox * (1 - local) + tile.jx * (1 - local);
        const y = targetY + tile.oy * (1 - local) + tile.jy * (1 - local);
        const a = tile.alpha * (0.4 + 0.6 * local);
        if (a < 0.02) continue;

        ctx.save();
        ctx.globalAlpha = a;
        const rot = tile.rot * (1 - local);
        if (rot !== 0) {
          ctx.translate(x + tw / 2, y + th / 2);
          ctx.rotate(rot);
          ctx.translate(-tw / 2, -th / 2);
          ctx.drawImage(img, tile.sx * (img.width / cols), tile.sy * (img.height / rows), img.width / cols, img.height / rows, 0, 0, tw + 1, th + 1);
        } else {
          const gx = x + (glitchAmt && tile.sy % 3 === 0 ? glitchAmt : 0);
          ctx.drawImage(img, tile.sx * (img.width / cols), tile.sy * (img.height / rows), img.width / cols, img.height / rows, gx, y, tw + 1, th + 1);
        }
        ctx.restore();
      }

      // Dim overlay during scatter, lifts as clarity grows
      ctx.fillStyle = `rgba(8,8,8,${0.55 * (1 - clarity)})`;
      ctx.fillRect(0, 0, W, H);

      // Scan line
      if (scanProgress > 0 && scanProgress < 1) {
        const grad = ctx.createLinearGradient(0, scanY - 80, 0, scanY + 80);
        grad.addColorStop(0, "rgba(180,120,255,0)");
        grad.addColorStop(0.5, "rgba(200,150,255,0.55)");
        grad.addColorStop(1, "rgba(180,120,255,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, scanY - 80, W, 160);
        ctx.fillStyle = "rgba(220,180,255,0.9)";
        ctx.fillRect(0, scanY - 1, W, 2);
      }

      raf = requestAnimationFrame(draw);
    }

    // Pause when offscreen / hidden
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !running) {
          running = true;
          start = performance.now();
          raf = requestAnimationFrame(draw);
        } else if (!e.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      }
    }, { threshold: 0 });
    io.observe(canvas);

    const onVis = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf); }
      else if (!running) { running = true; start = performance.now(); raf = requestAnimationFrame(draw); }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
    };
  }, [reduce]);

  if (reduce) {
    return (
      <div className={`relative h-full w-full overflow-hidden ${className}`} aria-hidden="true">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${carAfter})` }} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]" />
      </div>
    );
    }

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Subtle purple glow when image is clear */}
      <motion.div
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.62 0.25 305 / 0.18), transparent 60%)",
        }}
        animate={{ opacity: phase === "clear" ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      />

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}