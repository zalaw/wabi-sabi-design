const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        maxlength: 64,
        trim: true
    },
    message: {
        type: String,
        required: true,
        maxlength: 200,
        trim: true
    },
    seen: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Message = mongoose.model('message', MessageSchema)

module.exports = Message