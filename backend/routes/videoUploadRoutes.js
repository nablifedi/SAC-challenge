import path from 'path'
import express from 'express'
import multer from 'multer'
const router = express.Router()

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'videos/')
  },
  filename(req, file, cb) {
    cb(null, `${file.filename}${path.extname(file.originalname)}`)
  }
})

function checkFileType(file, cb) {
  const filetypes = /mp4|webm|ogg/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)
  if (extname && mimetype) {
    cb(null, true)
  } else {
    cb('Videos only!')
  }
}

const upload = multer({
  storage,
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb)
  }
})

router.post('/', upload.single('video'), (req, res) => {
  res.send(`/${req.file.path}`)
})

export default router