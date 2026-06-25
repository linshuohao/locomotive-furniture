<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue'
import { useMotionCapabilities } from '@/composables/useMotionCapabilities'

defineProps<{
  class?: string
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { capabilities } = useMotionCapabilities()

let rafId = 0

function initWebGL(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false })
  if (!gl) return null

  const ctx = gl

  const vsSource = `
    attribute vec2 a_position;
    void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
  `
  const fsSource = `
    precision mediump float;
    uniform float u_time;
    void main() {
      vec2 uv = gl_FragCoord.xy / vec2(800.0, 600.0);
      float wave = sin(uv.x * 8.0 + u_time) * 0.5 + 0.5;
      gl_FragColor = vec4(0.08, 0.08, 0.08, wave * 0.4);
    }
  `

  function compile(type: number, source: string) {
    const shader = ctx.createShader(type)!
    ctx.shaderSource(shader, source)
    ctx.compileShader(shader)
    return shader
  }

  const program = ctx.createProgram()!
  ctx.attachShader(program, compile(ctx.VERTEX_SHADER, vsSource))
  ctx.attachShader(program, compile(ctx.FRAGMENT_SHADER, fsSource))
  ctx.linkProgram(program)
  ctx.useProgram(program)

  const buffer = ctx.createBuffer()
  ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer)
  ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), ctx.STATIC_DRAW)
  const loc = ctx.getAttribLocation(program, 'a_position')
  ctx.enableVertexAttribArray(loc)
  ctx.vertexAttribPointer(loc, 2, ctx.FLOAT, false, 0, 0)

  const uTime = ctx.getUniformLocation(program, 'u_time')
  const start = performance.now()

  function resize() {
    canvas.width = canvas.clientWidth * devicePixelRatio
    canvas.height = canvas.clientHeight * devicePixelRatio
    ctx.viewport(0, 0, canvas.width, canvas.height)
  }

  function draw(now: number) {
    const t = (now - start) / 1000
    ctx.uniform1f(uTime, t)
    ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4)
    rafId = requestAnimationFrame(draw)
  }

  resize()
  window.addEventListener('resize', resize)
  rafId = requestAnimationFrame(draw)

  return () => {
    cancelAnimationFrame(rafId)
    window.removeEventListener('resize', resize)
  }
}

let cleanup: (() => void) | null = null

watch(
  [capabilities, canvasRef],
  () => {
    cleanup?.()
    cleanup = null
    if (!capabilities.value.webgl || !canvasRef.value) return
    cleanup = initWebGL(canvasRef.value) ?? null
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
    class="pointer-events-none absolute inset-0 h-full w-full"
    :class="$props.class"
    aria-hidden="true"
  />
</template>
