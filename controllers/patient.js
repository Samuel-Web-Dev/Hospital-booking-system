const AppointmentData = require("../models/appointmentData");
const User = require("../models/user");
const Department = require("../models/department");
const Timing = require('../models/timings')

const bcrypt = require('bcryptjs')


// exports.getDoctorsForAppointmentPage = (req, res, next) => {
//   User.find({ role: "doctor" })
//     .then((doctors) => {
//       if (!doctors) {
//         const error = new Error("Doctors not found");
//         error.statusCode = 500;
//         throw error;
//       }

//       let doctorDetails = doctors.map((doctor) => {
//         return {
//           doctorId: doctor._id,
//           doctorName: doctor.name,
//         };
//       });

//       res.json({ message: "All Doctors", doctors: doctorDetails });
//     })
//     .catch((err) => {
//       console.log(err);
//       next(err);
//     });
// };

exports.getAdd_Appointment = (req, res, next) => {
   const doctorId = req.params.doctorId

   if(!req.user._id) {
     return User.findById(doctorId).then(doctor => {
       res.json({message: 'Not Authorized', doctor: doctor})
       next()
     }).catch(err => {
      console.log(err)
      next(err)
     })
   }

   User.findById(doctorId).then(doctor => {
     Timing.find({creator: doctorId}).then(times => {
      return res.json({message: 'Book Appointment', doctor: {doctor, times}})
     })
   })
}

exports.postAdd_Appointment = (req, res, next) => {
  if (!req.user._id) {
    throw new Error("Not Authorized to book an appointment");
  }

  const appointmentReason = req.body.reason;
  const appointmentNote = req.body.notes;
  const appointmentDate = req.body.appointmentDate;
  const doctor = req.params.doctorId

  // find all the user which is doctor and get there userId

  const appointment = new AppointmentData({
    doctor: doctor,
    reason: appointmentReason,
    notes: appointmentNote,
    date: appointmentDate,
    creator: req.user._id,
  });
  return appointment
    .save()
    .then(() => {
      return User.findById(req.user._id);
    })
    .then((user) => {
      user.appointments.push(appointment);
      return user.save();
    })
    .then(() => {
      return res.json({
        message: "appointment created successfully",
        appointment: appointment,
      });
    })
    .catch((err) => {
      console.log(err);
      next(err)
    });
};


exports.getAppointments = (req, res, next) => {
   AppointmentData.find({creator: req.user._id}).then(appointments => {
     return res.json({message: 'All My Appointments', appointments: appointments})
   }).catch((err) => {
    console.log(err);
    next(err)
  });
}

exports.getAppointment = (req, res, next) => {
  const appointmentId = req.params.appointmentId
  AppointmentData.findById(appointmentId).then((appointment) => {
    return res.json({message: 'Single Appointment', appointment: appointment})
  }).catch((err) => {
    console.log(err);
    next(err)
  });
}


exports.profile = (req, res, next) => {
  User.findById(req.user._id).then(user => {
    return res.json({message: 'Patient Profile', patientProfile: user})
  }).catch((err) => {
    console.log(err);
    next(err)
  });
}


exports.updatePassword = (req, res, next) => {
  const currentPassword = req.body.currentPassword
  const newPassword = req.body.newPassword
  const confirmPassword = req.body.confirmPassword

  bcrypt.compare(currentPassword, req.user.password).then((doMatch) => {
      if(!doMatch) {
          const error = new Error('Current Password is Incorrect')
          error.statusCode = 401
          throw error
      }

       return User.findById(req.user._id)
  }).then(user => {
      if(!user) {
          throw new Error('user not found')
      }

      if(newPassword.toString() !== confirmPassword.toString()) {
          throw new Error('Password do not match')
      }

       bcrypt.hash(newPassword, 12).then(hashedPassword => {
          user.password = hashedPassword
          return user.save()
       }).then(() => {
          return res.json({message: 'Password Updated Successfully', User: user})
       })
  }).catch((err) => {
      next(err)
  })
}


exports.logout = (req, res) => {
  // Simply respond to the client, indicating that the token should be removed
  return res.status(200).json({ message: "Successfully logged out. Remove token from client(localStorage)" });
};

