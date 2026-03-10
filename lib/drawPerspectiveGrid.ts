// Shared perspective grid drawing utility used by Hero and About sections

const PRIMARY   = '255, 120, 30';
const SECONDARY = '255, 80, 0';

/**
 * Draws one half (floor or ceiling) of a perspective grid onto a canvas.
 *
 * Both modes have VP at the BOTTOM of the canvas so lines radiate UPWARD,
 * giving the "coming away from center" feel.
 *
 * @param progress  0→1  draw-in animation (time-based for hero, scroll-based for About)
 * @param fade      0→1  overall opacity/retract (scroll-based in both)
 * @param mode      'floor' = full opacity | 'ceiling' = 65% opacity
 */
export function drawGrid(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    progress: number,
    fade: number,
    mode: 'floor' | 'ceiling'
) {
    const W  = canvas.width;
    const H  = canvas.height;
    const vx = W / 2;
    const vy = H; // VP always at bottom of canvas — lines radiate upward

    ctx.clearRect(0, 0, W, H);
    if (progress <= 0 || fade <= 0) return;

    const scale       = fade;
    const opacityMult = mode === 'ceiling' ? 0.65 : 1.0;

    // ── Horizontal lines (perspective-spaced, radiating upward) ─────────────
    const NUM_H = 18;
    for (let i = 0; i < NUM_H; i++) {
        const t    = (i + 1) / (NUM_H + 1); // t=0 near VP (bottom), t=1 near top
        const dist = H * Math.pow(t, 1.65);
        const y    = H - dist;              // lines stack upward from bottom

        const delay    = (1 - t) * 0.6;    // top lines draw first
        const lineProg = Math.max(0, Math.min(1, (progress - delay) / 0.4));
        if (lineProg <= 0) continue;

        const spread = lineProg * scale;
        const x1 = vx - vx       * spread;
        const x2 = vx + (W - vx) * spread;
        const alpha = (0.15 + t * 0.45) * fade * opacityMult;

        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = `rgba(${PRIMARY}, ${alpha})`;
        ctx.lineWidth   = 0.5 + t * 1.1;
        ctx.stroke();
    }

    // ── Radial lines (from VP at bottom-center to top edge) ─────────────────
    const NUM_R = 30;
    for (let i = 0; i <= NUM_R; i++) {
        const t    = i / NUM_R;
        const endX = t * W;
        const endY = 0; // top edge

        const centerDist = Math.abs(t - 0.5) * 2;
        const delay      = centerDist * 0.55;
        const lineProg   = Math.max(0, Math.min(1, (progress - delay) / 0.45));
        if (lineProg <= 0) continue;

        // Retract toward VP on scroll out
        const toX = vx + (endX - vx) * lineProg * scale;
        const toY = vy + (endY - vy) * lineProg * scale;

        const grad = ctx.createLinearGradient(vx, vy, endX, endY);
        grad.addColorStop(0,    `rgba(${PRIMARY}, 0)`);
        grad.addColorStop(0.15, `rgba(${PRIMARY}, ${0.22 * fade * opacityMult})`);
        grad.addColorStop(0.6,  `rgba(${PRIMARY}, ${0.32 * fade * opacityMult})`);
        grad.addColorStop(1,    `rgba(${SECONDARY}, ${0.20 * fade * opacityMult})`);

        ctx.beginPath();
        ctx.moveTo(vx, vy);
        ctx.lineTo(toX, toY);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 1.0;
        ctx.stroke();
    }

    // ── Glow at VP (bottom-center) ───────────────────────────────────────────
    const glowAlpha = progress * fade * 0.85 * opacityMult;
    const glowGrad  = ctx.createRadialGradient(vx, vy, 0, vx, vy, 100);
    glowGrad.addColorStop(0,   `rgba(${PRIMARY}, ${glowAlpha})`);
    glowGrad.addColorStop(0.4, `rgba(${PRIMARY}, ${glowAlpha * 0.3})`);
    glowGrad.addColorStop(1,   `rgba(${PRIMARY}, 0)`);
    ctx.beginPath();
    ctx.arc(vx, vy, 100, 0, Math.PI * 2);
    ctx.fillStyle = glowGrad;
    ctx.fill();
}
