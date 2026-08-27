import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// Handson: Weather UI Library — PrimeVue(+ 아이콘/계절 배경 테마)
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'
import './assets/weather-ui.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    // 시스템 다크모드를 자동으로 따라가지 않도록 실제로 안 붙이는 셀렉터를 지정
    options: { darkModeSelector: '.p-dark-never', cssLayer: false },
  },
})

app.mount('#app')
