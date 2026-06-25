import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initWebVitals } from '@/lib/analytics/webVitals'
import { initErrorTracking } from '@/lib/analytics/analytics'
import '@/assets/styles/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

initWebVitals()
initErrorTracking()
