import { createRouter, createWebHashHistory } from 'vue-router'

function loadView(path: string) {
    return () => import(/* @vite-ignore */path)
}

const routes = [
    {
        path: '/',
        name: 'home',
        component: loadView('./components/Home.vue'),
        meta: {
            auth: false,
        }
    },
    {
        path: '/register',
        name: 'create-account',
        component: loadView('./components/CreateAccount.vue'),
        meta: {
            auth: false,
        }
    },
    {
        path: '/login',
        name: 'login-account',
        component: loadView('./components/LoginAccount.vue'),
        meta: {
            auth: false,
        }
    },
    {
        path: '/file-share',
        name: 'file-share',
        component: loadView('./components/FileShare.vue'),
        meta: {
            auth: true,
        }
    },
    {
        path: '/error',
        name: 'error',
        component: loadView('./components/Error.vue'),
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default (app: any) => {
    app.router = router
    app.use(router)
}