import { createHoverShuffle } from '@/lib/scroll/animation'
import { getMotionCapabilitiesSnapshot } from '@/lib/motion/motionCapabilities'

export type HoverShuffleController = NonNullable<ReturnType<typeof createHoverShuffle>>

const ENHANCED = 'shuffleEnhanced'

const SKIP_SELECTORS = [
  '.product-card__image-link',
  '.magnetic-button__link',
  '[data-no-shuffle]',
  'button a',
  'a button',
].join(', ')

function isSkippable(link: HTMLAnchorElement): boolean {
  if (link.dataset[ENHANCED] === 'true') return true
  if (link.closest(SKIP_SELECTORS)) return true
  if (link.querySelector('[data-split-char]')) return true
  if (link.getAttribute('aria-label') && !link.textContent?.trim()) return true
  return false
}

function getDirectText(link: HTMLAnchorElement): string | null {
  const text = [...link.childNodes]
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent ?? '')
    .join('')
    .trim()

  if (text) return text

  const onlySpan = link.querySelector(':scope > span:only-child')
  if (onlySpan && !onlySpan.querySelector('[data-split-char]')) {
    const spanText = onlySpan.textContent?.trim()
    if (spanText) return spanText
  }

  return null
}

export function splitTextToChars(element: HTMLElement, text: string): void {
  element.textContent = ''
  element.classList.add('hover-shuffle-text')
  element.style.perspective = '600px'

  for (const char of text) {
    const span = document.createElement('span')
    span.dataset.splitChar = ''
    span.className = 'inline-block'
    span.textContent = char === ' ' ? '\u00A0' : char
    if (char === ' ') span.setAttribute('aria-hidden', 'true')
    element.appendChild(span)
  }
}

export function canEnhanceLink(link: HTMLAnchorElement): boolean {
  if (!getMotionCapabilitiesSnapshot().animations) return false
  if (isSkippable(link)) return false

  const text = getDirectText(link)
  return Boolean(text && text.length > 0)
}

export function enhanceLinkForShuffle(link: HTMLAnchorElement): HoverShuffleController | null {
  if (!canEnhanceLink(link)) return null

  const text = getDirectText(link)
  if (!text) return null

  const onlySpan = link.querySelector(':scope > span:only-child')
  const target =
    onlySpan instanceof HTMLElement && !onlySpan.querySelector('[data-split-char]')
      ? onlySpan
      : link

  if (target.dataset[ENHANCED] === 'true') return null

  target.dataset[ENHANCED] = 'true'
  link.dataset[ENHANCED] = 'true'
  splitTextToChars(target, text)

  return createHoverShuffle(target)
}

export const HOVER_SHUFFLE_SELECTOR = 'a[data-hover-shuffle], [data-shuffle-zone] a'

export function collectShuffleLinks(root: ParentNode = document): HTMLAnchorElement[] {
  return [...root.querySelectorAll(HOVER_SHUFFLE_SELECTOR)].filter(
    (node): node is HTMLAnchorElement => node instanceof HTMLAnchorElement,
  )
}
