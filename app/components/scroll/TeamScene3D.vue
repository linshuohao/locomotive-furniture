<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useWebglCapability } from '@/composables/useWebglCapability'

const props = withDefaults(
  defineProps<{
    class?: string
    /** Scroll progress 0–1 from parent css-progress section */
    progress?: number
  }>(),
  {
    class: '',
    progress: 0,
  },
)

const rootRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const webglEnabled = useWebglCapability()

const inView = ref(false)
let cleanup: (() => void) | null = null
let visibilityObserver: IntersectionObserver | null = null

onMounted(() => {
  if (!rootRef.value) return
  visibilityObserver = new IntersectionObserver(
    (entries) => {
      inView.value = entries.some((entry) => entry.isIntersecting)
    },
    { rootMargin: '12% 0px', threshold: 0.08 },
  )
  visibilityObserver.observe(rootRef.value)
})

watch(
  [inView, webglEnabled, canvasRef],
  async () => {
    cleanup?.()
    cleanup = null

    if (!inView.value || !webglEnabled.value || !canvasRef.value) return

    const THREE = await import('three')
    cleanup = initTeamScene(THREE, canvasRef.value, () => props.progress) ?? null
  },
  { immediate: true },
)

watch(
  () => props.progress,
  (value) => {
    if (cleanup && 'setProgress' in cleanup) {
      ;(cleanup as { setProgress: (v: number) => void }).setProgress(value)
    }
  },
)

onUnmounted(() => {
  visibilityObserver?.disconnect()
  cleanup?.()
})

type ThreeModule = typeof import('three')

function initTeamScene(THREE: ThreeModule, canvas: HTMLCanvasElement, readProgress: () => number) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
  camera.position.set(0, 1.2, 5.5)

  const ambient = new THREE.AmbientLight(0xf5efe6, 0.55)
  const key = new THREE.DirectionalLight(0xfff8ef, 1.1)
  key.position.set(4, 6, 5)
  const rim = new THREE.DirectionalLight(0x8b7355, 0.45)
  rim.position.set(-5, 2, -3)
  scene.add(ambient, key, rim)

  const group = new THREE.Group()
  scene.add(group)

  const wood = new THREE.MeshStandardMaterial({
    color: 0x6b5344,
    roughness: 0.62,
    metalness: 0.08,
  })
  const stone = new THREE.MeshStandardMaterial({
    color: 0xc9bfb0,
    roughness: 0.38,
    metalness: 0.12,
  })
  const accent = new THREE.MeshStandardMaterial({
    color: 0x2a2118,
    roughness: 0.48,
    metalness: 0.2,
  })

  const table = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 1.1), wood)
  table.position.set(-0.4, 0.35, 0)
  group.add(table)

  const legGeo = new THREE.BoxGeometry(0.08, 0.35, 0.08)
  for (const [x, z] of [
    [-1.05, 0.42],
    [0.25, 0.42],
    [-1.05, -0.42],
    [0.25, -0.42],
  ] as const) {
    const leg = new THREE.Mesh(legGeo, accent)
    leg.position.set(x, 0.175, z)
    group.add(leg)
  }

  const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.42, 0.72), stone)
  sofaBase.position.set(1.15, 0.55, -0.15)
  group.add(sofaBase)

  const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.55, 0.14), stone)
  sofaBack.position.set(1.15, 0.92, -0.44)
  group.add(sofaBack)

  const lampStem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.9, 16), accent)
  lampStem.position.set(-1.35, 0.85, 0.35)
  group.add(lampStem)

  const lampShade = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.28, 24, 1, true), wood)
  lampShade.position.set(-1.35, 1.28, 0.35)
  group.add(lampShade)

  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 24), accent)
  orb.position.set(0.2, 1.45, 0.55)
  group.add(orb)

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshStandardMaterial({ color: 0x1a1510, roughness: 0.9, metalness: 0 }),
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.y = 0
  group.add(floor)

  let progress = readProgress()
  let pointerX = 0
  let pointerY = 0
  let targetRotX = 0
  let targetRotY = 0
  let currentRotX = 0
  let currentRotY = 0
  let animationId = 0
  const start = performance.now()

  function resize() {
    const { clientWidth, clientHeight } = canvas
    if (!clientWidth || !clientHeight) return
    renderer.setSize(clientWidth, clientHeight, false)
    camera.aspect = clientWidth / clientHeight
    camera.updateProjectionMatrix()
  }

  function onPointerMove(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect()
    pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    targetRotY = pointerX * 0.22
    targetRotX = pointerY * 0.12
  }

  function onPointerLeave() {
    pointerX = 0
    pointerY = 0
    targetRotX = 0
    targetRotY = 0
  }

  function render(now: number) {
    const t = (now - start) / 1000
    currentRotX += (targetRotX - currentRotX) * 0.08
    currentRotY += (targetRotY - currentRotY) * 0.08

    group.rotation.y = t * 0.12 + currentRotY + progress * 0.35
    group.rotation.x = currentRotX - 0.08
    group.position.y = Math.sin(t * 0.6) * 0.04 - progress * 0.15

    orb.position.y = 1.45 + Math.sin(t * 1.1) * 0.06
    camera.position.z = 5.5 - progress * 0.6
    camera.lookAt(0.2, 0.75, 0)

    renderer.render(scene, camera)
    animationId = requestAnimationFrame(render)
  }

  resize()
  window.addEventListener('resize', resize)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerleave', onPointerLeave)
  animationId = requestAnimationFrame(render)

  return Object.assign(
    () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      renderer.dispose()
      legGeo.dispose()
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return
        object.geometry.dispose()
        const material = object.material
        if (Array.isArray(material)) {
          material.forEach((entry) => entry.dispose())
        } else {
          material.dispose()
        }
      })
    },
    {
      setProgress(value: number) {
        progress = value
      },
    },
  )
}
</script>

