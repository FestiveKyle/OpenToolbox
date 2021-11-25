const express = require('express')
const app = express()
const PORT = process.env.FRONTEND_PORT || 3000

app.use(express.static('build'))

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`))
