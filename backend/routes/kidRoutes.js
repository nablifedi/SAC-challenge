import express from 'express'
import protect from '../middleware/kidMiddleware.js'
import {protect as adult, admin} from '../middleware/authMiddleware.js'
import {
  authKid,
  registerKid,
  getKidProfile,
  updateKidProfile,
  getKids,
  deleteKid,
  getKidById,
  updateKid,
  addCourse,
  addArticle
} from '../controllers/kidController.js'
const router = express.Router()

router.route('/').post(registerKid).get(adult, admin, getKids)
router.post('/login', authKid)
router.route('/profile').get(protect, getKidProfile).put(protect, updateKidProfile)
router.route('/:id').delete(adult, admin, deleteKid).get(adult, admin, getKidById).put(adult, admin, updateKid)
router.post('/:id/courses', protect, addCourse)
router.post('/:id/articled', protect, addArticle)

export default router