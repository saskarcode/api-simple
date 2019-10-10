const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const morgan = require('morgan')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'))
app.use('/public', express.static(__dirname + '/public'))

// make routers
app.use('/auth', require('./routes/auth'))
app.use('/user', require('./routes/user'))
app.use('/product', require('./routes/product'))

app.listen(8000);