const express = require('express')

const routes = express.Router()
const authController = require('../controllers/auth')


routes.post('/signup', authController.signup)

routes.post('/moreabout', authController.moreabout)

routes.post('/login', authController.login)


module.exports = routes