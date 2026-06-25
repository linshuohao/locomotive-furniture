import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { trackPageView } from '@/lib/analytics/analytics'
import { i18n } from '@/i18n'
import type { AppLocale } from '@/lib/i18n/constants'
import { DEFAULT_LOCALE, LOCALE_BCP47, ZH_LOCALE } from '@/lib/i18n/constants'

type PageRoute = {
  subpath: string
  name: string
  component: NonNullable<RouteRecordRaw['component']>
  titleKey: string
}

const pages: PageRoute[] = [
  {
    subpath: '',
    name: 'home',
    component: () => import('@/views/home/HomeView.vue'),
    titleKey: 'meta.home',
  },
  {
    subpath: '/products',
    name: 'products',
    component: () => import('@/views/catalog/ProductsView.vue'),
    titleKey: 'meta.collection',
  },
  {
    subpath: '/products/:slug',
    name: 'product-detail',
    component: () => import('@/views/catalog/ProductDetailView.vue'),
    titleKey: 'meta.product',
  },
  {
    subpath: '/cart',
    name: 'cart',
    component: () => import('@/views/cart/CartView.vue'),
    titleKey: 'meta.cart',
  },
  {
    subpath: '/checkout',
    name: 'checkout',
    component: () => import('@/views/checkout/CheckoutView.vue'),
    titleKey: 'meta.checkout',
  },
  {
    subpath: '/checkout/success',
    name: 'checkout-success',
    component: () => import('@/views/checkout/CheckoutSuccessView.vue'),
    titleKey: 'meta.checkoutSuccess',
  },
  {
    subpath: '/about',
    name: 'about',
    component: () => import('@/views/about/AboutView.vue'),
    titleKey: 'meta.about',
  },
]

function buildLocalizedRoutes(locale: AppLocale, prefix: string): RouteRecordRaw[] {
  const nameSuffix = locale === ZH_LOCALE ? '-zh' : ''

  return pages.map(
    (page): RouteRecordRaw => ({
      path: page.subpath ? `${prefix}${page.subpath}` : prefix || '/',
      name: `${page.name}${nameSuffix}`,
      component: page.component,
      meta: {
        scrollEffects: true,
        titleKey: page.titleKey,
        locale,
      },
    }),
  )
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    ...buildLocalizedRoutes(DEFAULT_LOCALE, ''),
    ...buildLocalizedRoutes(ZH_LOCALE, '/zh'),
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to) => {
  const locale = (to.meta.locale as AppLocale | undefined) ?? DEFAULT_LOCALE
  i18n.global.locale.value = locale
  document.documentElement.lang = LOCALE_BCP47[locale]
})

router.afterEach((to) => {
  const titleKey = to.meta.titleKey as string | undefined
  const pageTitle = titleKey ? i18n.global.t(titleKey) : i18n.global.t('brand.fullName')
  document.title = `${pageTitle} — ${i18n.global.t('brand.fullName')}`
  trackPageView(to.fullPath)
})

export default router
