const express = require('express')
const app = express()
const config = require('config')
const jwt = require('express-jwt')
const exampleRoutes = require('./router/example')
const userRoutes = require('./router/user')
const protectedRoutes = require('./router/protected')
const PORT = 3001

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/api', exampleRoutes)
app.use('/api', userRoutes)
app.use('/api', jwt({ secret: config.get('secret') }), protectedRoutes)

app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') { 
    return(res.status(401).send({message: 'Invalid authorization token'}));
  }
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})