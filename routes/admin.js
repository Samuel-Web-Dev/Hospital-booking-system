const express = require('express')

const routes = express.Router()
const isAuth = require('../middleware/is-auth')
const adminController = require('../controllers/admin')


// Optional: Role-Based Access Control (RBAC) You can also implement role-based access control (RBAC) to restrict certain routes or actions to specific user roles (e.g., only admins can delete users, only doctors can view appointments). Here's an example middleware to restrict access:



const checkRole = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    };
  };
  
  // Usage in routes:
  routes.get('/admin-dashboard', isAuth, checkRole(['admin']), adminController.adminDashboard);

  routes.get('/appointments', isAuth, checkRole(['admin']), adminController.getAppointments);

  routes.get('/appointment/:appointmentId', isAuth, checkRole(['admin']), adminController.appointmentDetail);

  routes.get('/get-doctors-to-book-an-appointment', isAuth, checkRole(['admin']), adminController.getDoctorsToBookAppointment);

  routes.get('/createappointment/:doctorId', isAuth, checkRole(['admin']), adminController.createAppointmentWithSpecificDoctor);

  routes.post('/add-department', isAuth, checkRole(['admin']), adminController.addDepartment);

  routes.get('/get-departments', isAuth, checkRole(['admin']), adminController.getDepartments);

  routes.get('/get-department/:departmentId', isAuth, checkRole(['admin']), adminController.getDepartment);

  routes.put('/edit-department/:departmentId', isAuth, checkRole(['admin']), adminController.editDepartment);

  routes.delete('/delete-department/:departmentId', isAuth, checkRole(['admin']), adminController.deleteDepartment);

  routes.post('/add-doctor', isAuth, checkRole(['admin']), adminController.addDoctor)

  routes.get('/get-doctors', isAuth, checkRole(['admin']), adminController.getDoctors)

  routes.get('/get-doctor/:doctorId', isAuth, checkRole(['admin']), adminController.getDoctor)

  routes.put('/edit-doctor/:doctorId', isAuth, checkRole(['admin']), adminController.editDoctor)

  routes.delete('/delete-doctor/:doctorId', isAuth, checkRole(['admin']), adminController.deleteDoctor)

  routes.get('/get-patients', isAuth, checkRole(['admin']), adminController.getPatients)

  routes.get('/get-doctor-patients', isAuth, checkRole(['admin']), adminController.get_doctor_patients)

  routes.post('/add-admin', isAuth, checkRole(['admin']), adminController.addAdmin)

  routes.get('/get-all-admin', isAuth, checkRole(['admin']), adminController.get_all_admin)

  routes.get('/get-admin/:adminId', isAuth, checkRole(['admin']), adminController.get_admin)

  routes.put('/edit-admin/:adminId', isAuth, checkRole(['admin']), adminController.editAdmin)
  
  routes.delete('/delete-admin/:adminId', isAuth, checkRole(['admin']), adminController.deleteAdmin)

  routes.get('/logout', isAuth, checkRole(['admin']), adminController.logout)
  
  // routes.post('/doctor-dashboard', isAuth, checkRole(['doctor']), adminController.doctorDashboard);


  module.exports = routes