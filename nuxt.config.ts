import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-06-01',
  devtools: { enabled: false },

  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],

  css: ['~/assets/css/main.css'],

  pinia: {
    storesDirs: ['store'],
  },

  i18n: {
    locales: [
      { code: 'en', language: 'en-US', file: 'en.json' },
      { code: 'zh', language: 'zh-CN', file: 'zh-CN.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: 'locales',
    detectBrowserLanguage: false,
  },

  runtimeConfig: {
    public: {
      appTitle: 'Atelier Furniture',
      appEnv: 'development',
      siteUrl: 'http://localhost:3000',
      enableSmoothScroll: 'true',
      enableParallax: 'true',
      enableAnalytics: 'false',
      commerceProvider: 'mock',
      apiBaseUrl: '',
      paymentProvider: 'none',
      cdnBase: '',
    },
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['three'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('locomotive-scroll') || id.includes('gsap') || id.includes('lenis')) {
                return 'scroll'
              }
              if (id.includes('three')) {
                return 'three'
              }
              if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
                return 'vendor'
              }
            }
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      ignore: ['/images/**', '/favicon.svg', '/icons.svg'],
    },
    routeRules: {
      '/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/favicon.svg': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/icons.svg': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    },
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
    pageTransition: false,
    layoutTransition: false,
  },
})
