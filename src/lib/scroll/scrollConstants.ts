/** Unified easing curve — matches Locomotive.ca feel */
export const EASE_OUT_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)'
export const EASE_IN_OUT = 'cubic-bezier(0.65, 0, 0.35, 1)'

export const LENIS_OPTIONS = {
  lerp: 0.08,
  duration: 1.2,
  smoothWheel: true,
  wheelMultiplier: 0.9,
  touchMultiplier: 1.5,
} as const

export const SCROLL_CSS_VARS = {
  progress: '--scroll-progress',
  direction: '--scroll-direction',
} as const

export const SCROLL_INJECTION_KEY = Symbol('scroll')
