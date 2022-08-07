import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import './index.css'

import App from './App.vue'
import Home from './components/Home.vue'
import CreateAccount from './components/CreateAccount.vue'
import FileShare from './components/FileShare.vue'

const routes = [
    { path: '/', component: Home, name: 'home' },
    { path: '/new-account', component: CreateAccount, name: 'create-account' },
    { path: '/file-share', component: FileShare, name: 'file-share' }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

const app = createApp(App)

app.use(router)

app.mount('#app')
