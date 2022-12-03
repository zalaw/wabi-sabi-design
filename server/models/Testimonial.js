const mongoose = require('mongoose')

const TestimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    body: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Testimonial = mongoose.model('testimonial', TestimonialSchema)

module.exports = Testimonial