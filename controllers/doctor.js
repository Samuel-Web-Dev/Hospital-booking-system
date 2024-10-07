const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const AppointmentData = require('../models/appointmentData')
const Department = require('../models/department');


exports.doctorDashboard = (req, res, next) => {
    AppointmentData.find({}).then(appointments => {
        return AppointmentData.find({
            date: {$gt: Date.now()},
            status: 'Pending'
        }).then(futureAppointments => {
            return AppointmentData.find({status: 'Completed'}).then(completedAppointments => {
                return User.find({role: 'patient'}).then(totalPatients => {
                    return res.json({
                        message: 'Doctor Dashboard',
                        Total_Patients: totalPatients,
                        Total_Appointments: appointments,
                        Future_Appointments: futureAppointments,
                        Completed_Appointments: completedAppointments
                    })
                })
            })
        })
    })
 };