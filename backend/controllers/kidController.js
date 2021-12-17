import asyncHandler from 'express-async-handler'
import Kid from '../models/kidModel.js'
import Course from '../models/courseModel.js'
import Article from '../models/articleModel.js'
import generateToken from '../utils/generateToken.js'

const authKid = asyncHandler(async (req, res) => {
  const {email, password} = req.body
  const kid = await Kid.findOne({email})
  if (kid && (await kid.matchPassword(password))) {
    res.json({
      _id: kid._id,
      email: kid.email,
      firstName: kid.firstName,
      lastName: kid.lastName,
      age: kid.age,
      gender: kid.gender,
      courses: kid.courses,
      articles: kid.articles,
      token: generateToken(kid._id)
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

const registerKid = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    age,
    gender
  } = req.body
  const kidExist = await Kid.findOne({email})
  if (kidExist) {
    res.status(400)
    throw new Error('Kid already exists')
  }
  const kid = await Kid.create({
    email,
    password,
    firstName,
    lastName,
    age,
    gender
  })
  if (kid) {
    res.status(201).json({
      _id: kid._id,
      email: kid.email,
      firstName: kid.firstName,
      lastName: kid.lastName,
      age: kid.age,
      gender: kid.gender,
      courses: kid.courses,
      articles: kid.articles,
      token: generateToken(kid._id)
    })
  } else {
    res.status(403)
    throw new Error('Invalid kid data')
  }
})

const updateKidProfile = asyncHandler(async (req, res) => {
  const kid = await Kid.findById(req.user._id)
  if (kid) {
    kid.email = req.body.email || kid.email
    kid.firstName = req.body.firstName || kid.firstName
    kid.lastName = req.body.lastName || kid.lastName
    kid.age = req.body.age || kid.age
    kid.gender = req.body.gender || kid.gender
    if (req.body.password) {
      kid.password =  req.body.password
    }
    const updatedKid = await kid.save()
    res.json({
      _id: updatedKid._id,
      email: updatedKid.email,
      firstName: updatedKid.firstName,
      lastName: updatedKid.lastName,
      age: updatedKid.age,
      gender: updatedKid.gender,
      courses: updatedKid.courses,
      articles: updatedKid.articles,
      token: generateToken(updatedKid._id)
    })
  } else {
    res.status(404)
    throw new Error('Kid not found')
  }
})

const getKids = asyncHandler(async (req, res) => {
  const pageSize = 12
  const page = Number(req.query.pageNumber)

  const keyword = req.query.keyword ? {
    lastName: {
      $regex: req.query.keyword,
      $options: 'i'
    }
  } : {}

  const count = await Kid.countDocuments({...keyword})
  const kids = await Kid.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1))

  res.json({
    kids,
    count,
    page,
    pages: Math.ceil(count / pageSize)
  })
})

const deleteKid = asyncHandler(async (req, res) => {
  const kid = await Kid.findById(req.params.id)
  if (kid) {
    await kid.remove()
    res.json({
      message: 'Kid removed!'
    })
  } else {
    res.status(404)
    throw new Error('Kid not found')
  }
})

const getKidById = asyncHandler(async (req, res) => {
  const kid = await Kid.findById(req.params.id).select('-password')
  if (kid) {
    res.json(kid)
  } else {
    res.status(404)
    throw new Error('Kid not found')
  }
})

const updateKid = asyncHandler(async (req, res) => {
  const kid = await Kid.findById(req.params.id)
  if (kid) {
    kid.firstName = req.body.firstName || kid.firstName
    kid.lastName = req.body.lastName || kid.lastName
    const updatedKid = await kid.save()
    res.json({
      _id: updatedKid._id,
      email: updatedKid.email,
      firstName: updatedKid.firstName,
      lastName: updatedKid.lastName,
      age: updatedKid.age,
      gender: updatedKid.gender,
      courses: updatedKid.courses,
      articles: updatedKid.articles
    })
  } else {
    res.status(404)
    throw new Error('Kid not found')
  }
})

const addCourse = asyncHandler(async (req, res) => {
  const {
    courseId,
    name
  } = req.body
  const kid = await Kid.findById(req.params.id)
  if (kid) {
    const alreadyExist = kid.courses.find(item => item.course.toString() === courseId.toString())
    if (alreadyExist) {
      res.status(400)
      throw new Error('Course already enrolled')
    }
    const course = await Course.findById(courseId)
    if (course) {
      const courseItem = {
        name,
        joinedDate: new Date(),
        course: courseId
      }
      kid.courses.push(courseItem)
      await kid.save()
      res.status(201).json({
        message: 'Enrolled to course'
      })
    } else {
      res.status(404)
      throw new Error('Course not found')
    }
  } else {
    res.status(404)
    throw new Error('Kid not found')
  }
})

const addArticle = asyncHandler(async (req, res) => {
  const {
    articleId,
    name
  }
  const kid = await Kid.findById(req.params.id)
  if (kid) {
    const alreadyExist = kid.articles.find(item => item.course.toString() === articleId.toString())
    if (alreadyExist) {
      res.status(400)
      throw new Error('Article already enrolled')
    }
    const article = await Article.findById(articleId)
    if (article) {
      const articleItem = {
        name,
        joinedDate: new Date(),
        article: articleId
      }
      kid.articles.push(articleItem)
      await kid.save()
      res.status(201).json({
        message: 'Enrolled to article'
      })
    } else {
      res.status(404)
      throw new Error('Article not found')
    }
  } else {
    res.status(404)
    throw new Error('Kid not found')
  }
})

export {
  authKid,
  registerKid,
  updateKidProfile,
  getKids,
  deleteKid,
  getKidById,
  updateKid,
  addCourse,
  addArticle
}