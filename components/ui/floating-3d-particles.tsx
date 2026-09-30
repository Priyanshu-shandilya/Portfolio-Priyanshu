"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface Floating3DParticlesProps
  extends Omit<React.CanvasHTMLAttributes<HTMLCanvasElement>, "width" | "height"> {
  quantity?: number
  color?: string
  colors?: string[]
  size?: number
  opacity?: number
  drift?: number
  depth?: number
}

interface Particle {
  angle: number
  radius: number
  y: number
  size: number
  angularSpeed: number
  opacity: number
  color: string
  screenX: number
  screenY: number
  projectedScale: number
}

const MOBILE_BREAKPOINT = 768
const SPREAD_FACTOR = 1.2
const MAX_DPR = 2
const HIGHLIGHT_COLOR = "#FFFFFF"

// Vibrant multi-color palette used when no explicit `colors` prop is given.
const DEFAULT_PALETTE = [
  "#3B82F6", // blue
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#F97316", // orange
  "#F59E0B", // amber
  "#10B981", // emerald
  "#06B6D4", // cyan
  "#EF4444", // red
  "#A855F7", // purple
]

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "").trim()
  const full =
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean

  if (!/^[0-9a-f]{6}$/i.test(full)) return `rgba(59,130,246,${alpha})`

  const n = Number.parseInt(full, 16)
  return `rgba(${(n >> 16) & 0xff},${(n >> 8) & 0xff},${n & 0xff},${alpha})`
}

function deriveProjection(depth: number) {
  const t = Math.max(0, Math.min(1, depth))
  const fov = 800 - t * 600
  const perspectiveDistance = 100 + t * 700
  const depthRange = t * Math.min(400, fov + perspectiveDistance - 1)
  return { fov, perspectiveDistance, depthRange }
}

function pickColor(palette: string[]): string {
  return palette[Math.floor(Math.random() * palette.length)] ?? "#3B82F6"
}

function spawnParticle(
  width: number,
  height: number,
  size: number,
  opacity: number,
  palette: string[]
): Particle {
  const sizeVariance = size * 0.4
  const opacityVariance = 0.15
  return {
    angle: Math.random() * Math.PI * 2,
    radius: Math.random() * Math.max(width, height) * SPREAD_FACTOR,
    y: (Math.random() - 0.5) * height * 2,
    size: Math.max(0.5, size - sizeVariance + Math.random() * sizeVariance * 2),
    angularSpeed: 0.0015 + Math.random() * 0.001,
    opacity: Math.min(
      1,
      Math.max(0.4, opacity - opacityVariance + Math.random() * opacityVariance * 2)
    ),
    color: pickColor(palette),
    screenX: 0,
    screenY: 0,
    projectedScale: 1,
  }
}

