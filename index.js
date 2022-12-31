const http = require('http')
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const { url } = require('inspector')
//for mongoose 7
mongoose.set('strictQuery', false)
app.use(cors())
app.use(express.json())


const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)
.then(
    console.log('connected to MongoDB')
  )
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })
const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Blog = mongoose.model('Blog', blogSchema)

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
    const body = request.body
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.number
  })

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})