<template>
  <div
    ref="rootRef"
    class="team-scene"
    :class="$props.class"
  >
    <canvas
      v-if="webglEnabled"
      ref="canvasRef"
      class="team-scene__canvas"
      aria-hidden="true"
    ></canvas>
    <div
      v-else
      class="team-scene__fallback"
      aria-hidden="true"
    >
      <span class="team-scene__fallback-block team-scene__fallback-block--table"></span>
      <span class="team-scene__fallback-block team-scene__fallback-block--sofa"></span>
      <span class="team-scene__fallback-block team-scene__fallback-block--lamp"></span>
    </div>
  </div>
</template>

<style scoped>
.team-scene {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 0;
  background: radial-gradient(ellipse at 50% 80%, rgb(42 33 24 / 0.35), transparent 70%);
}

.team-scene__canvas {
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none;
}

.team-scene__fallback {
  position: relative;
  width: 100%;
  height: 100%;
  perspective: 900px;
  transform-style: preserve-3d;
}

.team-scene__fallback-block {
  position: absolute;
  border-radius: 2px;
  background: linear-gradient(145deg, var(--color-brand-300), var(--color-brand-700));
  opacity: 0.85;
  animation: team-float 6s ease-in-out infinite;
}

.team-scene__fallback-block--table {
  width: 42%;
  height: 8%;
  left: 12%;
  bottom: 28%;
  transform: rotateX(58deg) rotateZ(-6deg);
}

.team-scene__fallback-block--sofa {
  width: 34%;
  height: 18%;
  right: 10%;
  bottom: 32%;
  transform: rotateX(52deg) rotateZ(4deg);
  animation-delay: -2s;
}

.team-scene__fallback-block--lamp {
  width: 6%;
  height: 28%;
  left: 18%;
  bottom: 36%;
  transform: rotateX(48deg);
  animation-delay: -4s;
}

@keyframes team-float {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -6px;
  }
}
</style>
