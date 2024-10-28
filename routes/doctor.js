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

  routes.get('/get-appointments', isAuth, checkRole('doctor'), doctorController.getAppointments)

  routes.get('/get-appointment/:appointmentId', isAuth, checkRole('doctor'), doctorController.appointmentDetail)

  routes.put('/edit-appointment/:appointmentId', isAuth, checkRole('doctor'), doctorController.updateAppointment)

  routes.get('/completed-appointment', isAuth, checkRole('doctor'), doctorController.getAppointmentsHistory)

  routes.get('/patients', isAuth, checkRole('doctor'), doctorController.getPatients)

  routes.get('/profile', isAuth, checkRole('doctor'), doctorController.doctorProfile)

  routes.put('/profile/:doctorId', isAuth, checkRole('doctor'), doctorController.doctorProfileUpdate)

  routes.get('/timing', isAuth, checkRole('doctor'), doctorController.getTiming)

  routes.post('/timing', isAuth, checkRole('doctor'), doctorController.createTiming)

  routes.get('/get-update-time/:timeId', isAuth, checkRole('doctor'), doctorController.getUpdateTime)

  routes.post('/post-update-time/:timeId', isAuth, checkRole('doctor'), doctorController.postUpdateTime)

  routes.put('/update-password', isAuth, checkRole('doctor'), doctorController.updatePassword)

  routes.get('/logout', isAuth, checkRole('doctor'), doctorController.logout)


  module.exports = routes