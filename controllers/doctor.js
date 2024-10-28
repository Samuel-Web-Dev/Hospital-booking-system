const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const AppointmentData = require("../models/appointmentData");
const Department = require("../models/department");
const Timing = require('../models/timings') 

exports.doctorDashboard = (req, res, next) => {
  AppointmentData.find({ doctor: req.user._id }).then((appointments) => {
    let uniqueCreators = new Set(); // Create a Set to track unique creator IDs

    let removeDuplicate = appointments.filter((appointment) => {
      // Check if the creator's ID is already in the Set
      if (!uniqueCreators.has(appointment.creator._id.toString())) {
        uniqueCreators.add(appointment.creator._id.toString()); // Add creator ID to the Set
        return true; // Keep this appointment (first occurrence of creator)
      }
      return false; // Skip this appointment (duplicate creator)
    })

    // Lets get all the future appointments
    AppointmentData.find({date: {$gt: Date.now()}, status: 'Pending'}).then((futureAppointments) => {
    //    Completed Appointments
     AppointmentData.find({status: 'Completed'}).then((completedAppointment) => {
        res.json({ appointments: appointments.length, totalPatients: uniqueCreators.size, futureAppointments: futureAppointments, completedAppointment: completedAppointment }); 
     })
    }) 
  }).catch((err) => {
     next(err)
  })
}


exports.getAppointments = (req, res, next) => {
    AppointmentData.find({doctor: req.user._id}).populate('creator').then(appointments => {
        return res.json({message: 'All Appointments', appointments: appointments})
    }).catch(err => {
        next(err)
    })
}

exports.appointmentDetail = (req, res, next) => {
    const appointmentId = req.params.appointmentId
    AppointmentData.findById(appointmentId).populate('creator').then((appointment) => {
        if(!appointment) {
            return res.json({message: 'Appointment not found'})
        }
      return res.json({message: 'Single Appointment', appointment: appointment})
    })
}

exports.updateAppointment = (req, res, next) => {
    const name = req.body.name
    const gender = req.body.gender
    const email = req.body.email
    const insurancePolicyNumber = req.body.insurancePolicyNumber
    const appointmentId = req.params.appointmentId

    AppointmentData.findById(appointmentId).populate('creator').then(appointment => {
        if(!appointment) {
            const error = new Error('Appointment not found')
            error.statusCode = 400
            throw error
        }

        appointment.creator.name = name
        appointment.creator.gender = gender
        appointment.creator.email = email
        appointment.insurancePolicyNumber = insurancePolicyNumber
        return appointment.save()
    }).then(appointment => {
        return res.json({message: 'Updated Patient Details Sucessfully', appointment: appointment})
    }).catch(err => {
        console.log(err)
        next(err)
      })
}

exports.getAppointmentsHistory = (req, res, next) => {
    AppointmentData.find({status: 'Completed'}).then(completedAppointment => {
        return res.json({message: 'Completed Appointments History', appointmentsHistory: completedAppointment})
    }).catch(err => {
        next(err)
    })
}


exports.getPatients = (req, res, next) => {
    AppointmentData.find({ doctor: req.user._id }).populate('creator').then((appointments) => {
        let uniqueCreators = new Set(); // Create a Set to track unique creator IDs
    
        let removeDuplicate = appointments.filter((appointment) => {
          // Check if the creator's ID is already in the Set
          if (!uniqueCreators.has(appointment.creator._id.toString())) {
            uniqueCreators.add(appointment.creator); // Add creator ID to the Set
            return true; // Keep this appointment (first occurrence of creator)
          }
          return false; // Skip this appointment (duplicate creator)
        })

        let patients = []
        for (const creator of uniqueCreators){
            patients.push(creator)
        }
    
        return res.json({message: 'All Patients', totalPatients: patients})
      }).catch((err) => {
         next(err)
      })
}

exports.doctorProfile = (req, res, next) => {
    User.findById(req.user._id).then((doctor) => {
        if(!doctor) {
            const error = new Error('Appointment not found')
            error.statusCode = 400
            throw error
        } 

        return res.json({message: 'Doctor', doctor: doctor})
    }).catch(err => {
        next(err)
    })
}


