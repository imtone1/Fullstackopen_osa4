const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')


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
    const newBlog = {
      _id: '5a422a851b54a6762777',
      title: 'testi',
      author: 'testi testinen',
      url: 'https://reacttesti.com/',
      likes: 80,
      __v: 0
    }


    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd= await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    const contents=blogsAtEnd.map(b => b.title)
    expect(contents).toContain(
      'testi'
    )
  })

  test('likes has 0', async () => {
    const newBlog = {
      _id: '5a422a851b54a6762777',
      title: 'testi',
      author: 'testi testinen',
      url: 'https://reacttesti.com/',
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


})
afterAll(() => {
  mongoose.connection.close()
})