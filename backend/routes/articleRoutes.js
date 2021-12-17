import express from 'express'
import {protect, admin} from '../middleware/authMiddleware.js'
import {
  getArticles,
  getArticleById,
  deleteArticle,
  createArticle,
  updateArticle,
  addArticleFile,
  removeArticleFile
} from '../controllers/articleController.js'
const router = express.Router()

router.route('/').get(getArticles).post(protect, admin, createArticle)
router.route('/:id').get(getArticleById).delete(protect, admin, deleteArticle).put(protect, admin, updateArticle)
router.route('/:id/article').post(protect, admin, addArticleFile).delete(protect, admin, removeArticleFile)

export default router