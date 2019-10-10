const multer = require('multer')
const accepted_extensions = ['jpg', 'png', 'jpeg'];
const conn = require('../config/database')
const bcrypt = require('bcrypt')

const upload_image = multer({ // upload gambar untuk user
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './assets/img/user/')
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname)
        }
    }),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
        files: 1 // 1 File
    },
    fileFilter: (req, file, cb) => {
        // if the file extension is in our accepted list
        if (accepted_extensions.some(ext => file.originalname.endsWith("." + ext))) {
            return cb(null, true);
        }

        // otherwise, return error
        return cb('error_allow_format_image');
    },
})

const avatarUpload = upload_image.single('photo')

// upload gambar user
exports.upload_image = (req, res) => {
    avatarUpload(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.json({ message: 'Gambar yang Anda masukkan sangat besar' })
            } else if (err === 'error_allow_format_image') {
                res.json({ message: 'Gambar harus format png, jpg, atau jpeg' })
            }
        } else {
            conn.query('UPDATE user SET photo = "' + req.file.filename + '" WHERE email = "' + req.decoded.email + '"', (err, success) => {
                if (err) throw err

                if (success) {
                    res.json({ message: 'Kamu berhasil mengupload gambar', success: true })
                }
            })
        }
    })
}

// ganti password
exports.change_pass = (req, res) => {
    const old_pass = req.body.old_pass // password lama
    const new_pass = req.body.new_pass // password baru
    const r_new_pass = req.body.r_new_pass // ulangi password baru

    conn.query('SELECT * FROM user WHERE email = "' + req.decoded.email + '"', (err, result) => {
        bcrypt.compare(old_pass, result[0].password, (error, response) => {
            if (error) throw error

            if (response) {
                if (new_pass !== r_new_pass) { // jika password baru tidak cocok dengan konfirmasi password
                    res.json({ message: 'Password baru tidak cocok dengan konfirmasi password' })
                } else { // jika berhasil mengubah password
                    bcrypt.hash(new_pass, 15, (err_pass, hash) => {
                        conn.query('UPDATE user SET password = "' + hash + '" WHERE email = "' + req.decoded.email + '"')
                        res.json({ message: 'Berhasil mengubah password' })
                    })
                }
            } else { // jika password lama tidak ada di database
                res.json({ message: 'Password lama tidak cocok !' })
            }
        })
    })
}

// profil user yang sedang login
exports.profil = (req, res) => {
    conn.query('SELECT * FROM user WHERE email = "' + req.decoded.email + '"', (err, result) => {
        if (err) throw err

        return res.json({ results: result })
    })
}