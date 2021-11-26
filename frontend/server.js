const express = require('express')
const app = express()
const path = require('path')

const PORT = process.env.FRONTEND_PORT || 3000

app.use(express.static('build'))

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
// })

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`))
