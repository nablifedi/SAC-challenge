import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import {notFound, errorHandler} from './middleware/errorMiddleware.js'
import kidRoutes from './routes/kidRoutes.js'
import adultRoutes from './routes/adultRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import articleRoutes from './routes/articleRoutes.js'
import courseRoutes from './routes/courseRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import videoUploadRoutes from './routes/videoUploadRoutes.js'
import articleUploadRoutes from './routes/articleUploadRoutes.js'

dotenv.config()
const app = express()
app.use(express.json())

app.use('/api/kids', kidRoutes)
app.use('/api/adults', adultRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/articles', articleRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/video', videoUploadRoutes)
app.use('/api/article', articleUploadRoutes)

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))
app.use('/videos', express.static(path.join(__dirname, '/videos')))
app.use('/articles', express.static(path.join(__dirname, '/articles')))

app.get('/', (req, res) => {
  res.send('API is running')
})

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))