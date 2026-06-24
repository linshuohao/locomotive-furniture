import { createRouter, createWebHistory } from 'vue-router'
import { trackPageView } from '@/core/monitoring'

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
      component: () => import('@/views/HomeView.vue'),
      meta: { scrollEffects: true, title: 'Home' },
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('@/views/ProductsView.vue'),
      meta: { scrollEffects: false, title: 'Collection' },
    },
    {
      path: '/products/:slug',
      name: 'product-detail',
      component: () => import('@/views/ProductDetailView.vue'),
      meta: { scrollEffects: false, title: 'Product' },
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/CartView.vue'),
      meta: { scrollEffects: false, title: 'Cart' },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/CheckoutView.vue'),
      meta: { scrollEffects: false, title: 'Checkout' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
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
