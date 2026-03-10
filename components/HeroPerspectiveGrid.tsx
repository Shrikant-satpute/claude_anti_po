'use client';

import { useEffect, useRef } from 'react';

const PRIMARY   = '255, 120, 30';
const SECONDARY = '255, 80, 0';
const LOAD_MS   = 4200; // total time for all lines to finish drawing

export default function HeroPerspectiveGrid() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let rafId: number;
        let startTime: number | null = null;

        const resize = () => {
            const section = canvas.closest('section') as HTMLElement | null;
            canvas.width  = window.innerWidth;
            canvas.height = section?.clientHeight ?? window.innerHeight;
        };

        const render = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const load = Math.min(1, (timestamp - startTime) / LOAD_MS);

            // No scroll fade — grid stays fully visible until hero scrolls off screen naturally
            const scrollFade = 1;

            const W  = canvas.width;
            const H  = canvas.height;
            // VP at the centre of the whole hero section
            const vx = W / 2;
            const vy = H / 2;

            ctx.clearRect(0, 0, W, H);
            if (load <= 0 || scrollFade <= 0) {
                rafId = requestAnimationFrame(render);
                return;
            }

            // ── Horizontal lines (above and below VP) ───────────────────────
            // Each half mirrors the other — lines bunch near VP, spread at edges
            const NUM_H = 14; // lines per half
            for (let half = 0; half < 2; half++) {
                const dir = half === 0 ? -1 : 1; // -1 = above, +1 = below
                const halfH = half === 0 ? vy : H - vy;

                for (let i = 0; i < NUM_H; i++) {
                    const t = (i + 1) / (NUM_H + 1); // 0 near VP, 1 near edge
                    const dist = halfH * Math.pow(t, 1.7);
                    const y    = vy + dir * dist;

                    // Lines near edge draw first, staggered slowly inward
                    const delay    = (1 - t) * 0.65;
                    const lineProg = Math.max(0, Math.min(1, (load - delay) / 0.35));
                    if (lineProg <= 0) continue;

                    const spread = lineProg * scrollFade;
                    const x1 = vx - vx       * spread;
                    const x2 = vx + (W - vx) * spread;

                    // More opaque near edges, nearly invisible near VP
                    const alpha = (0.08 + t * 0.32) * scrollFade;

                    ctx.beginPath();
                    ctx.moveTo(x1, y);
                    ctx.lineTo(x2, y);
                    ctx.strokeStyle = `rgba(${PRIMARY}, ${alpha})`;
                    ctx.lineWidth   = 0.4 + t * 0.9;
                    ctx.stroke();
                }
            }

            // ── Radial lines (VP at centre → all 4 edges) ───────────────────
            // Top edge, bottom edge, left edge, right edge
            const NUM_R = 28;
            const endpoints: [number, number][] = [];

            // Top edge
            for (let i = 0; i <= NUM_R; i++)
                endpoints.push([i / NUM_R * W, 0]);
            // Bottom edge
            for (let i = 0; i <= NUM_R; i++)
                endpoints.push([i / NUM_R * W, H]);
            // Left edge (skip corners already covered)
            for (let i = 1; i < NUM_R; i++)
                endpoints.push([0, i / NUM_R * H]);
            // Right edge
            for (let i = 1; i < NUM_R; i++)
                endpoints.push([W, i / NUM_R * H]);

            endpoints.forEach(([endX, endY], idx) => {
                // Distance of endpoint from VP as fraction — centre lines first
                const dx = endX - vx, dy = endY - vy;
                const angle = Math.atan2(dy, dx); // -π to π
                // Stagger by angle so lines spiral outward from centre
                const angleNorm  = ((angle + Math.PI) / (2 * Math.PI)); // 0→1
                const delay      = angleNorm * 0.55;
                const lineProg   = Math.max(0, Math.min(1, (load - delay) / 0.45));
                if (lineProg <= 0) return;

                const toX = vx + (endX - vx) * lineProg * scrollFade;
                const toY = vy + (endY - vy) * lineProg * scrollFade;

                const dist  = Math.hypot(dx, dy);
                const distW = Math.hypot(W / 2, H / 2);
                const t     = dist / distW; // 0=near VP, 1=far corner

                const grad = ctx.createLinearGradient(vx, vy, endX, endY);
                grad.addColorStop(0,    `rgba(${PRIMARY}, 0)`);
                grad.addColorStop(0.12, `rgba(${PRIMARY}, ${0.18 * scrollFade})`);
                grad.addColorStop(0.55, `rgba(${PRIMARY}, ${0.26 * scrollFade})`);
                grad.addColorStop(1,    `rgba(${SECONDARY}, ${0.14 * scrollFade})`);

                ctx.beginPath();
                ctx.moveTo(vx, vy);
                ctx.lineTo(toX, toY);
                ctx.strokeStyle = grad;
                ctx.lineWidth   = 0.8;
                ctx.stroke();
            });

            // ── Subtle glow at VP — very light, just a faint hint ────────────
            const glowAlpha = load * scrollFade * 0.18;
            const r2 = 160;
            const glow = ctx.createRadialGradient(vx, vy, 0, vx, vy, r2);
            glow.addColorStop(0,    `rgba(${PRIMARY}, 0)`);
            glow.addColorStop(0.25, `rgba(${PRIMARY}, ${glowAlpha})`);
            glow.addColorStop(1,    `rgba(${PRIMARY}, 0)`);
            ctx.beginPath();
            ctx.arc(vx, vy, r2, 0, Math.PI * 2);
            ctx.fillStyle = glow;
            ctx.fill();

            rafId = requestAnimationFrame(render);
        };

        resize();
        window.addEventListener('resize', resize);
        rafId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
            style={{
                // Fade edges so grid blends into background on all sides
                maskImage: `
                    radial-gradient(ellipse 85% 75% at 50% 50%,
                        black 30%,
                        rgba(0,0,0,0.6) 60%,
                        transparent 100%)
                `,
                WebkitMaskImage: `
                    radial-gradient(ellipse 85% 75% at 50% 50%,
                        black 30%,
                        rgba(0,0,0,0.6) 60%,
                        transparent 100%)
                `,
            }}
        />
    );
}
