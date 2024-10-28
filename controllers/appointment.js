const appointmentData = require("../models/appointmentData");
const User = require('../models/user')



exports.getDoctorsForAppointmentPage = (req, res, next) => {
  User.find({role: 'doctor'}).then((doctors) => {
    if (!doctors) {
      const error = new Error("Doctors not found");
      error.statusCode = 500;
      throw error;
    }

    let doctorDetails = doctors.map((doctor) => {
       return {
        doctorId: doctor._id,
        doctorName: doctor.name
       }
    })

    res.json({message: 'All Doctors', doctors: doctorDetails})
}).catch(err => {
  console.log(err)
  next(err)
})
}

exports.createAppointment = (req, res, next) => {
    if(!req.user._id) {
        throw new Error('No Authorized to book an appointment')
    }

  const appointmentReason = req.body.reason;
  const appointmentNote = req.body.notes;
  const appointmentDate = req.body.appointmentDate;
  const doctor = req.body.doctor

  // find all the user which is doctor and get there userId

  const appointment = new appointmentData({
    doctor: doctor,
    reason: appointmentReason,
    notes: appointmentNote,
    date: appointmentDate,
    creator: req.user._id
  });
  return appointment.save()
  .then(() => {
    return User.findById(req.user._id)
  }).then((user) => {
     user.appointments.push(appointment)
     return user.save()
  })
  .then(() => {
    return res.json({message: 'appointment created successfully', appointment: appointment})
  }).catch(err => {
    console.log(err)
  })
};
