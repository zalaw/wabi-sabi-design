const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    images: [{
        type: String,
        trim: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Project = mongoose.model('project', ProjectSchema)

module.exports = Project