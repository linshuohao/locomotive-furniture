/** Unified easing curve — matches Locomotive.ca feel */
export const EASE_OUT_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)'
export const EASE_IN_OUT = 'cubic-bezier(0.65, 0, 0.35, 1)'

/** Wheel scroll — lerp only (no duration); duration fights lerp and feels stepped */
export const LENIS_OPTIONS = {
  lerp: 0.12,
  smoothWheel: true,
  wheelMultiplier: 0.9,
  touchMultiplier: 1,
} as const

/** Programmatic scrollTo / anchor jumps only */
export const SCROLL_TO_DURATION = 1.2

export const SCROLL_CSS_VARS = {
  progress: '--scroll-progress',
  direction: '--scroll-direction',
} as const

/** Matches Locomotive.ca lazyLoad offset (data-scroll-offset="15%") */
export const LAZY_LOAD_ROOT_MARGIN = '15% 0px'

export const SCROLL_INJECTION_KEY = Symbol('scroll')
