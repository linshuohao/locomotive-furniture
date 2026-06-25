import { onMounted, onUnmounted, type Ref } from 'vue'
import gsap from 'gsap'
import { getMotionCapabilitiesSnapshot } from '@/lib/motion/motionCapabilities'

export interface MagneticOptions {
  /** Cursor pull strength 0–1 (Locomotive CTA ~0.28) */
  strength?: number
  /** Max translate in px */
  maxOffset?: number
  /** Follow smoothing 0–1 */
  lerp?: number
}

/**
 * Magnetic hover — element drifts toward cursor, springs back on leave.
 * Gated by motion capabilities; no-op on touch / reduced motion.
 */
export function useMagnetic(elRef: Ref<HTMLElement | null>, options: MagneticOptions = {}) {
  const { strength = 0.28, maxOffset = 12, lerp = 0.15 } = options

  let raf = 0
  let targetX = 0
  let targetY = 0
  let currentX = 0
  let currentY = 0
  let hovering = false

  function enabled(): boolean {
    const caps = getMotionCapabilitiesSnapshot()
    return caps.animations && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  }

  function tick() {
    currentX += (targetX - currentX) * lerp
    currentY += (targetY - currentY) * lerp

    const el = elRef.value
    if (el) {
      gsap.set(el, { x: currentX, y: currentY })
    }

    if (hovering || Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
      raf = requestAnimationFrame(tick)
    } else {
      raf = 0
    }
  }

  function ensureTick() {
    if (!raf) raf = requestAnimationFrame(tick)
  }

  function onMove(event: PointerEvent) {
    const el = elRef.value
    if (!el || !enabled()) return

    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (event.clientX - cx) * strength
    const dy = (event.clientY - cy) * strength

    targetX = gsap.utils.clamp(-maxOffset, maxOffset, dx)
    targetY = gsap.utils.clamp(-maxOffset, maxOffset, dy)
    ensureTick()
  }

  function onEnter() {
    if (!enabled()) return
    hovering = true
    ensureTick()
  }

  function onLeave() {
    hovering = false
    targetX = 0
    targetY = 0
    ensureTick()
  }

  onMounted(() => {
    const el = elRef.value
    if (!el || !enabled()) return

    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
    el.addEventListener('pointermove', onMove)
  })

  onUnmounted(() => {
    if (raf) cancelAnimationFrame(raf)
    const el = elRef.value
    if (!el) return

    el.removeEventListener('pointerenter', onEnter)
    el.removeEventListener('pointerleave', onLeave)
    el.removeEventListener('pointermove', onMove)
    gsap.set(el, { x: 0, y: 0 })
  })
}
