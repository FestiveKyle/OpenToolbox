const express = require('express')
const app = express()
const path = require('path')

const PORT = process.env.FRONTEND_SERVER_PORT || 3000

function redirectWwwTraffic(req, res, next) {
  console.log('req:', req)
  if (req.headers.host.slice(0, 4) === 'www.') {
    const newHost = req.headers.host.slice(4)
    return res.redirect(301, 'https://' + newHost + req.originalUrl)
  }
  next()
}
app.use(redirectWwwTraffic)

app.use(express.static('build'))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
})

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`))
