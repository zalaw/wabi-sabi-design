const jwt = require('jsonwebtoken')

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.token

        if (token === undefined) throw 'Invalid JWT'

        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user
        
        next()
    } catch (err) {
        res.clearCookie('token')
        res.status(401).send({ error: err })
    }
}

module.exports = isAuthenticated