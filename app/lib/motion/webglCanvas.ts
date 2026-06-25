import gsap from 'gsap'

export const FULLSCREEN_VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec2 a_uv;
  varying vec2 v_uv;
  void main() {
    v_uv = a_uv;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

const FULLSCREEN_VERTICES = new Float32Array([-1, -1, 0, 1, 1, -1, 1, 1, -1, 1, 0, 0, 1, 1, 1, 0])

export function createWebGLContext(canvas: HTMLCanvasElement): WebGLRenderingContext | null {
  return canvas.getContext('webgl', { alpha: true, antialias: false })
}

export function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
  label: string,
): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(`[${label}] Shader compile failed:`, gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }

  return shader
}

export function linkShaderProgram(
  gl: WebGLRenderingContext,
  vertShader: WebGLShader,
  fragShader: WebGLShader,
  label: string,
): WebGLProgram | null {
  const program = gl.createProgram()
  if (!program) return null

  gl.attachShader(program, vertShader)
  gl.attachShader(program, fragShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn(`[${label}] Program link failed:`, gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }

  gl.useProgram(program)
  return program
}

export function setupFullscreenQuad(gl: WebGLRenderingContext, program: WebGLProgram): void {
  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_VERTICES, gl.STATIC_DRAW)

  const posLoc = gl.getAttribLocation(program, 'a_position')
  const uvLoc = gl.getAttribLocation(program, 'a_uv')
  gl.enableVertexAttribArray(posLoc)
  gl.enableVertexAttribArray(uvLoc)
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 16, 0)
  gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 16, 8)
}

export function createImageTexture(gl: WebGLRenderingContext): WebGLTexture {
  const texture = gl.createTexture()!
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  return texture
}

export function loadImageTexture(
  gl: WebGLRenderingContext,
  texture: WebGLTexture,
  imageSrc: string,
  onReady: () => void,
): void {
  const image = new Image()
  const imageOrigin = new URL(imageSrc, window.location.origin).origin
  if (imageOrigin !== window.location.origin) {
    image.crossOrigin = 'anonymous'
  }

  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    onReady()
  }

  image.src = imageSrc
}

export function readScrollProgress(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--scroll-progress')
  const value = Number.parseFloat(raw)
  return Number.isFinite(value) ? value : 0
}

export function bindCanvasResize(canvas: HTMLCanvasElement, gl: WebGLRenderingContext): () => void {
  function resize() {
    const dpr = Math.min(devicePixelRatio, 2)
    canvas.width = canvas.clientWidth * dpr
    canvas.height = canvas.clientHeight * dpr
    gl.viewport(0, 0, canvas.width, canvas.height)
  }

  resize()
  window.addEventListener('resize', resize)
  return () => window.removeEventListener('resize', resize)
}

export function observeCanvasVisibility(
  canvas: HTMLCanvasElement,
  onChange: (visible: boolean) => void,
): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      onChange(entries.some((entry) => entry.isIntersecting))
    },
    { rootMargin: '10% 0px' },
  )
  observer.observe(canvas)
  return () => observer.disconnect()
}

export function createGsapDrawLoop(
  draw: (time: number) => void,
  isActive: () => boolean,
): () => void {
  const onTick = (time: number) => {
    if (!isActive()) return
    draw(time)
  }

  gsap.ticker.add(onTick)
  return () => gsap.ticker.remove(onTick)
}

export function createShaderProgram(
  gl: WebGLRenderingContext,
  fragmentShader: string,
  label: string,
): WebGLProgram | null {
  const vertShader = compileShader(gl, gl.VERTEX_SHADER, FULLSCREEN_VERTEX_SHADER, label)
  const fragShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader, label)
  if (!vertShader || !fragShader) return null
  return linkShaderProgram(gl, vertShader, fragShader, label)
}
