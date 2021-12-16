import mongoose from 'mongoose'

const courseSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  instructorName: {
    type: String,
    required: required
  },
  videos: [
    {
      video: {
        type: String,
        required: true
      }
    }
  ],
  watchTime: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
})

const Course = mongoose.model('Course', courseSchema)

export default Course