import { createRouter, createWebHistory, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useStore as getAccountStore } from './stores/account'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('./components/Home.vue'),
        meta: {
            auth: false,
        },
    },
    {
        path: '/register',
        name: 'create-account',
        component: () => import('./components/CreateAccount.vue'),
        meta: {
            auth: false,
        },
    },
    {
        path: '/login',
        name: 'login-account',
        component: () => import('./components/LoginAccount.vue'),
        meta: {
            auth: false,
        },
    },
    {
        path: '/file-share',
        name: 'file-share',
        component: () => import('./components/FileShare.vue'),
        meta: {
            auth: true,
        },
    },
    {
        path: '/d/:code',
        name:'file-download',
        component: () => import('./components/FileDownload.vue'),
        meta: {
            auth: false
        },
    },
    {
        path: '/error',
        name: 'error',
        component: () => import('./components/Error.vue'),
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