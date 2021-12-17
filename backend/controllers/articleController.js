import asyncHandler from 'express-async-handler'
import Article from '../models/articleModel.js'

const getArticles = asyncHandler(async (req, res) => {
  const pageSize = 12
  const page = Number(req.query.pageNumber)

  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: 'i'
    }
  } : {}

  const count = await Article.countDocuments({...keyword})
  const articles = await Article.find({...keyword}).sort({_id: -1}).limit(pageSize).skip(pageSize * (page - 1))

  res.json({
    articles,
    count,
    page,
    pages: Math.ceil(count / pageSize)
  })
})

const getArticleById = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id)
  if (article) {
    res.json(article)
  } else {
    res.status(404)
    throw new Error('Article not found')
  }
})

const deleteArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id)
  if (article) {
    await article.remove()
    res.json({
      message: 'Article removed!'
    })
  } else {
    res.status(404)
    throw new Error('Article not found')
  }
})

const createArticle = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    description,
    instructorName,
    readingTime
  } = req.body
  const article = new Article({
    name,
    category,
    description,
    instructorName,
    readingTime
  })
  if (article) {
    res.json(article)
  } else {
    res.status(400)
    throw new Error('Invalid data')
  }
})

const updateArticle = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    description,
    instructorName,
    readingTime
  }
  const article = await Article.findById(req.params.id)
  if (article) {
    article.name = name
    article.category = category
    article.description = description
    article.instructorName = instructorName
    article.readingTime = readingTime
    const updatedArticle = await article.save()
    res.json(updatedArticle)
  } else {
    res.status(404)
    throw new Error('Article not found')
  }
})

const addArticleFile = asyncHandler(async (req, res) => {
  const {
    articlePath,
    name
  }
  const article = await Article.findById(req.params.id)
  if (article) {
    const articleItem = {
      name,
      article: articlePath
    }
    article.articles.push(articleItem)
    await article.save()
    res.status(201).json({
      message: 'Article added'
    })
  } else {
    res.status(404)
    throw new Error('Article not found')
  }
})

const removeArticleFile = asyncHandler(async (req, res) => {
  const {
    articleId
  } = req.body
  const article = await Article.findById(req.params.id)
  if (article) {
    const articleFile = article.articles.find(item => item._id.toString() === articleId.toString())
    if (articleFile) {
      article.articles.pull({_id: articleId})
      await article.save()
      res.status(201).json({
        message: 'File removed'
      })
    } else {
      res.status(404)
      throw new Error('Article file not found')
    }
  } else {
    res.status(404)
    throw new Error('Article not found')
  }
})

export {
  getArticles,
  getArticleById,
  deleteArticle,
  createArticle,
  updateArticle,
  addArticleFile,
  removeArticleFile
}