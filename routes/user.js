
const express = require('express')

const routes = express.Router();

const userController = require('../controllers/user')



routes.get('/get-departments', userController.getDepartments)

routes.get('/get-departments/:departmentId', userController.getDepartment)

routes.get('/get-doctors', userController.getDoctors)

routes.get('/get-doctors/:doctorId', userController.getDoctorDetail)