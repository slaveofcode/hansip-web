import { createApp } from 'vue'
import VueCookies from  'vue3-cookies'
import router from './router';
import axios from './plugins/axios'
import store from './stores'

import './index.css'

import App from './App.vue'

const app = createApp(App)

app.use(router)
app.use(axios)
app.use(store)
app.use(VueCookies, {
    expireTimes: "30d",
    path: '/',
    domain: '',
    secure: false, // TODO: true on prod
    sameSite: 'None'
})

app.mount('#app')
