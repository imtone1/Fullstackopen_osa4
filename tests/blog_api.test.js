const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
// const tokenExtractor = require('../utils/middleware')


beforeEach(async () => {
  await Blog.deleteMany({})
  //jos promissit rinnakkain
  // const blogObjects =helper.initialBlogs
  //   .map(blog => new Blog(blog))
  // const promiseArray=blogObjects.map(blog => blog.save())
  // await Promise.all(promiseArray)

  //promissit peräkkäin
  await Blog.insertMany(helper.initialBlogs)
})
describe('blogs api', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('the first blog is about React patterns', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].title).toBe('React patterns')
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)

    expect(titles).toContain(
      'Go To Statement Considered Harmful'
    )
  })

  test('id is defined', async () => {
    const response = await api.get('/api/blogs')

    const allblogs = response.body.map(r => r.id)
    expect(allblogs).toBeDefined()

  })
})

describe('blogs post', () => {
  test('post is a go', async () => {
    // const user= await helper.usersInDb()
    // const newBlog = {
    //   _id: '5a422a851b54a6762777',
    //   title: 'testi',
    //   author: 'testi testinen',
    //   url: 'https://reacttesti.com/',
    //   likes: 80,
    //   userId: user[0].id,
    //   __v: 0
    // }

    const userKirj={
      username: 'root',
      password : 'salainen'
    }
    await api
      .post('/api/login')
      .send(userKirj)
      .expect(201)
      .expect('Content-Type', /application\/json/)





    // await api
    //   .post('/api/blogs')
    //   .send(newBlog)
    //   .expect(201)
    //   .expect('Content-Type', /application\/json/)

    // const blogsAtEnd= await helper.blogsInDb()
    // expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    // const contents=blogsAtEnd.map(b => b.title)
    // expect(contents).toContain(
    //   'testi'
    // )
  })

  test('likes has 0', async () => {
    const user= await helper.usersInDb()
    const newBlog = {
      _id: '5a422a851b54a6762777',
      title: 'testi',
      author: 'testi testinen',
      url: 'https://reacttesti.com/',
      userId: user[0].id,
      __v: 0
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd= await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    const contents=blogsAtEnd.map(b => b.likes)
    expect(contents).toContain(
      0
    )

  })

  test('title and url must be, 400', async () => {
    const user= await helper.usersInDb()
    const newBlog = {
      _id: '5a422a851b54a6762777',
      author: 'testi testinen',
      likes: 3,
      userId: user[0].id,
      __v: 0
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd= await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const contents = blogsAtEnd.map(r => r.title)

    expect(contents).not.toContain(blogToDelete.title)
  })
})

describe('edit of a blog', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToEdit = blogsAtStart[0]
    const newBlogLikes = {
      likes: 2222
    }

    await api
      .put(`/api/blogs/${blogToEdit.id}`)
      .send(newBlogLikes)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length
    )

    const contents = blogsAtEnd.map(r => r.title)

    expect(contents).toContain(blogToEdit.title)
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'imtone',
      name: 'Matti Testinen',
      password: 'verysalainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  test('creation fails with proper statuscode and message if username or password empty', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root222',
      name: '2Superuser'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username or password can\'t be empty')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('login', async () => {
    const userKirj={
      username: 'root',
      password : 'salainen'
    }
    await api
      .post('/api/login')
      .send(userKirj)
      .expect(201)
      .expect('Content-Type', /application\/json/)


  })

  // test('login auth', async () => {

  //   const userKirj={
  //     username: 'root',
  //     password : 'salainen'
  //   }

  //   await api
  //     .post('/api/blogs', tokenExtractor.tokenExtractor, (req,res) => {} )
  //     .expect(201)
  //     .expect('Content-Type', /application\/json/)
  // })
})

afterAll(() => {
  mongoose.connection.close()
})