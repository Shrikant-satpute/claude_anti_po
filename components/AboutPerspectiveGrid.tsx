'use client';

import { useEffect, useRef } from 'react';

const PRIMARY = '255, 120, 30';

// Must match NUM_R in HeroPerspectiveGrid so vertical lines line up
const NUM_V = 28;
// Horizontal lines in the About wall grid
const NUM_H = 10;

function drawWallGrid(
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    fade: number,
    direction: 'down' | 'up', // 'down' = strong at top, 'up' = strong at bottom
    progress: number = 1      // 0→1: how far lines have drawn in
) {
    const drawTo = H * progress; // vertical lines only drawn this far

    // ── Vertical lines ────────────────────────────────────────────────────────
    for (let i = 0; i <= NUM_V; i++) {
        const x = (i / NUM_V) * W;
        if (drawTo <= 0) continue;

        const grad = ctx.createLinearGradient(x, 0, x, drawTo);
        if (direction === 'down') {
            const p0 = Math.min(1, 0.35 / progress);
            const p1 = Math.min(1, 0.75 / progress);
            grad.addColorStop(0,    `rgba(${PRIMARY}, ${0.45 * fade})`);
            grad.addColorStop(p0,   `rgba(${PRIMARY}, ${0.28 * fade})`);
            grad.addColorStop(p1,   `rgba(${PRIMARY}, ${0.08 * fade})`);
            grad.addColorStop(1,    `rgba(${PRIMARY}, 0)`);
        } else {
            grad.addColorStop(0,    `rgba(${PRIMARY}, 0)`);
            grad.addColorStop(0.25, `rgba(${PRIMARY}, ${0.08 * fade})`);
            grad.addColorStop(0.65, `rgba(${PRIMARY}, ${0.28 * fade})`);
            grad.addColorStop(1,    `rgba(${PRIMARY}, ${0.45 * fade})`);
        }

        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, drawTo);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 0.85;
        ctx.stroke();
    }

    // ── Horizontal lines ──────────────────────────────────────────────────────
    for (let i = 0; i < NUM_H; i++) {
        const t = (i + 1) / (NUM_H + 1);
        const y = H * t;

        // Only draw horizontal lines that are within the drawn region
        if (y > drawTo) continue;

        // Strong near the "open" edge (top for 'down', bottom for 'up')
        const tFromEdge = direction === 'down' ? t : 1 - t;
        const alpha = (0.28 - tFromEdge * 0.22) * fade;
        if (alpha <= 0) continue;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.strokeStyle = `rgba(${PRIMARY}, ${alpha})`;
        ctx.lineWidth   = 0.75;
        ctx.stroke();
    }
}

export default function AboutPerspectiveGrid() {
    const topRef    = useRef<HTMLCanvasElement>(null);
    const bottomRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const top    = topRef.current;
        const bottom = bottomRef.current;
        if (!top || !bottom) return;

        const topCtx    = top.getContext('2d');
        const bottomCtx = bottom.getContext('2d');
        if (!topCtx || !bottomCtx) return;

        let rafId: number;

        const resize = () => {
            const section = top.closest('section') as HTMLElement | null;
            const H = (section?.clientHeight ?? window.innerHeight) * 0.52;
            const W = window.innerWidth;
            top.width    = W;  top.height    = H;
            bottom.width = W;  bottom.height = H;
        };

        const render = () => {
            const section = top.closest('section') as HTMLElement | null;
            if (!section) { rafId = requestAnimationFrame(render); return; }

            const rect     = section.getBoundingClientRect();
            const sectionH = section.clientHeight;

            const fadeIn  = Math.min(1, Math.max(0,
                (window.innerHeight - rect.top) / (window.innerHeight * 0.35)
            ));
            const fadeOut = Math.max(0, 1 - Math.max(0, -rect.top) / (sectionH * 0.50));
            const fade    = Math.min(fadeIn, fadeOut);

            const W = top.width;
            const H = top.height;

            topCtx.clearRect(0, 0, W, H);
            bottomCtx.clearRect(0, 0, W, H);

            if (fade <= 0) { rafId = requestAnimationFrame(render); return; }

            drawWallGrid(topCtx,    W, H, fade, 'down', fadeIn);
            drawWallGrid(bottomCtx, W, H, fade, 'up');

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
        <>
            {/* Top grid — strong at top, fades downward */}
            <canvas
                ref={topRef}
                className="absolute top-0 left-0 w-full pointer-events-none z-[5]"
                style={{
                    maskImage:       'linear-gradient(to bottom, black 0%, black 35%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 35%, transparent 100%)',
                }}
            />
            {/* Bottom grid — strong at bottom, fades upward */}
            <canvas
                ref={bottomRef}
                className="absolute bottom-0 left-0 w-full pointer-events-none z-[5]"
                style={{
                    maskImage:       'linear-gradient(to top, black 0%, black 35%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to top, black 0%, black 35%, transparent 100%)',
                }}
            />
        </>
    );
}
