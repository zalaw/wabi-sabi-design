const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')

const Message = require('../models/Message')
const Project = require('../models/Project')
const Testimonial = require('../models/Testimonial')

router.get('/logged-in', (req, res) => {
    try {
        const token = req.cookies.token

        if (token === undefined) return res.send({ isError: false, loggedIn: false })
        if (jwt.verify(token, process.env.JWT_SECRET)) return res.send({ isError: false, loggedIn: true })
    } catch (err) {
        res.status(202).send({ isError: true, message: 'Token expired' })
    }
})

router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find({}).sort({ createdAt: -1 })

        res.send({ projects })
    } catch (err) {
        res.send('eruare')
    }
})

router.post('/send-message', async (req, res) => {
    try {
        const message = req.body

        const newMessage = new Message(message)
        await newMessage.save()

        res.send({ isError: false, message: 'We received your message\nWe will contact you soon' })
    } catch (err) {
        res.status(500).send({ isError: true, message: err })
    }
})

router.get('/testimonials', async (req, res) => {
    try {
        const testimonials = await Testimonial.find({}).sort({ createdAt: -1 })
        res.send({ isError: false, testimonials: testimonials })
    } catch (err) {
        res.status(500).send({ isError: true, error: err })
    }
})

router.get('/check-testimonial-token', async (req, res) => {
    try {
        jwt.verify(req.query.token, process.env.JWT_SECRET)

        if (await Testimonial.findOne({ token: req.query.token })) throw 'Already submitted'

        res.send({ isError: false, message: 'Ok' })
    } catch (err) {
        var error = err

        if (err != 'Already submitted') {
            error = 'Oops. Looks like this link is not valid anymore'
        }

        res.status(500).send({ isError: true, error: error })
    }
})

router.post('/post-testimonial', async (req, res) => {
    try {
        jwt.verify(req.body.token, process.env.JWT_SECRET)

        if (await Testimonial.findOne({ token: req.body.token })) throw 'Already submitted'

        const newTestimonial = new Testimonial(req.body)
        await newTestimonial.save()

        res.send({ isError: false, message: 'Submitted successfully', additionalMessage: 'We received your testimonial. Thank you!' })
    } catch (err) {
        if (err == 'Already submitted') return res.status(500).send({ isError: true, error: err })
        res.status(500).send({ isError: true, error: err.message })
    }
})

module.exports = router