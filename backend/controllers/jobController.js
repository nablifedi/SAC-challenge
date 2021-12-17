import asyncHandler from 'express-async-handler'
import Job from '../models/jobModel.js'

const getJobs = asyncHandler(async (req, res) => {
  const pageSize = 12
  const page = Number(req.query.pageNumber)

  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: 'i'
    }
  } : {}

  const count = await Job.countDocuments({...keyword})
  const jobs = await Job.find({...keyword}).sort({_id: -1}).limit(pageSize).skip(pageSize * (page - 1))

  res.json({
    jobs,
    count,
    page,
    pages: Math.ceil(count / pageSize)
  })
})

const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
  if (job) {
    res.json(job)
  } else {
    res.status(404)
    throw new Error('Job not found')
  }
})

const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
  if (job) {
    await job.remove()
    res.json({
      message: 'Job removed!'
    })
  } else {
    res.status(404)
    throw new Error('Job not found')
  }
})

const createJob = asyncHandler(async (req, res) => {
  const {
    name,
    type,
    companyName,
    status,
    place
  } = req.body
  const job = new Job({
    name,
    type,
    companyName,
    status,
    place
  })
  if (job) {
    res.json(job)
  } else {
    res.status(400)
    throw new Error('Invalid data')
  }
})

const updateJob = asyncHandler(async (req, res) => {
  const {
    name,
    type,
    companyName,
    status,
    place
  } = req.body
  const job = await Job.findById(req.params.id)
  if (job) {
    job.name = name
    job.type = type
    job.companyName = companyName
    job.status = status
    job.place = place
    const updatedJob = await job.save()
    res.json(updatedJob)
  } else {
    res.status(404)
    throw new Error('Job not found')
  }
})

export {
  getJobs,
  getJobById,
  deleteJob,
  createJob,
  updateJob
}