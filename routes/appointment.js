const express = require('express')

const routes = express.Router()
const appointmentController = require('../controllers/appointment')
const isAuth = require('../middleware/is-auth')



routes.post('/createAppointment', isAuth, appointmentController.createAppointment)



module.exports = routes