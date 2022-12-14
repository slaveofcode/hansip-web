import { createApp } from 'vue'
import VueCookies from  'vue3-cookies'
import VueFinalModal from 'vue-final-modal'
import router from './router';
import axios from './plugins/axios'
import store from './stores'

import './index.css'

import App from './App.vue'

const app = createApp(App)

app.use(axios)
app.use(store)
app.use(router)
app.use(VueCookies, {
    expireTimes: "30d",
    path: '/',
    domain: '',
    secure: false, // TODO: true on prod
    sameSite: 'None'
})
app.use(VueFinalModal, {
    key: '$vfm',
    componentName: 'VueFinalModal',
    dynamicContainerName: 'ModalsContainer'
})

app.mount('#app')
