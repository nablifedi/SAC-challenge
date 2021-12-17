import asyncHandler from 'express-async-handler'
import Course from '../models/courseModel.js'

const getCourses = asyncHandler(async (req, res) => {
  const pageSize = 12
  const page = Number(req.query.pageNumber)

  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: 'i'
    }
  } : {}

  const count = await Course.countDocuments({...keyword})
  const courses = await Course.find({...keyword}).sort({_id: -1}).limit(pageSize).skip(pageSize * (page - 1))

  res.json({
    courses,
    count,
    page,
    pages: Math.ceil(count / pageSize)
  })
})

const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
  if (course) {
    res.json(course)
  } else {
    res.status(404)
    throw new Error('Course not found')
  }
})

const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
  if (course) {
    await course.remove()
    res.json({
      message: 'Course removed!'
    })
  } else {
    res.status(404)
    throw new Error('Course not found')
  }
})

const createCourse = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    description,
    instructorName,
    watchTime
  } = req.body
  const course = new Course({
    name,
    category,
    description,
    instructorName,
    watchTime
  })
  if (course) {
    res.json(course)
  } else {
    res.status(400)
    throw new Error('Invalid data')
  }
})

const updateCourse = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    description,
    instructorName,
    watchTime
  }
  const course = await Course.findById(req.params.id)
  if (course) {
    course.name = name
    course.category = category
    course.description = description
    course.instructorName = instructorName
    course.watchTime = watchTime
    const updatedCourse = await course.save()
    res.json(updatedCourse)
  } else {
    res.status(404)
    throw new Error('Course not found')
  }
})

const addCourseVideo = asyncHandler(async (req, res) => {
  const {
    videoPath,
    name
  }
  const course = await Course.findById(req.params.id)
  if (course) {
    const videoItem = {
      name,
      video: videoPath
    }
    course.videos.push(videoItem)
    await course.save()
    res.status(201).json({
      message: 'Course added'
    })
  } else {
    res.status(404)
    throw new Error('Course not found')
  }
})

const removeCourseVideo = asyncHandler(async (req, res) => {
  const {
    videoId
  } = req.body
  const course = await Course.findById(req.params.id)
  if (course) {
    const courseVideo = course.videos.find(item => item._id.toString() === videoId.toString())
    if (courseVideo) {
      course.videos.pull({_id: videoId})
      await course.save()
      res.status(201).json({
        message: 'Video removed'
      })
    } else {
      res.status(404)
      throw new Error('Course Video not found')
    }
  } else {
    res.status(404)
    throw new Error('Course not found')
  }
})

export {
  getCourses,
  getCourseById,
  deleteCourse,
  createCourse,
  updateCourse,
  addCourseVideo,
  removeCourseVideo
}