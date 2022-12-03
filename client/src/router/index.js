import Vue from 'vue'
import Router from 'vue-router'

import Main from '../views/Main'
import Projects from '../views/Projects'
import Testimonials from '../views/Testimonials'
import WriteTestimonial from '../views/WriteTestimonial'
import Admin from '../views/Admin'
import Unauthorized from '../views/Unauthorized'
import NotFound from '../views/NotFound'

Vue.use(Router)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Main
    },
    {
        path: '/projects',
        name: 'Projects',
        component: Projects
    },
    {
        path: '/testimonials',
        name: 'Testimonials',
        component: Testimonials
    },
    {
        path: '/testimonial/:token',
        name: 'Write a testimonial',
        component: WriteTestimonial
    },
    {
        path: '/admin',
        name: 'Admin',
        component: Admin
    },
    {
        path: '/unauthorized',
        name: 'Unauthorized',
        component: Unauthorized
    },
    {
        path: '*',
        name: 'Not found',
        component: NotFound
    }
]

const router = new Router({
    mode: 'history',
    routes: routes
})

router.beforeEach((to, from, next) => {
    document.title = `WSD - ${to.name}`
    next()
})

export default router