const express = require('express')

const routes = express.Router()
const isAuth = require('../middleware/is-auth')

const doctorController = require('../controllers/doctor')


const checkRole = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    };
  };


  routes.get('/doctor-dashboard', isAuth, checkRole('doctor'), doctorController.doctorDashboard)


  module.exports = routes