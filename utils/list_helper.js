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

const mostBlogs =(blogs) => {
  var all=require('lodash')
  //lajitellaan authorit, sijoitetaan listalle
  var groupbyAuthor=all.groupBy(blogs.map(like => like.author),blogs.author)
  //selvitetään kuinka monta heillä on blogeja
  var mostBlogs=all.groupBy(groupbyAuthor, 'length')
  //tehdään listan avaimista ja arvoista ja valitaan ensimmäinen arvo, jossa on esiintymien määrä
  var authorsBlogs=all.toPairs(mostBlogs).map(p => parseInt(p[0]))
  //selvitetään mikä on maksimi listassa
  var maxauthorBlog=all.max(authorsBlogs)
  //valitaan authori, jolla on tämä key ja valitana ensimmäinen author listasta
  var author =mostBlogs[maxauthorBlog][0][0]
  //tehdään json
  var mostBlogsJson={ 'author': author, 'blogs': maxauthorBlog }
  return mostBlogsJson}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}