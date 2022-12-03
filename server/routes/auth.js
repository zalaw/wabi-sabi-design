const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const router = express.Router()

router.post('/login', async (req, res) => {
    try {
        console.log(req.isLoggedIn)
        
        const user = await User.findOne({})

        if (!await user.isPasswordValid(req.body.password)) throw "Invalid password"

        const token = jwt.sign({ user: 'admin' }, process.env.JWT_SECRET, { expiresIn: (60 * 60) }) // 1 hour

        res.cookie('token', token, { httpOnly: true })
        res.send({ isError: false, message: 'Successfully logged in' }) 

    } catch (err) {
        console.log(err)
        res.status(404).send({ isError: true, message: err })
    }
})

// router.post('/register', async (req, res) => {
//     try {
//         const user = new User(req.body)
//         await user.save()

//         res.send('Created!')
//     } catch (err) {
//         res.status(500).send({ error: err })
//     }
// })

router.get('/logout', async (req, res) => {
    try {
        res.clearCookie('token')
        res.send({ message: 'Successfully logged out' })
    } catch (err) {
        res.status(500).send({ error: err })
    }
})

module.exports = router