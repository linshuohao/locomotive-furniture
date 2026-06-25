import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const EASE_EXPO = 'expo.out'

/** ScrollTrigger defaults — no reverse (prevents content vanishing on scroll up) */
const SCROLL_TOGGLE = 'play none none none'
const SCROLL_START = 'top 90%'

/** Page-load hero sequence — title → subtitle → CTA with overlap */
export function createHeroEnterTimeline(
  elements: {
    eyebrow?: HTMLElement | null
    title?: HTMLElement | null
    subtitle?: HTMLElement | null
    cta?: HTMLElement | null
    media?: HTMLElement | null
  },
  options: { delay?: number } = {},
) {
  const { delay = 0.2 } = options
  const tl = gsap.timeline({ delay, defaults: { ease: EASE_EXPO, duration: 1.1 } })

  if (elements.media) {
    tl.fromTo(
      elements.media,
      {
        rotateX: 14,
        scale: 1.14,
        transformPerspective: 1400,
        transformOrigin: '50% 62%',
      },
      {
        rotateX: 0,
        scale: 1,
        duration: 1.45,
        ease: 'expo.out',
        clearProps: 'transform',
      },
      0,
    )
  }

  if (elements.eyebrow) {
    tl.fromTo(elements.eyebrow, { y: 32, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.85 })
  }
  if (elements.title) {
    tl.fromTo(
      elements.title,
      { y: 56, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 1.1 },
      '-=0.4',
    )
  }
  if (elements.subtitle) {
    tl.fromTo(
      elements.subtitle,
      { y: 40, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.95 },
      '-=0.6',
    )
  }
  if (elements.cta) {
    tl.fromTo(
      elements.cta,
      { y: 28, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.75 },
      '-=0.5',
    )
  }

  return tl
}

/** Staggered grid reveal on scroll enter (runs once) */
export function createStaggerReveal(
  container: HTMLElement,
  items: HTMLElement[] | NodeListOf<Element> | string,
  options: { stagger?: number; y?: number } = {},
) {
  const { stagger = 0.1, y = 40 } = options
  const targets = typeof items === 'string' ? items : gsap.utils.toArray(items)
  if (!targets.length) return null

  return gsap.fromTo(
    targets,
    { y, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.95,
      stagger,
      ease: EASE_EXPO,
      immediateRender: false,
      scrollTrigger: {
        trigger: container,
        start: SCROLL_START,
        toggleActions: SCROLL_TOGGLE,
        once: true,
      },
    },
  )
}

/** Scrubbed parallax on a single element — subtle, no pin */
export function createScrubParallax(
  trigger: HTMLElement,
  target: HTMLElement,
  options: { yPercent?: number; scrub?: number } = {},
) {
  const { yPercent = -8, scrub = 1 } = options

  return gsap.to(target, {
    yPercent,
    ease: 'none',
    scrollTrigger: {
      trigger,
      start: 'top bottom',
      end: 'bottom top',
      scrub,
    },
  })
}

/** PDP copy column reveal */
export function createPdpTimeline(copyCol: HTMLElement) {
  const targets = copyCol.querySelectorAll('[data-pdp-reveal]')
  if (!targets.length) return null

  return gsap.fromTo(
    targets,
    { y: 36, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      stagger: 0.07,
      duration: 0.95,
      ease: EASE_EXPO,
      immediateRender: false,
      scrollTrigger: {
        trigger: copyCol,
        start: SCROLL_START,
        toggleActions: SCROLL_TOGGLE,
        once: true,
      },
    },
  )
}

/** Checkout form fields cascade */
export function createFormCascade(form: HTMLElement, fields: HTMLElement[]) {
  if (!fields.length) return null

  return gsap.fromTo(
    fields,
    { x: -32, autoAlpha: 0 },
    {
      x: 0,
      autoAlpha: 1,
      stagger: 0.08,
      duration: 0.8,
      ease: EASE_EXPO,
      immediateRender: false,
      scrollTrigger: {
        trigger: form,
        start: SCROLL_START,
        toggleActions: SCROLL_TOGGLE,
        once: true,
      },
    },
  )
}

