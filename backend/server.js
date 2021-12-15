import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import {notFound, errorHandler} from './middleware/errorMiddleware.js'

dotenv.config()
const app = express()
app.use(express.json())

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))
app.use('/videos', express.static(path.join(__dirname, '/videos')))

app.get('/', (req, res) => {
  res.send('API is running')
})

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))