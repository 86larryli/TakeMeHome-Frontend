import Vue from 'vue'
import VueRouter from 'vue-router'
import FlightScheduleView from '@/views/FlightScheduleView'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        meta: {
            requireAuth: false
        },
        component: FlightScheduleView
    },
    {
        path: '/watchlist',
        name: 'watchlist',
        meta: {
            requireAuth: true
        },
        // route level code-splitting
        // this generates a separate chunk (watchlist.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "watchlist" */ '@/views/WatchListView.vue')
    },
    {
        path: '/profile',
        name: 'profile',
        meta: {
            requireAuth: true
        },
        component: () => import(/* webpackChunkName: "profile" */ '@/views/ProfileView.vue')
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            requireAuth: false
        },
        component: () => import(/* webpackChunkName: "login" */ '@/views/LoginView.vue')
    },
    {
        path: '/register',
        name: 'register',
        meta: {
            requireAuth: false
        },
        component: () => import(/* webpackChunkName: "login" */ '@/views/RegisterView.vue')
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth && !Vue.$cookies.isKey("username")) {
        next({ path: "/login" });
    } else {
        next();
    }
});

export default router;