import { onMounted, onUnmounted, type Ref } from 'vue'
import gsap from 'gsap'
import { getMotionCapabilitiesSnapshot } from '@/lib/motion/motionCapabilities'

export interface MouseParallaxOptions {
  maxX?: number
  maxY?: number
  /** Smoothing factor — align with Lenis lerp (~0.1) */
  lerp?: number
}

/**
 * Subtle image drift on pointer move — Locomotive product-card feel.
 * Applied to inner stack; CSS scale hover remains on parent.
 */
export function useMouseParallax(
  rootRef: Ref<HTMLElement | null>,
  targetRef: Ref<HTMLElement | null>,
  options: MouseParallaxOptions = {},
) {
  const { maxX = 10, maxY = 8, lerp = 0.1 } = options

  let raf = 0
  let targetPx = 0
  let targetPy = 0
  let currentPx = 0
  let currentPy = 0
  let active = false

  function enabled(): boolean {
    const caps = getMotionCapabilitiesSnapshot()
    return caps.animations && caps.parallax && window.matchMedia('(hover: hover)').matches
  }

  function tick() {
    currentPx += (targetPx - currentPx) * lerp
    currentPy += (targetPy - currentPy) * lerp

    const target = targetRef.value
    if (target) {
      gsap.set(target, { x: currentPx, y: currentPy })
    }

    if (active || Math.abs(targetPx - currentPx) > 0.05 || Math.abs(targetPy - currentPy) > 0.05) {
      raf = requestAnimationFrame(tick)
    } else {
      raf = 0
    }
  }

  function ensureTick() {
    if (!raf) raf = requestAnimationFrame(tick)
  }

  function onMove(event: PointerEvent) {
    const root = rootRef.value
    if (!root || !enabled()) return

    const rect = root.getBoundingClientRect()
    const nx = (event.clientX - rect.left) / rect.width - 0.5
    const ny = (event.clientY - rect.top) / rect.height - 0.5

    targetPx = nx * maxX * 2
    targetPy = ny * maxY * 2
    ensureTick()
  }

  function onEnter() {
    if (!enabled()) return
    active = true
    ensureTick()
  }

  function onLeave() {
    active = false
    targetPx = 0
    targetPy = 0
    ensureTick()
  }

  onMounted(() => {
    const root = rootRef.value
    if (!root || !enabled()) return

    root.addEventListener('pointerenter', onEnter)
    root.addEventListener('pointerleave', onLeave)
    root.addEventListener('pointermove', onMove)
  })

  onUnmounted(() => {
    if (raf) cancelAnimationFrame(raf)
    const root = rootRef.value
    const target = targetRef.value
    if (root) {
      root.removeEventListener('pointerenter', onEnter)
      root.removeEventListener('pointerleave', onLeave)
      root.removeEventListener('pointermove', onMove)
    }
    if (target) gsap.set(target, { x: 0, y: 0 })
  })
}
