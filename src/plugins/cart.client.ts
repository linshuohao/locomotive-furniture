export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    useCartStore().hydrateFromStorage()
  })
})
