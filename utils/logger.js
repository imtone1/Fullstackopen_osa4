const info = (...params) => {
  if (process.env.NODE.ENV !== 'test'){
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE.ENV !== 'test'){
    console.error(...params)
  }
}

module.exports = {
  info, error
}