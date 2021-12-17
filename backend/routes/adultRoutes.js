import express from 'express'
import {protect, admin} from '../middleware/authMiddleware.js'
import {
  authAdult,
  registerAdult,
  getAdultProfile,
  updateAdultProfile,
  getAdults,
  deleteAdult,
  getAdultById,
  updateAdult,
  addCourse,
  addArticle
} from '../controllers/adultController.js'
const router = express.Router()

router.route('/').post(registerAdult).get(protect, admin, getAdults)
router.post('/login', authAdult)
router.route('/profile').get(protect, getAdultProfile).put(protect, updateAdultProfile)
router.route('/:id').delete(protect, admin, deleteAdult).get(protect, admin, getAdultById).put(protect, admin, updateAdult)
router.post('/:id/courses', protect, addCourse)
router.post('/:id/articled', protect, addArticle)

export default router