/** Public static asset URLs — served from project-root `public/`, no Vite pipeline. */
export const staticImages = {
  marketing: {
    hero: '/images/marketing/hero.jpg',
    philosophy: '/images/marketing/philosophy.jpg',
  },
  pages: {
    about: '/images/pages/about.jpg',
  },
  product: (productId: number, index: number) => `/images/products/${productId}-${index}.jpg`,
} as const
