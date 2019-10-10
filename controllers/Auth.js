let jwt = require('jsonwebtoken')
let setting = require('../config/setting')
const conn = require('../config/database')
const bcrypt = require('bcrypt')

// ini untuk login
exports.login = function (req, res) {
    const email = req.body.email
    const password = req.body.password

    const token = jwt.sign({ email: email }, setting.secret, { expiresIn: '7h' })

    conn.query('SELECT * FROM user WHERE email = "' + email + '"', (err, result) => {
        if (err) throw err

        if (result.length < 1) {
            res.json({ message: 'Email salah !', success: false })
        } else {
            bcrypt.compare(password, result[0].password, (error, response) => {
                if (response) {
                    res.json({ message: 'Anda berhasil login', success: true, token: token })
                } else {
                    res.json({ message: 'Password salah !', success: false })
                }
            })
        }
    })
}

exports.register = (req, res) => {
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const email = req.body.email
    const password = req.body.password

    conn.query('SELECT email FROM user WHERE email = "' + email + '"', (error, cek) => {
        if (cek.length > 0) {
            res.json({ message: 'Email sudah digunakan' })
        } else {
            bcrypt.hash(password, 15, function (err_pass, hash) {
                conn.query('INSERT INTO user(firstname, lastname, email, password) VALUES("' + firstname + '", "' + lastname + '", "' + email + '", "' + hash + '")', function (err, result) {
                    if (err) throw err;

                    res.json({
                        message: "Anda berhasil mendaftar"
                    })
                })
            });

        }
    })
}