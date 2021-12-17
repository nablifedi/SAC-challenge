import express from 'express'
import {protect, admin} from '../middleware/authMiddleware.js'
import {
  getCourses,
  getCourseById,
  deleteCourse,
  createCourse,
  updateCourse,
  addCourseVideo,
  removeCourseVideo
} from '../controllers/courseController.js'
const router = express.Router()

router.route('/').get(getCourses).post(protect, admin, createCourse)
router.route('/:id').get(getCourseById).delete(protect, admin, deleteCourse).put(protect, admin, updateCourse)
router.route('/:id/article').post(protect, admin, addCourseVideo).delete(protect, admin, removeCourseVideo)

export default router