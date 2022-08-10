import { createApp } from 'vue'
import router from './router';
import axios from './plugins/axios'
import auth from './plugins/auth'
import store from './stores'

import './index.css'

import App from './App.vue'

const app = createApp(App)

app.use(router)
app.use(axios)
app.use(auth)
app.use(store)

app.mount('#app')
