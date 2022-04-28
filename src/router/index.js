import Vue from 'vue'
import VueRouter from 'vue-router'
import FlightScheduleView from '@/views/FlightScheduleView'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: FlightScheduleView
    },
    {
        path: '/watchlist',
        name: 'watchlist',
        // route level code-splitting
        // this generates a separate chunk (watchlist.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "watchlist" */ '@/views/WatchListView.vue')
    },
    {
        path: '/profile',
        name: 'profile',
        component: () => import(/* webpackChunkName: "profile" */ '@/views/ProfileView.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
