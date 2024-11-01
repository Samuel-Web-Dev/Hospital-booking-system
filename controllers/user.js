const AppointmentData = require("../models/appointmentData");
const User = require("../models/user");
const Department = require("../models/department");
const Timing = require('../models/timings')

exports.getDepartments = (req, res, next) => {
  Department.find({})
    .then((departments) => {
      if (!departments) {
        const error = new Error("Department not found");
        error.statusCode = 500;
        throw error;
      }

      res.json({ message: "All Departments", departments: departments });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};


exports.getDepartment = (req, res, next) => {
  const departmentId = req.params.departmentId

  Department.findById(departmentId).then((department) => {
    // Look for all doctors that are in this department
    User.find({role: 'doctor', department: department.departmentName}).then(doctorAvailable => {
      return res.json({message: 'Single Department with the doctors', department: department, doctors: doctorAvailable})
    })
  }).catch(err => {
    console.log(err)
    next(err)
  })
}



exports.getDoctors = (req, res, next) => {
    User.find({role: 'doctor'}).then(doctors => {
        return res.json({message: 'All Doctors', doctors: doctors})
    }).catch(err => {
        console.log(err)
        next(err)
    })
}



exports.getDoctorDetail = (req, res, next) => {
  const doctorId = req.params.doctorId

  User.findById(doctorId).then((doctor) => {
     Timing.find({creator: doctorId}).then(time => {
      return res.json({message: 'Doctor Details', doctorDetail: {doctor, time}})
     })
  }).catch(err => {
    console.log(err)
    next(err)
  })
}
