var all=require('lodash')

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
  //lajitellaan authorit, sijoitetaan listalle
  var groupbyAuthor=all.groupBy(blogs.map(like => like.author),blogs.author)
  //selvitetään kuinka monta heillä on esiintymiä
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


const mostLikes=(blogs => {
  //lajitellaan authorit, sijoitetaan listalle
  var groupbyAuthor=all.groupBy(blogs.map(like => like.author),blogs.author)
  //lista kaikista kirjailijoista, unique values
  var authors=all.toPairs(groupbyAuthor).map(p => p[0])

  var authorLikes=0
  //käydään läpi authorlistan
  for (let index = 0; index < authors.length; index++) {
    //katsotaan jokaista kirjailijaa kerrallaan
    var blog= blogs.filter(function(author){
      return author.author===authors[index]
    })
    //lasketaan kullekin kirjailijalle tykkäysten summan
    var summaLikes=all.sumBy(blog, function(o) { return o.likes })
    //jos summa on suurin niin tehdään json. Tässä tarvitaan luodaan turhaan monta kertaa json, mutta nyt tämä saa kelvata
    if(summaLikes>authorLikes){
    //tehdään json
      var mostLikesson={ 'author': blog[0].author, 'likes': summaLikes }
      authorLikes=summaLikes
    }
  }
  return mostLikesson
})


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}