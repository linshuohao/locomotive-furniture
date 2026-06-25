/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_ENV: string
  readonly VITE_SITE_URL: string
  readonly VITE_ENABLE_SMOOTH_SCROLL: string
  readonly VITE_ENABLE_PARALLAX: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_CDN_BASE: string
  /** Commerce data source: mock (local catalog) | http (VITE_API_BASE_URL) */
  readonly VITE_COMMERCE_PROVIDER: string
  /** REST API root, e.g. https://api.example.com */
  readonly VITE_API_BASE_URL: string
  /** Payment integration: none | stripe | shopify */
  readonly VITE_PAYMENT_PROVIDER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
