import { createApp } from 'vue'
import App from './App.vue'
import AboutPage from './components/AboutPage.vue'
import HomePage from './components/HomePage.vue'
import KeywordListPage from './components/KeywordListPage.vue'
import KeywordPage from './components/KeywordPage.vue'
import CveListPage from './components/CveListPage.vue'
import CvePage from './components/CvePage.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage },
  { path: '/keyword-list', component: KeywordListPage },
  { path: '/keyword/:id', component: KeywordPage, props: true },
  { path: '/cve-list', component: CveListPage },
  { path: '/cve/:cveId', component: CvePage, props: true }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes, 
})

const app = createApp(App)
app.use(router)
app.mount('#app')
