import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'
import Features from './pages/Features.vue'
import GettingStarted from './pages/GettingStarted.vue'
import Documentation from './pages/Documentation.vue'
import DocViewer from './pages/DocViewer.vue'
import Libraries from './pages/Libraries.vue'
import Contributing from './pages/Contributing.vue'
import V3Release from './pages/V3Release.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/v3', component: V3Release },
  { path: '/features', component: Features },
  { path: '/getting-started', component: GettingStarted },
  { path: '/docs', component: Documentation },
  { path: '/docs/:slug', component: DocViewer },
  { path: '/libraries', component: Libraries },
  { path: '/contributing', component: Contributing },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})
