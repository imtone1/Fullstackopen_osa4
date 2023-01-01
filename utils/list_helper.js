const dummy = (blogs) => {
  blogs = 1
  return blogs
}

const totalLikes= (blogs) => {
  var likes= blogs.filter(function(blog){
    return blog.likes
  })

  return blogs.length===0
    ? NaN
    :likes.map(like => like.likes).reduce((acc, amount) => acc + amount)
}

const favoriteBlog =(blogs) => {
  var collection = require('lodash/math')
  //   var favorite=collection.groupBy(blogs,blogs.likes)
  var favorite= collection.maxBy(blogs,function(o){return o.likes})
  //   var likes= blogs.filter(function(blog){
  //     return blog.likes===favorite
  //   })

  return blogs.length===0
    ? NaN
    :JSON.parse(JSON.stringify(favorite, ['author', 'likes', 'title']))
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}