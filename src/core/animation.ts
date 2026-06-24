import gsap from 'gsap'

export function fadeInUp(
  element: HTMLElement | string,
  options: { delay?: number; duration?: number; y?: number } = {},
) {
  const { delay = 0, duration = 0.8, y = 40 } = options
  return gsap.from(element, {
    opacity: 0,
    y,
    duration,
    delay,
    ease: 'power3.out',
  })
}

export function staggerFadeIn(
  elements: HTMLElement[] | string,
  options: { stagger?: number; delay?: number } = {},
) {
  const { stagger = 0.1, delay = 0 } = options
  return gsap.from(elements, {
    opacity: 0,
    y: 30,
    duration: 0.6,
    stagger,
    delay,
    ease: 'power2.out',
  })
}

export function killAnimations(target?: gsap.TweenTarget) {
  if (target) gsap.killTweensOf(target)
}
