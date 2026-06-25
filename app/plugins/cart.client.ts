export default defineNuxtPlugin({
  name: 'cart',
  enforce: 'pre',
  setup(nuxtApp) {
    if (!import.meta.client) return

    nuxtApp.hook('app:created', () => {
      useCartStore().hydrateFromStorage()
    })
  },
})
