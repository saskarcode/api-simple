const express = require('express')
const router = express.Router()
const Product = require('../controllers/Product')
const middleware = require('../config/middleware')

router.get('/api/v1/list_product', middleware.checkToken, Product.list_product)
router.post('/api/v1/create_product', middleware.checkToken, Product.create_product)
router.put('/api/v1/update_product/:id_product', middleware.checkToken, Product.update_product)
router.delete('/api/v1/delete_product/:id_product', middleware.checkToken, Product.delete_product)
router.get('/api/v1/search_product/:nama_product', middleware.checkToken, Product.search_product)

module.exports = router