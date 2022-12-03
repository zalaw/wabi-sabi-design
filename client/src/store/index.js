import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        loggedIn: false,
        showLoginModal: false,
        notification: {
            isError: false,
            text: ''
        },
        projects: []
        // projects: [
        //     {
        //         _id: 'TE09ufaD',
        //         title: 'Tension of desire and beyond that letsdafawssdawda',
        //         images: [
        //             require('@/assets/img/projects/p1.jpg'),
        //             require('@/assets/img/projects/p2.jpg'),
        //             require('@/assets/img/projects/p3.jpg'),
        //             require('@/assets/img/projects/p4.jpg'),
        //         ]
        //     },
        //     {
        //         _id: 'EX09ufaD',
        //         title: 'Exaled eternity',
        //         images: [
        //             require('@/assets/img/projects/p1.jpg'),
        //             require('@/assets/img/projects/p4.jpg'),
        //             require('@/assets/img/projects/p2.jpg'),
        //         ]
        //     },
        //     {
        //         _id: 'DI09ufaD',
        //         title: 'Dining room moodboard',
        //         images: [
        //             require('@/assets/img/projects/p1.jpg'),
        //             require('@/assets/img/projects/p4.jpg')
        //         ]
        //     },
        //     {
        //         _id: 'EM09ufaD',
        //         title: 'Emergency relaxation',
        //         images: [
        //             require('@/assets/img/projects/p3.jpg'),
        //             require('@/assets/img/projects/p2.jpg'),
        //             require('@/assets/img/projects/p1.jpg')
        //         ]
        //     }
        // ]
    },
    mutations: {
        setLoggedIn: (state, payload) => {
            state.loggedIn = payload
        },
        setProjects: (state, payload) => {
            state.projects = payload
        },
        setShowLoginModal: (state, payload) => {
            state.showLoginModal = payload
        },
        setNotification: (state, payload) => {
            state.notification.isError = payload.isError
            state.notification.text = payload.text
        },
        addProject: (state, payload) => { 
            state.projects.unshift(payload)
        },
        updateProject: (state, payload) => {
            console.log(payload)
            const project = state.projects.find(project => project._id == payload._id)
            project.title = payload.title
            project.images = payload.images
        },
        deleteProject: (state, payload) => {
            const index = state.projects.map(project => project._id).indexOf(payload)
            state.projects.splice(index, 1)
        },
        deleteImages: (state, payload) => {
            const project = state.projects.find(project => project._id == payload._id)
            project.images = project.images.filter(image => !payload.images.includes(image))
        }
    },
    actions: {
        setLoggedIn: (context, payload) => {
            context.commit('setLoggedIn', payload)
        },
        setProjects: (context, payload) => {
            context.commit('setProjects', payload)
        },
        setShowLoginModal: (context, payload) => {
            context.commit('setShowLoginModal', payload)
        },
        setNotification: (context, payload) => {
            context.commit('setNotification', payload)
        },
        addProject: (context, payload) => {
            context.commit('addProject', payload)
        },
        updateProject: (context, payload) => {
            context.commit('updateProject', payload)
        },
        deleteProject: (context, payload) => {
            context.commit('deleteProject', payload)
        },
        deleteImages: (context, payload) => {
            context.commit('deleteImages', payload)
        }
    },
    getters: {
        getLoggedIn: state => state.loggedIn,
        getShowLoginModal: state => state.showLoginModal,
        getNotification: state => state.notification,
        getProjects: state => state.projects
    }
})