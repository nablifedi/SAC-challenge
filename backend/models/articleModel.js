import mongoose from 'mongoose'

const articleSchema = mongoose.Schema({
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
    required: true
  },
  articles: [
    {
      article: {
        type: String,
        required: true
      },
      name: {
        tyep: String,
        required: true
      }
    }
  ],
  readingTime: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
})

const Article = mongoose.model('Article', articleSchema)

export default Article