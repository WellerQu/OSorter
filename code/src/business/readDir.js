const fs = require('fs')

export default (path = '/Users/qiuwei/Movies') => 
  new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) return reject(err)
      console.log(files)
      resolve(files)
    })
  })

