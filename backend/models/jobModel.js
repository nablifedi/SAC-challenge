import mongoose from 'mongoose'

const jobSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  place: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

const Job = mongoose.model('Job', jobSchema)

export default Job