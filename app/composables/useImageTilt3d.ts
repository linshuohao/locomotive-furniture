import { onMounted, onUnmounted, type Ref } from 'vue'
import gsap from 'gsap'
import { getMotionCapabilitiesSnapshot } from '@/lib/motion/motionCapabilities'

export interface ImageTilt3dOptions {
  maxRotateX?: number
  maxRotateY?: number
  scale?: number
  /** Inner layer parallax depth in px */
  depth?: number
  lerp?: number
}

/**
 * Pointer-driven 3D tilt with inner depth parallax — Locomotive editorial image feel.
 */
export function useImageTilt3d(
  rootRef: Ref<HTMLElement | null>,
  panelRef: Ref<HTMLElement | null>,
  innerRef: Ref<HTMLElement | null>,
  options: ImageTilt3dOptions = {},
) {
  const { maxRotateX = 10, maxRotateY = 14, scale = 1.04, depth = 22, lerp = 0.12 } = options

  let raf = 0
  let active = false
  let targetRx = 0
  let targetRy = 0
  let targetPx = 0
  let targetPy = 0
  let currentRx = 0
  let currentRy = 0
  let currentPx = 0
  let currentPy = 0
  let currentScale = 1

  function enabled(): boolean {
    const caps = getMotionCapabilitiesSnapshot()
    return caps.animations && caps.parallax && window.matchMedia('(hover: hover)').matches
  }

  function tick() {
    currentRx += (targetRx - currentRx) * lerp
    currentRy += (targetRy - currentRy) * lerp
    currentPx += (targetPx - currentPx) * lerp
    currentPy += (targetPy - currentPy) * lerp

    const targetScale = active ? scale : 1
    currentScale += (targetScale - currentScale) * lerp

    const panel = panelRef.value
    const inner = innerRef.value

    if (panel) {
      gsap.set(panel, {
        rotateX: currentRx,
        rotateY: currentRy,
        scale: currentScale,
        transformPerspective: 900,
      })
    }

    if (inner) {
      gsap.set(inner, {
        x: currentPx,
        y: currentPy,
        scale: active ? 1.08 : 1.04,
      })
    }

    const moving =
      active ||
      Math.abs(targetRx - currentRx) > 0.04 ||
      Math.abs(targetRy - currentRy) > 0.04 ||
      Math.abs(targetPx - currentPx) > 0.2 ||
      Math.abs(targetPy - currentPy) > 0.2 ||
      Math.abs(currentScale - (active ? scale : 1)) > 0.005

    if (moving) {
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

    targetRy = nx * maxRotateY * 2
    targetRx = -ny * maxRotateX * 2
    targetPx = nx * depth
    targetPy = ny * depth
    ensureTick()
  }

  function onEnter() {
    if (!enabled()) return
    active = true
    ensureTick()
  }

  function onLeave() {
    active = false
    targetRx = 0
    targetRy = 0
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
    const panel = panelRef.value
    const inner = innerRef.value

    if (root) {
      root.removeEventListener('pointerenter', onEnter)
      root.removeEventListener('pointerleave', onLeave)
      root.removeEventListener('pointermove', onMove)
    }

    if (panel) gsap.set(panel, { rotateX: 0, rotateY: 0, scale: 1 })
    if (inner) gsap.set(inner, { x: 0, y: 0, scale: 1 })
  })
}
