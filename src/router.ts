import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useStore as getAccountStore } from './stores/account'

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
        },
    },
    {
        path: '/register',
        name: 'create-account',
        component: loadView('./components/CreateAccount.vue'),
        meta: {
            auth: false,
        },
    },
    {
        path: '/login',
        name: 'login-account',
        component: loadView('./components/LoginAccount.vue'),
        meta: {
            auth: false,
        },
    },
    {
        path: '/file-share',
        name: 'file-share',
        component: loadView('./components/FileShare.vue'),
        meta: {
            auth: true,
        },
    },
    {
        path: '/d/:code',
        name:'file-download',
        component: loadView('./components/FileDownload.vue'),
        meta: {
            auth: false
        },
    },
    {
        path: '/error',
        name: 'error',
        component: loadView('./components/Error.vue'),
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

let accountStore: any

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (!accountStore) {
        accountStore = getAccountStore()
    }

    const stillLoggedIn = await accountStore.validateAuth()
    if (!stillLoggedIn) {
        accountStore.logout()
    }

    if (to.meta && to.meta.auth) {
        if (!stillLoggedIn) {
            return next({
                name: 'home'
            })
        }
    }

    return next()
})

export default (app: any) => {
    app.router = router
    app.use(router)
}