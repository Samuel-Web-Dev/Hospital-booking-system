const appointmentData = require("../models/appointmentData");
const User = require('../models/user')

exports.createAppointment = (req, res, next) => {
    if(!req.user._id) {
        throw new Error('No Authorized to book an appointment')
    }

  const appointmentReason = req.body.reason;
  const appointmentNote = req.body.notes;
  const appointmentDate = req.body.appointmentDate;

  const appointment = new appointmentData({
    doctor: "sam",
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
