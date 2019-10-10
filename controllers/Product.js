const conn = require('../config/database')
const multer = require('multer')
const accepted_extensions = ['jpg', 'png', 'jpeg'];

const image_product = multer({ // upload gambar untuk user
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './assets/img/product/')
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

const productImage = image_product.single('photo')

// daftar semua product
exports.list_product = (req, res) => {
    conn.query('SELECT * FROM product', (err, result) => {
        if (err) throw err

        if (result.length > 0) {
            return res.json({ results: result })
        } else {
            return res.json({ message: 'Belum ada daftar product' })
        }
    })
}

// buat data product
exports.create_product = (req, res) => {
    const nama = req.body.nama
    const harga = req.body.harga
    const jenis = req.body.jenis

    productImage(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                res.json({ message: 'Gambar yang Anda masukkan sangat besar' })
            } else if (err === 'error_allow_format_image') {
                res.json({ message: 'Gambar harus format png, jpg, atau jpeg' })
            }
        } else {
            conn.query('SELECT * FROM user WHERE email = "' + req.decoded.email + '"', (error, result) => {
                if (error) throw error

                conn.query('INSERT INTO product(nama, harga, jenis, photo, id_user) VALUES ("' + nama + '", "' + harga + '", "' + jenis + '", "' + req.file.filename + '", "' + result[0].id + '")', (err, success) => {
                    if (err) throw err

                    if (success) {
                        res.json({ message: 'Berhasil menambahkan product', success: true })
                    }
                })
            })
        }
    })
}

// edit product
exports.update_product = (req, res) => {
    const nama = req.body.nama
    const harga = req.body.harga
    const jenis = req.body.jenis
    const id_product = req.params.id_product

    conn.query('UPDATE product SET nama = "' + nama + '", harga = "' + harga + '", jenis = "' + jenis + '" WHERE id = "' + id_product + '"', (err, success) => {
        if (err) throw err

        if (success) {
            res.json({ message: 'Berhasil mengedit product' })
        }
    })
}

// hapus product
exports.delete_product = (req, res) => {
    conn.query('DELETE FROM product WHERE id = "' + req.params.id_product + '"', (err, success) => {
        if (err) throw err

        if (success) {
            return res.json({ message: 'Berhasil menghapus product' })
        }
    })
}

// mencari product
exports.search_product = (req, res) => {
    const nama = req.params.nama_product

    conn.query('SELECT * FROM product WHERE nama LIKE "%' + nama + '%" ', (err, result) => {
        if (err) throw err

        return res.json({ results: result })
    })
}