/** Locomotive-style line mask reveal — each [data-mask-line] slides up from clip */
export function createMaskLineReveal(
  container: HTMLElement,
  options: { stagger?: number; y?: number; delay?: number; scroll?: boolean } = {},
) {
  const { stagger = 0.06, y = '110%', delay = 0, scroll = true } = options
  const lines = container.querySelectorAll('[data-mask-line]')
  if (!lines.length) return null

  const config: gsap.TweenVars = {
    y: 0,
    duration: 1.05,
    stagger,
    ease: EASE_EXPO,
    delay,
  }

  if (scroll) {
    config.immediateRender = false
    config.scrollTrigger = {
      trigger: container,
      start: SCROLL_START,
      toggleActions: SCROLL_TOGGLE,
      once: true,
    }
  }

  return gsap.fromTo(lines, { y, autoAlpha: 1 }, config)
}

/** Hero mount-only mask lines (no scroll trigger) */
export function createHeroMaskLines(
  container: HTMLElement,
  options: { stagger?: number; delay?: number } = {},
) {
  return createMaskLineReveal(container, { ...options, scroll: false })
}

/** Locomotive-style per-character mask reveal */
export function createSplitCharReveal(
  container: HTMLElement,
  options: { stagger?: number; delay?: number; scroll?: boolean } = {},
) {
  const { stagger = 0.018, delay = 0, scroll = true } = options
  const chars = container.querySelectorAll('[data-split-char]')
  if (!chars.length) return null

  const config: gsap.TweenVars = {
    y: 0,
    rotateX: 0,
    duration: 0.95,
    stagger,
    ease: EASE_EXPO,
    delay,
    immediateRender: false,
  }

  if (scroll) {
    config.scrollTrigger = {
      trigger: container,
      start: SCROLL_START,
      toggleActions: SCROLL_TOGGLE,
      once: true,
    }
  }

  return gsap.fromTo(chars, { y: '108%', rotateX: 52, transformOrigin: '50% 100%' }, config)
}

/** Hero mount-only char reveal (no scroll trigger) */
export function createHeroCharReveal(
  container: HTMLElement,
  options: { stagger?: number; delay?: number } = {},
) {
  return createSplitCharReveal(container, { ...options, scroll: false })
}

/** Image clip-path reveal on scroll — expands from bottom */
export function createClipImageReveal(
  trigger: HTMLElement,
  target: HTMLElement,
  options: { scrub?: boolean } = {},
) {
  const { scrub = false } = options

  if (scrub) {
    return gsap.fromTo(
      target,
      { clipPath: 'inset(0 0 100% 0)' },
      {
        clipPath: 'inset(0% 0 0 0)',
        ease: 'none',
        scrollTrigger: {
          trigger,
          start: 'top 88%',
          end: 'top 30%',
          scrub: 1.2,
        },
      },
    )
  }

  return gsap.fromTo(
    target,
    { clipPath: 'inset(0 0 100% 0)', autoAlpha: 0.7 },
    {
      clipPath: 'inset(0% 0 0 0)',
      autoAlpha: 1,
      duration: 1.25,
      ease: EASE_EXPO,
      immediateRender: false,
      scrollTrigger: {
        trigger,
        start: SCROLL_START,
        toggleActions: SCROLL_TOGGLE,
        once: true,
      },
    },
  )
}

/** Scale + fade reveal for cards and blocks */
export function createScaleFadeReveal(
  container: HTMLElement,
  items: HTMLElement[] | NodeListOf<Element> | string,
  options: { stagger?: number; scale?: number } = {},
) {
  const { stagger = 0.14, scale = 0.94 } = options
  const targets = typeof items === 'string' ? items : gsap.utils.toArray(items)
  if (!targets.length) return null

  return gsap.fromTo(
    targets,
    { scale, y: 36 },
    {
      scale: 1,
      y: 0,
      duration: 1,
      stagger,
      ease: EASE_EXPO,
      immediateRender: false,
      scrollTrigger: {
        trigger: container,
        start: SCROLL_START,
        toggleActions: SCROLL_TOGGLE,
        once: true,
      },
    },
  )
}

