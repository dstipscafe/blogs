'use client';

import { useEffect, useRef } from 'react';

interface Drop {
  x: number;
  y: number;
  r: number;
  vy: number;
  sliding: boolean;
  lastTrailY: number;
  wobble: number;
}

const MAX_DROPS = 170;

export default function RainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const drops: Drop[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const spawn = (x?: number, y?: number, r?: number): Drop => {
      const drop: Drop = {
        x: x ?? Math.random() * w,
        y: y ?? Math.random() * h,
        r: r ?? 0.8 + Math.random() * 2.2,
        vy: 0,
        sliding: false,
        lastTrailY: 0,
        wobble: Math.random() * Math.PI * 2,
      };
      drops.push(drop);
      return drop;
    };

    for (let i = 0; i < 70; i++) spawn();

    const drawDrop = (d: Drop) => {
      const stretch = d.sliding ? 1.3 : 1;
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.scale(1, stretch);

      const g = ctx.createRadialGradient(-d.r * 0.35, -d.r * 0.45, d.r * 0.1, 0, 0, d.r);
      g.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      g.addColorStop(0.45, 'rgba(255, 255, 255, 0.18)');
      g.addColorStop(0.85, 'rgba(170, 190, 215, 0.12)');
      g.addColorStop(1, 'rgba(140, 165, 195, 0.3)');

      ctx.beginPath();
      ctx.arc(0, 0, d.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.stroke();

      // specular highlight
      ctx.beginPath();
      ctx.arc(-d.r * 0.3, -d.r * 0.4, d.r * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.fill();
      ctx.restore();
    };

    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 16.7, 3);
      last = now;
      ctx.clearRect(0, 0, w, h);

      // random condensation
      if (drops.length < MAX_DROPS && Math.random() < 0.1 * dt) spawn();

      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];

        if (!d.sliding) {
          // condensation: grow slowly
          d.r += 0.004 * dt * Math.random();
          // big drops randomly break loose
          if (d.r > 4 && Math.random() < 0.0015 * d.r * dt) {
            d.sliding = true;
            d.lastTrailY = d.y;
          }
        } else {
          d.vy = Math.min(d.vy + 0.025 * d.r * dt * 0.12, 2.2 + d.r * 0.25);
          d.y += d.vy * dt;
          d.wobble += 0.04 * dt;
          d.x += Math.sin(d.wobble) * 0.35 * dt;

          // leave a trail of tiny droplets, shrinking as it slides
          if (d.y - d.lastTrailY > 10 + Math.random() * 14) {
            d.lastTrailY = d.y;
            if (drops.length < MAX_DROPS + 30) {
              const t = spawn(d.x + (Math.random() - 0.5) * 2, d.y - d.r * 1.5, d.r * 0.28);
              t.sliding = false;
            }
            d.r *= 0.985;
          }

          // ran dry: settle as a small static drop
          if (d.r < 1.6) {
            d.sliding = false;
            d.vy = 0;
          }
        }

        if (d.y - d.r > h) {
          drops.splice(i, 1);
          continue;
        }
        drawDrop(d);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="rain-canvas" aria-hidden="true" />;
}