export function Floating3DParticles({
  quantity = 800,
  color,
  colors,
  size = 6,
  opacity = 0.8,
  drift = 0.8,
  depth = 0.5,
  className,
  style,
  ...canvasProps
}: Floating3DParticlesProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const ioRef = React.useRef<IntersectionObserver | null>(null)
  const stateRef = React.useRef({
    mounted: false,
    paused: false,
    reducedMotion: false,
    rafId: null as number | null,
  })

  // Resolve the active palette: explicit `colors` wins, then a single
  // `color` (kept for backwards compatibility), then the default palette.
  const paletteRef = React.useRef<string[]>(
    colors && colors.length > 0 ? colors : color ? [color] : DEFAULT_PALETTE
  )
  paletteRef.current =
    colors && colors.length > 0 ? colors : color ? [color] : DEFAULT_PALETTE

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const s = stateRef.current
    s.mounted = true
    s.paused = false

    let width = 0
    let height = 0
    let particles: Particle[] = []
    let staticDirty = true

    const { fov, perspectiveDistance, depthRange } = deriveProjection(depth)

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const syncReducedMotion = () => {
      s.reducedMotion = mq.matches
    }
    syncReducedMotion()

    const draw = (p: Particle) => {
      const r = Math.max(0, p.size * p.projectedScale)
      if (r <= 0.15) return

      const cx = p.screenX
      const cy = p.screenY

      ctx.save()
      ctx.shadowColor = hexToRgba(p.color, Math.min(1, p.opacity + 0.2))
      ctx.shadowBlur = r * 4
      ctx.beginPath()
      ctx.fillStyle = hexToRgba(p.color, p.opacity * 0.9)
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
      gradient.addColorStop(0, hexToRgba(HIGHLIGHT_COLOR, Math.min(1, p.opacity + 0.15)))
      gradient.addColorStop(0.5, hexToRgba(p.color, p.opacity))
      gradient.addColorStop(1, hexToRgba(p.color, 0))

      ctx.beginPath()
      ctx.fillStyle = gradient
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fill()
    }

    const staticFrame = () => {
      ctx.clearRect(0, 0, width, height)
      const cx = width / 2
      const cy = height / 2

      for (const p of particles) {
        const denom = Math.max(1, fov + perspectiveDistance)
        const scale = fov / denom
        p.screenX = cx + Math.cos(p.angle) * p.radius * scale
        p.screenY = cy + p.y * scale
        p.projectedScale = scale
        draw(p)
      }
    }

    const tick = () => {
      if (!s.mounted) return

      if (s.paused) {
        s.rafId = requestAnimationFrame(tick)
        return
      }

      if (s.reducedMotion) {
        if (staticDirty) {
          staticDirty = false
          staticFrame()
        }
        s.rafId = requestAnimationFrame(tick)
        return
      }

      staticDirty = true

      ctx.clearRect(0, 0, width, height)

      const cx = width / 2
      const cy = height / 2

      for (const p of particles) {
        p.angle += p.angularSpeed
        p.y -= drift

        if (p.y < -height) {
          p.y = height
          p.radius = Math.random() * Math.max(width, height) * SPREAD_FACTOR
        } else if (p.y > height) {
          p.y = -height
          p.radius = Math.random() * Math.max(width, height) * SPREAD_FACTOR
        }

        const denom = Math.max(
          1,
          fov + perspectiveDistance + Math.sin(p.angle) * depthRange
        )
        const scale = fov / denom

        p.screenX = cx + Math.cos(p.angle) * p.radius * scale
        p.screenY = cy + p.y * scale
        p.projectedScale = scale
      }

      particles.sort((a, b) => a.projectedScale - b.projectedScale)
      for (const p of particles) draw(p)

      s.rafId = requestAnimationFrame(tick)
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(1, Math.round(rect.width))
      height = Math.max(1, Math.round(rect.height))

      const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, MAX_DPR))
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const isMobile = window.innerWidth < MOBILE_BREAKPOINT
      const count = isMobile ? Math.round(quantity * 0.3) : quantity

      particles = Array.from({ length: Math.max(0, count) }, () =>
        spawnParticle(width, height, size, opacity, paletteRef.current)
      )

      staticDirty = true
    }

    const onVisibilityChange = () => {
      s.paused = document.hidden
    }

    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null
    if (ro) {
      ro.observe(canvas)
    } else {
      window.addEventListener("resize", resize)
    }

    if (typeof IntersectionObserver !== "undefined") {
      ioRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry) s.paused = document.hidden || !entry.isIntersecting
        },
        { threshold: 0 }
      )
      ioRef.current.observe(canvas)
    }

    document.addEventListener("visibilitychange", onVisibilityChange)
    mq.addEventListener("change", syncReducedMotion)

    resize()
    s.rafId = requestAnimationFrame(tick)

    return () => {
      s.mounted = false
      if (s.rafId !== null) {
        cancelAnimationFrame(s.rafId)
        s.rafId = null
      }
      ro?.disconnect()
      if (!ro) window.removeEventListener("resize", resize)
      ioRef.current?.disconnect()
      ioRef.current = null
      document.removeEventListener("visibilitychange", onVisibilityChange)
      mq.removeEventListener("change", syncReducedMotion)
    }
  }, [quantity, size, opacity, drift, depth])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className
      )}
      style={style}
      {...canvasProps}
    />
  )
}