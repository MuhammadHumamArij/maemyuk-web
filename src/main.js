import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/tokens.css'
import './styles/base.css'

router.afterEach((to) => {
  document.title = `${to.meta.title ?? 'MaemYuk'} | MaemYuk`
})

createApp(App).use(router).mount('#app')
