<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue'
import gsap from 'gsap'
import { useWebglCapability } from '@/composables/useWebglCapability'
import { staticImages } from '@/lib/assets/paths'
import {
  bindCanvasResize,
  createGsapDrawLoop,
  createImageTexture,
  createShaderProgram,
  createWebGLContext,
  loadImageTexture,
  observeCanvasVisibility,
  readScrollProgress,
  setupFullscreenQuad,
} from '@/lib/motion/webglCanvas'
import { HERO_DEPTH_FRAGMENT_SHADER } from '@/lib/motion/webglShaders'

const props = withDefaults(
  defineProps<{
    imageSrc?: string
    class?: string
  }>(),
  {
    imageSrc: staticImages.marketing.hero,
    class: '',
  },
)

const canvasRef = ref<HTMLCanvasElement | null>(null)
const webglEnabled = useWebglCapability()

let cleanup: (() => void) | null = null

function initWebGL(canvas: HTMLCanvasElement, imageSrc: string) {
  const gl = createWebGLContext(canvas)
  if (!gl) return null

  const program = createShaderProgram(gl, HERO_DEPTH_FRAGMENT_SHADER, 'HeroDepthCanvas')
  if (!program) return null

  setupFullscreenQuad(gl, program)

  const uTime = gl.getUniformLocation(program, 'u_time')
  const uScroll = gl.getUniformLocation(program, 'u_scroll')
  const uIntro = gl.getUniformLocation(program, 'u_intro')
  const uMouse = gl.getUniformLocation(program, 'u_mouse')
  const uTexture = gl.getUniformLocation(program, 'u_texture')

  const texture = createImageTexture(gl)
  const start = performance.now()
  let textureReady = false
  let isVisible = true
  let mouseX = 0
  let mouseY = 0
  let smoothMouseX = 0
  let smoothMouseY = 0
  let introProgress = 0

  loadImageTexture(gl, texture, imageSrc, () => {
    textureReady = true
  })

  const introTween = gsap.to(
    { value: 0 },
    {
      value: 1,
      duration: 1.35,
      ease: 'expo.out',
      onUpdate() {
        introProgress = introTween.progress()
      },
    },
  )

  const heroRoot = canvas.closest('.hero-stage') as HTMLElement | null

  function onPointerMove(event: PointerEvent) {
    const root = heroRoot ?? canvas
    const rect = root.getBoundingClientRect()
    mouseX = (event.clientX - rect.left) / rect.width - 0.5
    mouseY = (event.clientY - rect.top) / rect.height - 0.5
  }

  function onPointerLeave() {
    mouseX = 0
    mouseY = 0
  }

  heroRoot?.addEventListener('pointermove', onPointerMove)
  heroRoot?.addEventListener('pointerleave', onPointerLeave)

  const unobserveVisibility = observeCanvasVisibility(canvas, (visible) => {
    isVisible = visible
  })

  const unbindResize = bindCanvasResize(canvas, gl)

  const removeTicker = createGsapDrawLoop(
    (now) => {
      smoothMouseX += (mouseX - smoothMouseX) * 0.1
      smoothMouseY += (mouseY - smoothMouseY) * 0.1

      const t = (now - start) / 1000
      gl.uniform1f(uTime, t)
      gl.uniform1f(uScroll, readScrollProgress())
      gl.uniform1f(uIntro, introProgress)
      gl.uniform2f(uMouse, smoothMouseX, smoothMouseY)
      gl.uniform1i(uTexture, 0)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    },
    () => textureReady && isVisible,
  )

  return () => {
    introTween.kill()
    heroRoot?.removeEventListener('pointermove', onPointerMove)
    heroRoot?.removeEventListener('pointerleave', onPointerLeave)
    unobserveVisibility()
    removeTicker()
    unbindResize()
    gl.deleteTexture(texture)
    gl.deleteProgram(program)
  }
}

watch(
  [webglEnabled, canvasRef, () => props.imageSrc],
  () => {
    cleanup?.()
    cleanup = null
    if (!webglEnabled.value || !canvasRef.value) return
    cleanup = initWebGL(canvasRef.value, props.imageSrc) ?? null
  },
  { immediate: true },
)

onUnmounted(() => {
  cleanup?.()
})
</script>

<template>
  <canvas
    v-if="webglEnabled"
    ref="canvasRef"
    class="hero-depth-canvas pointer-events-none absolute inset-0 z-[1] h-full w-full"
    :class="$props.class"
    aria-hidden="true"
  ></canvas>
</template>
