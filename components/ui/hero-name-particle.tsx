"use client"

import { useEffect, useRef } from "react"

class NameParticle {
  pos = { x: 0, y: 0 }
  vel = { x: 0, y: 0 }
  acc = { x: 0, y: 0 }
  target = { x: 0, y: 0 }
  r = 0; g = 0; b = 0
  maxSpeed = 4
  maxForce = 0.2

  move() {
    const dx = this.target.x - this.pos.x
    const dy = this.target.y - this.pos.y
    const dist = Math.hypot(dx, dy)
    const prox = dist < 80 ? dist / 80 : 1
    const mag = dist || 1
    const steerX = (dx / mag) * this.maxSpeed * prox - this.vel.x
    const steerY = (dy / mag) * this.maxSpeed * prox - this.vel.y
    const steerMag = Math.hypot(steerX, steerY) || 1
    this.acc.x += (steerX / steerMag) * this.maxForce
    this.acc.y += (steerY / steerMag) * this.maxForce
    this.vel.x += this.acc.x
    this.vel.y += this.acc.y
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.acc.x = 0
    this.acc.y = 0
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgb(${this.r},${this.g},${this.b})`
    ctx.beginPath()
    // Smooth circle instead of square pixel
    ctx.arc(this.pos.x, this.pos.y, 1.5, 0, Math.PI * 2)
    ctx.fill()
  }
}

export function HeroNameParticle() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const vw = window.innerWidth

    // Mirror the h1 breakpoints: text-5xl(48) / text-6xl(60) / text-7xl(72)
    const fontSize = vw >= 1024 ? 72 : vw >= 768 ? 60 : 32
    const H = fontSize + 24   // canvas taller than font for breathing room

    // Measure exact text width so the last letter never clips
    const measureCtx = document.createElement("canvas").getContext("2d")!
    measureCtx.font = `bold ${fontSize}px 'Space Grotesk', Arial, sans-serif`
    const w1 = measureCtx.measureText("SHRIKANT ").width
    const w2 = measureCtx.measureText("SATPUTE").width
    const W = Math.ceil(w1 + w2) + 60

    // Set pixel buffer AND CSS display size explicitly
    canvas.width = W
    canvas.height = H
    canvas.style.width = W + "px"
    canvas.style.height = H + "px"

    const ctx = canvas.getContext("2d")!

    // Offscreen canvas — sample pixel positions only
    const off = document.createElement("canvas")
    off.width = W
    off.height = H
    const offCtx = off.getContext("2d")!
    offCtx.font = `bold ${fontSize}px 'Space Grotesk', Arial, sans-serif`
    offCtx.textBaseline = "middle"

    const startX = 30
    const midY = H / 2

    // SHRIKANT → black
    offCtx.fillStyle = "#000000"
    offCtx.fillText("SHRIKANT ", startX, midY)

    // SATPUTE → orange (same as original)
    offCtx.fillStyle = "#ff781e"
    offCtx.fillText("SATPUTE", startX + w1, midY)

    const imageData = offCtx.getImageData(0, 0, W, H)
    const pixels = imageData.data
    const particles: NameParticle[] = []

    for (let i = 0; i < pixels.length; i += 4 * 4) {
      if (pixels[i + 3] > 100) {
        const x = (i / 4) % W
        const y = Math.floor(i / 4 / W)
        const p = new NameParticle()
        p.pos.x = Math.random() * W
        p.pos.y = Math.random() < 0.5 ? -40 : H + 40
        p.target.x = x
        p.target.y = y
        p.r = pixels[i]
        p.g = pixels[i + 1]
        p.b = pixels[i + 2]
        p.maxSpeed = Math.random() * 3 + 2
        p.maxForce = p.maxSpeed * 0.06
        particles.push(p)
      }
    }

    const scatter = () => {
      for (const p of particles) {
        p.pos.x = Math.random() * W
        p.pos.y = Math.random() < 0.5 ? -40 : H + 40
        p.vel.x = 0
        p.vel.y = 0
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, W, H)
      for (const p of particles) {
        p.move()
        p.draw(ctx)
      }
      animRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  // No CSS size on the element — sized explicitly in useEffect via canvas.style
  return <canvas ref={canvasRef} />
}
