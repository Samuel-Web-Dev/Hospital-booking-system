const express = require('express')

const routes = express.Router()
const patientController = require('../controllers/patient')
const isAuth = require('../middleware/is-auth')



const checkRole = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    };
  };


routes.post('/createAppointment/:doctorId', isAuth, checkRole('patient'), patientController.postAdd_Appointment)

routes.get('/createAppointment/:doctorId',isAuth, checkRole('patient'), patientController.getAdd_Appointment)

routes.get('/get-appointments', isAuth, checkRole('patient'), patientController.getAppointments)

routes.get('/get-appointments/:appointmentId', isAuth, checkRole('patient'), patientController.getAppointment)

routes.get('/get-profile', isAuth, checkRole('patient'), patientController.profile)

routes.put('/update-password', isAuth, checkRole('patient'), patientController.updatePassword)

routes.get('/logout', isAuth, checkRole('patient'), patientController.logout)




module.exports = routes