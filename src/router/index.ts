import { createRouter, createWebHistory } from 'vue-router'
import { trackPageView } from '@/lib/analytics/analytics'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/home/HomeView.vue'),
      meta: { scrollEffects: true, title: 'Home' },
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('@/views/catalog/ProductsView.vue'),
      meta: { scrollEffects: true, title: 'Collection' },
    },
    {
      path: '/products/:slug',
      name: 'product-detail',
      component: () => import('@/views/catalog/ProductDetailView.vue'),
      meta: { scrollEffects: true, title: 'Product' },
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/cart/CartView.vue'),
      meta: { scrollEffects: true, title: 'Cart' },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/checkout/CheckoutView.vue'),
      meta: { scrollEffects: true, title: 'Checkout' },
    },
    {
      path: '/checkout/success',
      name: 'checkout-success',
      component: () => import('@/views/checkout/CheckoutSuccessView.vue'),
      meta: { scrollEffects: true, title: 'Order Confirmed' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/about/AboutView.vue'),
      meta: { scrollEffects: true, title: 'About' },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.afterEach((to) => {
  const title = (to.meta.title as string) || 'Atelier Furniture'
  document.title = `${title} — Atelier Furniture`
  trackPageView(to.fullPath)
})

export default router
