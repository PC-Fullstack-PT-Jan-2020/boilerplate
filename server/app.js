const express = require('express')
const app = express()
const exampleRoutes = require('./router/example')
const userRoutes = require('./router/user')
const PORT = 3001

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/api', exampleRoutes)
app.use('/api', userRoutes)

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})