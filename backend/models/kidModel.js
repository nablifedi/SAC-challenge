import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const kidSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  courses: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course'
      }
    }
  ],
  articles: [
    {
      article: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Article'
      }
    }
  ]
}, {
  timestamps: true
})

kidSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

kidSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const Kid = mongoose.model('Kid', kidSchema)

export default Kid