exports.doctorProfileUpdate = (req, res, next) => {
  const doctorId = req.params.doctorId
  const department = req.body.department;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const password = req.body.password;
  const gender = req.body.gender;
  const designation = req.body.designation;
  const qualification = req.body.qualification;
  const experience = req.body.experience;
  const biography = req.body.biography;
  const specialization = req.body.specialization;
  const address = req.body.address;
  const consultation_fee = req.body.consultation_fee;
  const isActive = req.body.isActive;
  const isBanned = req.body.isBanned
  let imageUrl = req.body.imageUrl

  if(req.file) {
    imageUrl = req.file.path
  }

  if (!imageUrl) {
   const error = new Error("No file picked");
   error.statusCode = 422;
   throw error;
 }

  let hashedPass;

  bcrypt.hash(password, 12).then(pass => {
    hashedPass = pass
    return User.findById(doctorId)
  }).then((doctor) => {
    if (!doctor) {
      const error = new Error("Could not find doctor");
      error.statusCode = 500;
      throw error;
    }
 
 
   //  if(doctor.imageUrl !== imageUrl) {
   //    clearImage(doctor.imageUrl)
   //  }
 
   doctor.department = department;
   doctor.name = name;
   doctor.phone = phone;
   doctor.email = email;
   doctor.password = hashedPass;
   doctor.gender = gender;
   doctor.designation = designation;
   doctor.qualification = qualification;
   doctor.experience = experience;
   doctor.biography = biography;
   doctor.specialization = specialization;
   doctor.address = address;
   doctor.consultation_fee = consultation_fee;
   doctor.isActive = isActive;
   doctor.isBanned = isBanned
   doctor.imageUrl = imageUrl
 
   return doctor.save()
  }).then((doctor) => {
   res.status(200).json({message: 'Updated Doctor Successfully', doctor: doctor})
 }).catch(err => {
   console.log(err)
   next(err)
 })
}

exports.getTiming = (req, res, next) => {
  Timing.find({}).then(times => {
    return res.json({message: 'All timing', times: times})
}).catch(err => {
    next(err)
})
}

exports.createTiming = (req, res, next) => {
   const day = req.body.day
   const shift = req.body.shift
   const startTime = req.body.startTime
   const endTime = req.body.endTime

   Timing.find({day: day}).then((times) => {
      console.log(times)

      let conflictFound = false
      for (const existingTime of times) {
        // Check if shift matches
        if (existingTime.shift.toString().trim() === shift.toString().trim()) {
          // throw new Error('Doctor already has this shift for the day');
          conflictFound = true
           return res.json({message: 'Doctor already has this shift for the day'})
        }
        
        // Check for overlapping time slots
        const existingStart = existingTime.startTime;
        const existingEnd = existingTime.endTime;
        
        if (
          (startTime >= existingStart && startTime < existingEnd) || // Start time overlaps
          (endTime > existingStart && endTime <= existingEnd) || // End time overlaps
          (startTime <= existingStart && endTime >= existingEnd) // Fully overlaps
        ) {
          // throw new Error('Time slot already taken')
          conflictFound = true
          return res.json({message: 'Time slot already taken'})
        }

      }

      if(conflictFound) {
        return;
      }

      const timing = new Timing({
        day: day,
        shift: shift,
        startTime: startTime,
        endTime: endTime
       })
       timing.save().then((time) => {
         return res.json({message: 'Timing Created Successfully', timing: time})
       }).catch(err => {
        console.log(err)
         next(err)
       })
   })
}


exports.getUpdateTime = (req, res, next) => {
  const timeId = req.params.timeId
  Timing.findById(timeId).then(time => {
    return res.json({message: 'Single Time', time: time})
}).catch(err => {
    next(err)
})
}

exports.postUpdateTime = (req, res, next) => {
  const day = req.body.day
  const shift = req.body.shift
  const startTime = req.body.startTime
  const endTime = req.body.endTime
  const timeId = req.params.timeId

  Timing.findById(timeId).then((time) => {
    if(!time) {
      const error = new Error('Time not found')
      error.statusCode = 400
      throw error
    } 


    return Timing.find({day: day}).then((times) => {
      console.log(times)

      let conflictFound = false
      for (const existingTime of times) {
        // Check if shift matches
        if (existingTime.shift.toString().trim() === shift.toString().trim()) {
          // throw new Error('Doctor already has this shift for the day');
          conflictFound = true
           return res.json({message: 'Doctor already has this shift for the day'})
        }
        
        // Check for overlapping time slots
        const existingStart = existingTime.startTime;
        const existingEnd = existingTime.endTime;
        
        if (
          (startTime >= existingStart && startTime < existingEnd) || // Start time overlaps
          (endTime > existingStart && endTime <= existingEnd) || // End time overlaps
          (startTime <= existingStart && endTime >= existingEnd) // Fully overlaps
        ) {
          // throw new Error('Time slot already taken')
          conflictFound = true
          return res.json({message: 'Time slot already taken'})
        }

      }

      if(conflictFound) {
        return;
      }
       

      time.day = day
      time.shift = shift
      time.startTime = startTime
      time.endTime = endTime
      return time.save()
   }).then((updatedTime) => {
      return res.json({message: 'Time Updated Successfully', time: updatedTime})
   })

  })


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



  
function clearImage(filePath) {
    let fileUrl = path.join(__dirname, '..', filePath)
    fs.unlink(fileUrl, (err) => {
       console.log(err)
    })
  }