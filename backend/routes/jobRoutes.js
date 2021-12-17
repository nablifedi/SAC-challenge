import express from 'express'
import {protect, admin} from '../middleware/authMiddleware.js'
import {
  getJobs,
  getJobById,
  deleteJob,
  createJob,
  updateJob
} from '../controllers/jobController.js'
const router = express.Router()

router.route('/').get(getJobs).post(protect, admin, createJob)
router.route('/:id').get(getJobById).delete(protect, admin, deleteJob).put(protect, admin, updateJob)

export default router