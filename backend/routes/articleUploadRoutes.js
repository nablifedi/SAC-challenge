import path from 'path'
import express from 'express'
import multer from 'multer'
const router = express.Router()

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'articles/')
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${file.filename}${path.extname(file.originalname)}`)
  }
})

function checkFileType(file, cb) {
  const filetypes = /txt/
  const extname = filetypes.test(path.extname(file.originalname))
  const mimetype = filetypes.test(file.mimetype)
  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb('Text files only!')
  }
}

const upload = multer({
  storage,
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb)
  }
})

router.post('/', upload.single('article'), (req, res) => {
  res.send(`/${req.file.path}`)
})

export default router