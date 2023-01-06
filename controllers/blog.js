const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const tokenExtractor = require('../utils/middleware')
const jwt = require('jsonwebtoken')
// const { result } = require('lodash')

blogsRouter.get('/', async (request, response) => {
  const blogs= await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)

})

blogsRouter.get('/:id', async (request, response) => {
  const blog=await Blog.findById(request.params.id)

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     return authorization.substring(7)
//   }
//   return null
// }

blogsRouter.post('/', tokenExtractor.tokenExtractor, async (request, response) => {
  const body = request.body
  // //token handler
  // const token = getTokenFrom(request)
  // //decodedToken olion sisällä on username ja id
  // const decodedToken = jwt.verify(token, process.env.SECRET)
  // if (!token || !decodedToken.id){
  //   return response.status(401).json({ error: 'token missing or invalid' })
  // }
  // console.log('tokeni ilman middleware', decodedToken )
  // console.log('tokeni', request.userId)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id){
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const blog = new Blog({
    title: body.title,
    author: user.name,
    url: body.url,
    likes: body.likes,
    userId: user._id
  })
  if (body.title && body.url)
  {
    const savedBlog= await blog.save()
    //tallennetaan user olioon blog kenttään tallennetaan id tieto
    user.blogs =user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  }else
  {
    response.status(400).end()
  }

})

blogsRouter.delete('/:id',tokenExtractor.tokenExtractor, async (request, response) => {
  //verifioidaan token
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!request.token || !decodedToken.id){
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  //etsitään käyttäjä tokenin tiedoilla
  const user = await User.findById(decodedToken.id)

  // await Blog
  //   .find({}).populate('user', { id:1 })
  //etsitään blogi
  // const blog = await Blog.findById(request.params.id)
  console.log('user id', user.id)
  console.log('user blog ', user.blogs)
  console.log('tokeni', decodedToken.id)
  console.log('user blog', request.params.id)
  // console.log('blogi user', blog)
  // console.log('stringi blog user id' , JSON.stringify(blog.id))
  console.log('stringi user id ', JSON.stringify(user.id))
  console.log('stringi user.blogs ', JSON.stringify(user.blogs) )
  if( JSON.stringify(user.blogs).includes(request.params.id)){
    //poistetaan blogi
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }else{
    response.status(401).json({ error: 'it\'s not your blog' })
  }

})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog= await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter