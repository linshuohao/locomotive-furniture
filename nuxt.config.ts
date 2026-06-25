import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  srcDir: 'src',
  compatibilityDate: '2025-06-01',
  devtools: { enabled: false },
  ssr: true,

  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],

  css: ['~/assets/styles/main.css'],

  pinia: {
    storesDirs: ['store'],
  },

  i18n: {
    restructureDir: false,
    bundle: {
      optimizeTranslationDirective: false,
    },
    locales: [
      { code: 'en', language: 'en-US', file: 'en.json' },
      { code: 'zh', language: 'zh-CN', file: 'zh-CN.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    langDir: 'i18n/locales',
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
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('locomotive-scroll') || id.includes('gsap') || id.includes('lenis')) {
                return 'scroll'
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
