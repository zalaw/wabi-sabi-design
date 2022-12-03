const aws = require('aws-sdk')

const initAWS = async () => {
    aws.config.update({
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY
    })
}

module.exports = initAWS