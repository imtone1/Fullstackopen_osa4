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

module.exports = {
  dummy,
  totalLikes
}