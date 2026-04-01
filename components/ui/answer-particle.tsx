"use client"

import { useEffect, useRef } from "react"

class AParticle {
  pos    = { x: 0, y: 0 }
  vel    = { x: 0, y: 0 }
  acc    = { x: 0, y: 0 }
  target = { x: 0, y: 0 }
  maxSpeed = 7
  maxForce = 0.5
  settled  = false

  move() {
    if (this.settled) return
    const dx   = this.target.x - this.pos.x
    const dy   = this.target.y - this.pos.y
    const dist = Math.hypot(dx, dy)
    // Mark settled when close enough and slow enough
    if (dist < 0.8 && Math.hypot(this.vel.x, this.vel.y) < 0.3) {
      this.pos.x  = this.target.x
      this.pos.y  = this.target.y
      this.vel.x  = 0
      this.vel.y  = 0
      this.settled = true
      return
    }
    const prox = dist < 80 ? dist / 80 : 1
    const mag  = dist || 1
    const sx   = (dx / mag) * this.maxSpeed * prox - this.vel.x
    const sy   = (dy / mag) * this.maxSpeed * prox - this.vel.y
    const sm   = Math.hypot(sx, sy) || 1
    this.acc.x += (sx / sm) * this.maxForce
    this.acc.y += (sy / sm) * this.maxForce
    this.vel.x += this.acc.x
    this.vel.y += this.acc.y
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.acc.x  = 0
    this.acc.y  = 0
  }
}

/* ── word-wrap ── */
function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const out: string[] = []
  for (const raw of text.split("\n")) {
    const clean = raw.replace(/^[\s•\-*#]+/, "").trim()
    if (!clean) continue
    const words = clean.split(" ")
    let cur = ""
    for (const w of words) {
      const test = cur ? `${cur} ${w}` : w
      if (ctx.measureText(test).width > maxW && cur) { out.push(cur); cur = w }
      else cur = test
    }
    if (cur) out.push(cur)
  }
  return out
}

const MAX_PARTICLES = 8000  // dense cloud before settling into text
const DOT_SIZE      = 1.5   // visible dots during flight

export function AnswerParticle({ text }: { text: string }) {
  const wrapRef   = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef   = useRef<number>()

  useEffect(() => {
    if (!text) return
    const wrap   = wrapRef.current
    const canvas = canvasRef.current
    if (!canvas || !wrap) return

    if (animRef.current) cancelAnimationFrame(animRef.current)

    // ── Delay one frame so the flex layout is fully computed ──────────
    const setupFrame = requestAnimationFrame(() => {
      const W        = wrap.offsetWidth                    || 340
      const maxH     = wrap.parentElement?.offsetHeight    || 300   // visible scroll area
      // Scale font with container: 13px floor, 15px ceiling — matches Inter body size on site
      const fontSize = Math.max(13, Math.min(15, Math.round(W / 24)))
      const lineH    = Math.round(fontSize * 1.65)
      const padX     = 6
      const padY     = 6
      const FONT     = `400 ${fontSize}px 'Inter', system-ui, sans-serif`

      // Measure + wrap
      const tmp = document.createElement("canvas").getContext("2d")!
      tmp.font = FONT
      const lines = wrapLines(tmp, text, W - padX * 2)

      // Full text height — no line cap so scroll works
      const canvasH  = lines.length * lineH + padY * 2
      const spawnH   = maxH   // particles spawn from the visible area only

      canvas.width        = W
      canvas.height       = canvasH
      canvas.style.width  = W + "px"
      canvas.style.height = canvasH + "px"

      // Render ALL lines offscreen for pixel sampling
      const off    = document.createElement("canvas")
      off.width    = W
      off.height   = canvasH
      const offCtx = off.getContext("2d")!
      offCtx.font         = FONT
      offCtx.fillStyle    = "#000000"
      offCtx.textBaseline = "top"
      lines.forEach((line, i) =>
        offCtx.fillText(line, padX, padY + i * lineH)
      )

      const pixels = offCtx.getImageData(0, 0, W, canvasH).data
      const candidates: [number, number][] = []
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] > 128) {
          candidates.push([(i / 4) % W, Math.floor(i / 4 / W)])
        }
      }

      // Evenly sub-sample down to MAX_PARTICLES
      const step = Math.max(1, Math.ceil(candidates.length / MAX_PARTICLES))
      const particles: AParticle[] = []

      for (let j = 0; j < candidates.length; j += step) {
        const [x, y] = candidates[j]
        const p = new AParticle()
        p.pos.x    = Math.random() * W
        p.pos.y    = Math.random() * spawnH   // spawn only from visible area
        p.target   = { x, y }
        p.maxSpeed = Math.random() * 4 + 5
        p.maxForce = p.maxSpeed * 0.12
        particles.push(p)
      }

      const ctx = canvas.getContext("2d", { alpha: true })!
      let settledCount = 0

      const drawFinalText = () => {
        ctx.clearRect(0, 0, W, canvasH)
        ctx.font         = FONT
        ctx.fillStyle    = "#1e293b"
        ctx.textBaseline = "top"
        lines.forEach((line, i) =>
          ctx.fillText(line, padX, padY + i * lineH)
        )
      }

      const animate = () => {
        ctx.clearRect(0, 0, W, canvasH)
        ctx.fillStyle = "#111111"

        let newlySettled = 0
        for (const p of particles) {
          const wasSettled = p.settled
          p.move()
          if (!wasSettled && p.settled) newlySettled++
          ctx.fillRect(p.pos.x - DOT_SIZE / 2, p.pos.y - DOT_SIZE / 2, DOT_SIZE, DOT_SIZE)
        }

        settledCount += newlySettled
        if (settledCount < particles.length) {
          animRef.current = requestAnimationFrame(animate)
        } else {
          // All settled — replace dots with crisp rendered text
          drawFinalText()
        }
      }

      animate()
    })

    return () => {
      cancelAnimationFrame(setupFrame)
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [text])

  return (
    <div ref={wrapRef} className="w-full relative">
      <canvas ref={canvasRef} className="block" />
    </div>
  )
}