/** Locomotive-style hover char shuffle — random Y/rotateX per glyph */
export function createHoverShuffle(
  container: HTMLElement,
  options: {
    yRange?: [number, number]
    rotateRange?: [number, number]
    stagger?: number
    duration?: number
    ease?: string
  } = {},
) {
  const {
    yRange = [-14, -6],
    rotateRange = [-12, 8],
    stagger = 0.024,
    duration = 0.42,
    ease = EASE_EXPO,
  } = options

  const chars = container.querySelectorAll('[data-split-char]')
  if (!chars.length) return null

  let active: gsap.core.Tween | null = null

  function shuffle() {
    active?.kill()
    active = gsap.to(chars, {
      y: () => gsap.utils.random(yRange[0], yRange[1]),
      rotateX: () => gsap.utils.random(rotateRange[0], rotateRange[1]),
      duration,
      stagger,
      ease,
      overwrite: 'auto',
    })
  }

  function reset() {
    active?.kill()
    active = gsap.to(chars, {
      y: 0,
      rotateX: 0,
      duration: 0.55,
      stagger: stagger * 0.75,
      ease,
      overwrite: 'auto',
    })
  }

  container.addEventListener('mouseenter', shuffle)
  container.addEventListener('mouseleave', reset)
  container.addEventListener('focusin', shuffle)
  container.addEventListener('focusout', reset)

  return {
    kill() {
      active?.kill()
      container.removeEventListener('mouseenter', shuffle)
      container.removeEventListener('mouseleave', reset)
      container.removeEventListener('focusin', shuffle)
      container.removeEventListener('focusout', reset)
      gsap.set(chars, { y: 0, rotateX: 0 })
    },
  }
}

export const HOVER_TEXT_EFFECTS = ['shuffle', 'wave', 'glitch', 'pop', 'skew', 'slide'] as const
export type HoverTextEffect = (typeof HOVER_TEXT_EFFECTS)[number]

export type HoverTextController = NonNullable<ReturnType<typeof createHoverShuffle>>

export interface HoverTextEffectOptions {
  stagger?: number
  duration?: number
  ease?: string
}

export function pickHoverTextEffect(seed: number): HoverTextEffect {
  return HOVER_TEXT_EFFECTS[Math.abs(seed) % HOVER_TEXT_EFFECTS.length]!
}

function getHoverChars(container: HTMLElement) {
  return container.querySelectorAll('[data-split-char]')
}

function bindHoverChars(
  container: HTMLElement,
  chars: NodeListOf<Element>,
  onEnter: () => void,
  onLeave: () => void,
  resetProps: gsap.TweenVars,
): HoverTextController {
  container.addEventListener('mouseenter', onEnter)
  container.addEventListener('mouseleave', onLeave)
  container.addEventListener('focusin', onEnter)
  container.addEventListener('focusout', onLeave)

  return {
    kill() {
      container.removeEventListener('mouseenter', onEnter)
      container.removeEventListener('mouseleave', onLeave)
      container.removeEventListener('focusin', onEnter)
      container.removeEventListener('focusout', onLeave)
      gsap.set(chars, resetProps)
    },
  }
}

/** Staggered sine wave lift per glyph */
export function createHoverWave(
  container: HTMLElement,
  options: HoverTextEffectOptions & { amplitude?: number } = {},
) {
  const { stagger = 0.03, duration = 0.55, ease = EASE_EXPO, amplitude = -14 } = options
  const chars = getHoverChars(container)
  if (!chars.length) return null

  let active: gsap.core.Tween | null = null

  function enter() {
    active?.kill()
    active = gsap.to(chars, {
      y: (index) => Math.sin(index * 0.65) * amplitude,
      duration,
      stagger,
      ease,
      overwrite: 'auto',
    })
  }

  function leave() {
    active?.kill()
    active = gsap.to(chars, {
      y: 0,
      duration: 0.5,
      stagger: stagger * 0.7,
      ease,
      overwrite: 'auto',
    })
  }

  return bindHoverChars(container, chars, enter, leave, { y: 0 })
}

/** Rapid micro-jitter — digital glitch feel */
export function createHoverGlitch(container: HTMLElement, options: HoverTextEffectOptions = {}) {
  const { stagger = 0.016, duration = 0.14, ease = 'steps(2)' } = options
  const chars = getHoverChars(container)
  if (!chars.length) return null

  let active: gsap.core.Tween | null = null

  function enter() {
    active?.kill()
    active = gsap.to(chars, {
      x: () => gsap.utils.random(-5, 5),
      y: () => gsap.utils.random(-8, 4),
      opacity: () => gsap.utils.random(0.35, 1),
      duration,
      stagger,
      ease,
      overwrite: 'auto',
    })
  }

  function leave() {
    active?.kill()
    active = gsap.to(chars, {
      x: 0,
      y: 0,
      opacity: 1,
      duration: 0.35,
      stagger: stagger * 0.8,
      ease: EASE_EXPO,
      overwrite: 'auto',
    })
  }

  return bindHoverChars(container, chars, enter, leave, { x: 0, y: 0, opacity: 1 })
}

