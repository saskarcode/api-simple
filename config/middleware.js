let jwt = require('jsonwebtoken')
const setting = require('../config/setting')

let checkToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

    if (token) {
        if (token.startsWith('Bearer ')) {
            // remove Bearer from string
            token = token.slice(7, token.length)
        }

        jwt.verify(token, setting.secret, (err, decoded) => {
            if (err) { // jika error
                return res.json({
                    success: false,
                    message: 'Token is not valid'
                })
            } else { // jika berhasil
                req.decoded = decoded
                next()
            }
        })
    } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        })
    }
}

module.exports = {
    checkToken: checkToken
}