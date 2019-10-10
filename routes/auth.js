const express = require('express')
const router = express.Router()
const Auth = require('../controllers/Auth')
const middleware = require('../config/middleware')

router.post('/api/v1/login', Auth.login)
router.post('/api/v1/register', Auth.register)

module.exports = router