/** Scale pop with slight lift */
export function createHoverPop(
  container: HTMLElement,
  options: HoverTextEffectOptions & { scale?: number } = {},
) {
  const { stagger = 0.028, duration = 0.45, ease = EASE_EXPO, scale = 1.28 } = options
  const chars = getHoverChars(container)
  if (!chars.length) return null

  let active: gsap.core.Tween | null = null

  function enter() {
    active?.kill()
    active = gsap.to(chars, {
      scale,
      y: -10,
      duration,
      stagger,
      ease,
      overwrite: 'auto',
    })
  }

  function leave() {
    active?.kill()
    active = gsap.to(chars, {
      scale: 1,
      y: 0,
      duration: 0.5,
      stagger: stagger * 0.75,
      ease,
      overwrite: 'auto',
    })
  }

  return bindHoverChars(container, chars, enter, leave, { scale: 1, y: 0 })
}

/** Alternating Y-axis flip per glyph */
export function createHoverSkew(
  container: HTMLElement,
  options: HoverTextEffectOptions & { rotateY?: number } = {},
) {
  const { stagger = 0.026, duration = 0.48, ease = EASE_EXPO, rotateY = 22 } = options
  const chars = getHoverChars(container)
  if (!chars.length) return null

  let active: gsap.core.Tween | null = null

  function enter() {
    active?.kill()
    active = gsap.to(chars, {
      rotateY: (index) => (index % 2 === 0 ? rotateY : -rotateY),
      y: -6,
      duration,
      stagger,
      ease,
      overwrite: 'auto',
    })
  }

  function leave() {
    active?.kill()
    active = gsap.to(chars, {
      rotateY: 0,
      y: 0,
      duration: 0.55,
      stagger: stagger * 0.75,
      ease,
      overwrite: 'auto',
    })
  }

  return bindHoverChars(container, chars, enter, leave, { rotateY: 0, y: 0 })
}

/** Slide up from baseline on hover */
export function createHoverSlide(
  container: HTMLElement,
  options: HoverTextEffectOptions & { distance?: number } = {},
) {
  const { stagger = 0.022, duration = 0.5, ease = EASE_EXPO, distance = 18 } = options
  const chars = getHoverChars(container)
  if (!chars.length) return null

  let active: gsap.core.Tween | null = null

  function enter() {
    active?.kill()
    active = gsap.fromTo(
      chars,
      { y: distance, autoAlpha: 0.25 },
      {
        y: -4,
        autoAlpha: 1,
        duration,
        stagger,
        ease,
        overwrite: 'auto',
      },
    )
  }

  function leave() {
    active?.kill()
    active = gsap.to(chars, {
      y: 0,
      autoAlpha: 1,
      duration: 0.5,
      stagger: stagger * 0.75,
      ease,
      overwrite: 'auto',
    })
  }

  return bindHoverChars(container, chars, enter, leave, { y: 0, autoAlpha: 1 })
}

export function createHoverTextEffect(
  container: HTMLElement,
  effect: HoverTextEffect = 'shuffle',
  options: HoverTextEffectOptions = {},
): HoverTextController | null {
  switch (effect) {
    case 'wave':
      return createHoverWave(container, options)
    case 'glitch':
      return createHoverGlitch(container, options)
    case 'pop':
      return createHoverPop(container, options)
    case 'skew':
      return createHoverSkew(container, options)
    case 'slide':
      return createHoverSlide(container, options)
    case 'shuffle':
    default:
      return createHoverShuffle(container, options)
  }
}

/** Full-screen page intro curtain — label fade then clip-path reveal */
export function createPageIntroCurtainTimeline(
  curtain: HTMLElement,
  label: HTMLElement | null,
  onComplete?: () => void,
) {
  const tl = gsap.timeline({ onComplete })

  if (label) {
    tl.fromTo(label, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: 'expo.out' }, 0)
  }

  tl.to(
    curtain,
    {
      clipPath: 'inset(0 0 100% 0)',
      duration: 1.05,
      ease: 'expo.inOut',
    },
    '+=0.55',
  )

  return tl
}

export function createSuccessTimeline(container: HTMLElement) {
  const children = container.querySelectorAll('[data-success-item]')
  const tl = gsap.timeline({ defaults: { ease: EASE_EXPO } })

  tl.fromTo(container, { scale: 0.98, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.5 })

  if (children.length) {
    tl.fromTo(
      children,
      { y: 20, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.7 },
      '-=0.25',
    )
  }

  return tl
}
