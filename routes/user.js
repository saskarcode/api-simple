const express = require('express')
const router = express.Router()
const User = require('../controllers/User')
const middleware = require('../config/middleware')

router.post('/api/v1/upload_image', middleware.checkToken, User.upload_image)
router.put('/api/v1/change_pass', middleware.checkToken, User.change_pass)
router.get('/api/v1/profil', middleware.checkToken, User.profil)

module.exports = router