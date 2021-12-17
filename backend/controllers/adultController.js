import asyncHandler from 'express-async-handler'
import Adult from '../models/adultModel.js'
import Course from '../models/courseModel.js'
import Article from '../models/articleModel.js'
import generateToken from '../utils/generateToken.js'

const authAdult = asyncHandler(async (req, res) => {
  const {email, password} = req.body
  const adult = await Adult.findOne({email})
  if (adult && (await adult.matchPassword(password))) {
    res.json({
      _id: adult._id,
      email: adult.email,
      firstName: adult.firstName,
      lastName: adult.lastName,
      age: adult.age,
      gender: adult.gender,
      cin: adult.cin,
      address: adult.address,
      profession: adult.profession,
      phoneNumber: adult.phoneNumber,
      courses: adult.courses,
      articles: adult.articles,
      token: generateToken(adult._id)
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

const registerAdult = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    age,
    gender,
    cin,
    address,
    profession,
    phoneNumber
  } = req.body
  const AdultExist = await Adult.findOne({email})
  if (adultExist) {
    res.status(400)
    throw new Error('Adult already exists')
  }
  const adult = await Adult.create({
    email,
    password,
    firstName,
    lastName,
    age,
    gender,
    cin,
    address,
    profession,
    phoneNumber
  })
  if (Adult) {
    res.status(201).json({
      _id: adult._id,
      email: adult.email,
      firstName: adult.firstName,
      lastName: adult.lastName,
      age: adult.age,
      gender: adult.gender,
      cin: adult.cin,
      address: adult.address,
      profession: adult.profession,
      phoneNumber: adult.phoneNumber,
      courses: adult.courses,
      articles: adult.articles,
      token: generateToken(adult._id)
    })
  } else {
    res.status(403)
    throw new Error('Invalid Adult data')
  }
})

const updateAdultProfile = asyncHandler(async (req, res) => {
  const adult = await Adult.findById(req.user._id)
  if (Adult) {
    adult.email = req.body.email || adult.email
    adult.firstName = req.body.firstName || adult.firstName
    adult.lastName = req.body.lastName || adult.lastName
    adult.age = req.body.age || adult.age
    adult.gender = req.body.gender || adult.gender
    if (req.body.password) {
      adult.password =  req.body.password
    }
    const updatedAdult = await adult.save()
    res.json({
      _id: updatedAdult._id,
      email: updatedAdult.email,
      firstName: updatedAdult.firstName,
      lastName: updatedAdult.lastName,
      age: updatedAdult.age,
      gender: updatedAdult.gender,
      cin: updatedAdult.cin,
      address: updatedAdult.address,
      profession: updatedAdult.profession,
      phoneNumber: updatedAdult.phoneNumber,
      courses: updatedAdult.courses,
      articles: updatedAdult.articles,
      token: generateToken(updatedAdult._id)
    })
  } else {
    res.status(404)
    throw new Error('Adult not found')
  }
})

const getAdults = asyncHandler(async (req, res) => {
  const pageSize = 12
  const page = Number(req.query.pageNumber)

  const keyword = req.query.keyword ? {
    lastName: {
      $regex: req.query.keyword,
      $options: 'i'
    }
  } : {}

  const count = await Adult.countDocuments({...keyword})
  const adults = await Adult.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1))

  res.json({
    adults,
    count,
    page,
    pages: Math.ceil(count / pageSize)
  })
})

const deleteAdult = asyncHandler(async (req, res) => {
  const adult = await Adult.findById(req.params.id)
  if (adult) {
    await adult.remove()
    res.json({
      message: 'Adult removed!'
    })
  } else {
    res.status(404)
    throw new Error('Adult not found')
  }
})

const getAdultById = asyncHandler(async (req, res) => {
  const adult = await Adult.findById(req.params.id).select('-password')
  if (adult) {
    res.json(adult)
  } else {
    res.status(404)
    throw new Error('Adult not found')
  }
})

const updateAdult = asyncHandler(async (req, res) => {
  const adult = await Adult.findById(req.params.id)
  if (adult) {
    adult.firstName = req.body.firstName || adult.firstName
    adult.lastName = req.body.lastName || adult.lastName
    adult.isAdmin = req.body.isAdmin
    const updatedAdult = await adult.save()
    res.json({
      _id: updatedAdult._id,
      email: updatedAdult.email,
      firstName: updatedAdult.firstName,
      lastName: updatedAdult.lastName,
      age: updatedAdult.age,
      gender: updatedAdult.gender,
      cin: updatedAdult.cin,
      address: updatedAdult.address,
      profession: updatedAdult.profession,
      phoneNumber: updatedAdult.phoneNumber,
      courses: updatedAdult.courses,
      articles: updatedAdult.articles
    })
  } else {
    res.status(404)
    throw new Error('Adult not found')
  }
})

const addCourse = asyncHandler(async (req, res) => {
  const {
    courseId,
    name
  } = req.body
  const adult = await Adult.findById(req.params.id)
  if (adult) {
    const alreadyExist = adult.courses.find(item => item.course.toString() === courseId.toString())
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
      adult.courses.push(courseItem)
      await adult.save()
      res.status(201).json({
        message: 'Enrolled to course'
      })
    } else {
      res.status(404)
      throw new Error('Course not found')
    }
  } else {
    res.status(404)
    throw new Error('Adult not found')
  }
})

const addArticle = asyncHandler(async (req, res) => {
  const {
    articleId,
    name
  }
  const adult = await Adult.findById(req.params.id)
  if (adult) {
    const alreadyExist = adult.articles.find(item => item.course.toString() === articleId.toString())
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
      adult.articles.push(articleItem)
      await adult.save()
      res.status(201).json({
        message: 'Enrolled to article'
      })
    } else {
      res.status(404)
      throw new Error('Article not found')
    }
  } else {
    res.status(404)
    throw new Error('Adult not found')
  }
})

export {
  authAdult,
  registerAdult,
  updateAdultProfile,
  getAdults,
  deleteAdult,
  getAdultById,
  updateAdult,
  addCourse,
  addArticle
}