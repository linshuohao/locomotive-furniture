import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const EASE_BRAND = 'power3.out'
const EASE_EXPO = 'expo.out'

/** ScrollTrigger defaults — no reverse (prevents content vanishing on scroll up) */
const SCROLL_TOGGLE = 'play none none none'

/** Page-load hero sequence — title → subtitle → CTA with overlap */
export function createHeroEnterTimeline(
  elements: {
    eyebrow?: HTMLElement | null
    title?: HTMLElement | null
    subtitle?: HTMLElement | null
    cta?: HTMLElement | null
  },
  options: { delay?: number } = {},
) {
  const { delay = 0.15 } = options
  const tl = gsap.timeline({ delay, defaults: { ease: EASE_EXPO, duration: 1 } })

  if (elements.eyebrow) {
    tl.fromTo(elements.eyebrow, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 })
  }
  if (elements.title) {
    tl.fromTo(
      elements.title,
      { y: 48, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 1 },
      '-=0.35',
    )
  }
  if (elements.subtitle) {
    tl.fromTo(
      elements.subtitle,
      { y: 32, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8 },
      '-=0.55',
    )
  }
  if (elements.cta) {
    tl.fromTo(
      elements.cta,
      { y: 20, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.6 },
      '-=0.45',
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
  const { stagger = 0.1, y = 32 } = options
  const targets = typeof items === 'string' ? items : gsap.utils.toArray(items)
  if (!targets.length) return null

  return gsap.fromTo(
    targets,
    { y, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.75,
      stagger,
      ease: EASE_BRAND,
      immediateRender: false,
      scrollTrigger: {
        trigger: container,
        start: 'top 88%',
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

/** Scrub inner content within a section — NO pin (pin + Locomotive causes huge gaps) */
export function createNarrativeScrub(section: HTMLElement, inner: HTMLElement) {
  return gsap.fromTo(
    inner,
    { y: 40, autoAlpha: 0.6 },
    {
      y: -20,
      autoAlpha: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
      },
    },
  )
}

/** PDP copy column reveal */
export function createPdpTimeline(copyCol: HTMLElement) {
  const targets = copyCol.querySelectorAll('[data-pdp-reveal]')
  if (!targets.length) return null

  return gsap.fromTo(
    targets,
    { y: 28, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      stagger: 0.08,
      duration: 0.8,
      ease: EASE_BRAND,
      immediateRender: false,
      scrollTrigger: {
        trigger: copyCol,
        start: 'top 85%',
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
    { x: -24, autoAlpha: 0 },
    {
      x: 0,
      autoAlpha: 1,
      stagger: 0.07,
      duration: 0.65,
      ease: EASE_BRAND,
      immediateRender: false,
      scrollTrigger: {
        trigger: form,
        start: 'top 88%',
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
  const { stagger = 0.08, y = '110%', delay = 0, scroll = true } = options
  const lines = container.querySelectorAll('[data-mask-line]')
  if (!lines.length) return null

  const config: gsap.TweenVars = {
    y: 0,
    duration: 0.9,
    stagger,
    ease: EASE_EXPO,
    delay,
  }

  if (scroll) {
    config.immediateRender = false
    config.scrollTrigger = {
      trigger: container,
      start: 'top 88%',
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
      { clipPath: 'inset(100% 0 0 0)' },
      {
        clipPath: 'inset(0% 0 0 0)',
        ease: 'none',
        scrollTrigger: {
          trigger,
          start: 'top 85%',
          end: 'top 35%',
          scrub: 1,
        },
      },
    )
  }

  return gsap.fromTo(
    target,
    { clipPath: 'inset(100% 0 0 0)', autoAlpha: 0.6 },
    {
      clipPath: 'inset(0% 0 0 0)',
      autoAlpha: 1,
      duration: 1.1,
      ease: EASE_EXPO,
      immediateRender: false,
      scrollTrigger: {
        trigger,
        start: 'top 85%',
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
  const { stagger = 0.12, scale = 0.92 } = options
  const targets = typeof items === 'string' ? items : gsap.utils.toArray(items)
  if (!targets.length) return null

  return gsap.fromTo(
    targets,
    { scale, autoAlpha: 0, y: 24 },
    {
      scale: 1,
      autoAlpha: 1,
      y: 0,
      duration: 0.85,
      stagger,
      ease: EASE_EXPO,
      immediateRender: false,
      scrollTrigger: {
        trigger: container,
        start: 'top 88%',
        toggleActions: SCROLL_TOGGLE,
        once: true,
      },
    },
  )
}

/** Horizontal scrub — subtle drift like Locomotive featured cards */
export function createHorizontalDrift(
  trigger: HTMLElement,
  target: HTMLElement,
  options: { xPercent?: number } = {},
) {
  const { xPercent = -6 } = options

  return gsap.fromTo(
    target,
    { xPercent: -xPercent / 2 },
    {
      xPercent: xPercent / 2,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    },
  )
}

/** Success celebration burst (mount-only, no scroll) */
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

export function killScrollAnimations(scope?: HTMLElement | string) {
  if (scope) {
    ScrollTrigger.getAll().forEach((st) => {
      const trigger = st.trigger as Element | undefined
      if (trigger && typeof scope === 'string' && trigger.matches?.(`${scope} *`)) st.kill()
      else if (trigger && scope instanceof HTMLElement && scope.contains(trigger)) st.kill()
    })
  }
}
