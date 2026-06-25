<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue'
import { useMotionCapabilities } from '@/composables/useMotionCapabilities'
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
import { REVEAL_MASK_FRAGMENT_SHADER } from '@/lib/motion/webglShaders'

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
const { capabilities } = useMotionCapabilities()

let cleanup: (() => void) | null = null

function initWebGL(canvas: HTMLCanvasElement, imageSrc: string) {
  const gl = createWebGLContext(canvas)
  if (!gl) return null

  const program = createShaderProgram(gl, REVEAL_MASK_FRAGMENT_SHADER, 'WebGLRevealMask')
  if (!program) return null

  setupFullscreenQuad(gl, program)

  const uTime = gl.getUniformLocation(program, 'u_time')
  const uScroll = gl.getUniformLocation(program, 'u_scroll')
  const uTexture = gl.getUniformLocation(program, 'u_texture')

  const texture = createImageTexture(gl)
  const start = performance.now()
  let textureReady = false
  let isVisible = true

  loadImageTexture(gl, texture, imageSrc, () => {
    textureReady = true
  })

  const unobserveVisibility = observeCanvasVisibility(canvas, (visible) => {
    isVisible = visible
  })

  const unbindResize = bindCanvasResize(canvas, gl)

  const removeTicker = createGsapDrawLoop(
    (now) => {
      const t = (now - start) / 1000
      gl.uniform1f(uTime, t)
      gl.uniform1f(uScroll, readScrollProgress())
      gl.uniform1i(uTexture, 0)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    },
    () => textureReady && isVisible,
  )

  return () => {
    unobserveVisibility()
    removeTicker()
    unbindResize()
    gl.deleteTexture(texture)
    gl.deleteProgram(program)
  }
}

watch(
  [capabilities, canvasRef, () => props.imageSrc],
  () => {
    cleanup?.()
    cleanup = null
    if (!capabilities.value.webgl || !canvasRef.value) return
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
    v-if="capabilities.webgl"
    ref="canvasRef"
    class="pointer-events-none absolute inset-0 z-[1] h-full w-full"
    :class="$props.class"
    aria-hidden="true"
  ></canvas>
</template>
