const jwtWebToken = require('jsonwebtoken')

module.exports = function (req, res, next) {
  const authorizationHeader = req.headers.authorization
  if (authorizationHeader) {
    const token = authorizationHeader.split(' ')[1]
    const decoded = jwtWebToken.decode(token)
    req.user = { id: decoded.id, username: decoded.username }
  }
  next()
}