 const fs = require('fs')
 const path = require('path')
 const bcrypt = require('bcryptjs')
 const User = require('../models/user')
 const AppointmentData = require('../models/appointmentData')
 const Department = require('../models/department');


 exports.adminDashboard = (req, res, next) => {
     AppointmentData.find({}).then((appointments) => {
      let todayAppointment = appointments.filter((appointment) => {
        let createdDate = new Date(appointment.createdAt).getDate();
        let today = new Date().getDate();
        return createdDate === today;
      })

       return Department.find({}).then((departments) => {
        // Total Doctors
        return User.find({role: 'doctor'}).then((doctors) => {
          //  Total Admins
          return User.find({role: 'admin'}).then((admins) => {
            // Total Patients
            return User.find({role: 'patient'}).then((patients) => {
              return res.json({
                message: 'Admin Dashboard',
                TodayAppointment: todayAppointment,
                All_Appointments: appointments,
                All_Departments: departments,
                Total_Doctors: doctors,
                Total_Admin: admins,
                Total_Patients: patients 
              })
            })
          })
        })
       })
     })
  };

exports.getAppointments = (req, res, next) => {
    AppointmentData.find({}).populate('creator').then((appointments) => {
      return res.json({message: 'All appointments', appointments: appointments }) 
    })
}

exports.appointmentDetail = (req, res, next) => {
    const appointmentId = req.params.appointmentId
    AppointmentData.findById(appointmentId).populate('creator').then((appointment) => {
      return res.json({message: 'Single Appointment', appointment: appointment})
    })
}
  


exports.getDoctorsToBookAppointment = (req, res, next) => {
    User.find({role: 'doctor'}).then((doctors) => {
        res.json({message: 'Book an appointment with a doctor', doctors: doctors})
    }).catch(err => {
      console.log(err)
      next(err)
    })
}

exports.createAppointmentWithSpecificDoctor = (req, res, next) => {
    const doctorId = req.params.doctorId;
    User.findById(doctorId).then((user) => {
      if(!user) {
        const error = new Error('Doctor not found')
        error.statusCode = 404
        throw error
      }

      res.json({message: 'Book this doctor', doctor: user})
    }).catch(err => {
      console.log(err)
      next(err)
    })
}


exports.addDepartment = (req, res, next) => {
  const name = req.body.departmentName;
  const description = req.body.departmentDesc
  const imageUrl = req.file

  if(!imageUrl) {
    console.log('Image required')
    return
  }

  const path = imageUrl.path
  
  const department = new Department({
    departmentName: name,
    departmentDesc: description,
    departmentImg: path,
    creator: req.user._id
  })
  department.save().then((department) => {
    res.json({message: 'Department Added Successfully', department: department})
  }).catch(err => {
    console.log(err)
    next(err)
  })
}


exports.getDepartments = (req, res, next) => {
  Department.find({}).then(department => {
    return res.json({ message: 'All Department', departments: department })
  }).catch(err => {
    console.log(err)
    next(err)
  })
}


 exports.getDepartment = (req, res, next) => {
  const departmentId = req.params.departmentId

  Department.findById(departmentId).then((department) => {
      if(!department) {
          return res.redirect('/admin/admin-dashboard')
      }
      
      res.json({ message: 'Single Department', department: department })
  })
 }


 exports.editDepartment = (req, res, next) => {
  const departId = req.params.departmentId
  const name = req.body.departmentName;
  const description = req.body.departmentDesc
  let imageUrl = req.body.departmentImg

   if(req.file) {
     imageUrl = req.file.path
   }

   if (!imageUrl) {
    const error = new Error("No file picked");
    error.statusCode = 422;
    throw error;
  }

  Department.findById(departId).then((department) => {
    if (!department) {
      const error = new Error("Could not find department");
      error.statusCode = 500;
      throw error;
    }

    if(department.creator.toString() !== req.user._id.toString()) {
      const error = new Error('Not Authorized')
      error.statusCode = 403
      throw error
    }

    if(department.departmentImg !== imageUrl) {
      clearImage(department.departmentImg)
    }

    department.departmentName = name
    department.departmentDesc = description
    department.departmentImg = imageUrl
    return department.save()
  }).then((department) => {
    res.status(200).json({message: 'Updated Department Successfully', department: department})
  }).catch(err => {
    console.log(err)
    next(err)
  })
 }


 exports.deleteDepartment = (req, res, next) => {
   const departId = req.params.departmentId

   Department.findById(departId).then((department) => {
    if (!department) {
      const error = new Error("Could not find department");
      error.statusCode = 500;
      throw error;
    }

    if(department.creator.toString() !== req.user._id.toString()) {
      const error = new Error('Not Authorized')
      error.statusCode = 403
      throw error
    }

    clearImage(department.departmentImg)
    return Department.findByIdAndDelete(departId)
   }).then(() => {
     return User.findById(req.user._id)
   }).then(user => {
     user.departments.pull(departId)
     return user.save()
   }).then(() => {
     res.json({message: 'Department Deleted'})
   }).catch(err => {
     console.log(err)
     next(err)
   })
 }



 exports.addDoctor = (req, res, next) => {
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
  // const image = req.file

  // if(!image) {
  //   const error = new Error('No Image Picked')
  //   error.statusCode = 400
  //   throw error
  // }

  // let imageUrl = image.path
 bcrypt.hash(password, 12).then(hashedPass => {
   
  const doctor = new User({
    department,
    phone,
    name,
    email,
    password: hashedPass,
    gender,
    qualification,
    designation,
    experience,
    biography,
    specialization,
    address,
    consultation_fee,
    isActive,
    isBanned,
    role: 'doctor'
  })
  return doctor.save()
 }).then((doc) => {
  res.json({message: 'Doctor Created', doctor: doc})
 }).catch(err => {
    console.log(err)
    next(err)
  })

}


exports.getDoctors = (req, res, next) => {
  User.find({role: 'doctor'}).then((doctors) => {
    if (!doctors) {
      const error = new Error("Doctor not found");
      error.statusCode = 500;
      throw error;
    }
    res.json({message: 'All Doctors', doctors: doctors})
}).catch(err => {
  console.log(err)
  next(err)
})
}


exports.getDoctor = (req, res, next) => {
  const doctorId = req.params.doctorId
  User.findOne({_id: doctorId, role: 'doctor'}).then((doctor) => {
    if (!doctor) {
      const error = new Error("Doctor not found");
      error.statusCode = 500;
      throw error;
    }

    res.json({message: 'Single Doctor', doctor: doctor})
  }).catch(err => {
    console.log(err)
    next(err)
  })
}


exports.editDoctor = (req, res, next) => {
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


exports.deleteDoctor = (req, res, next) => {
  const doctorId = req.params.doctorId

  User.findById(doctorId).then((doctor) => {
   if (!doctor) {
     const error = new Error("Could not find doctor");
     error.statusCode = 500;
     throw error;
   }

  //  clearImage(doctor.imageUrl)
   return User.findByIdAndDelete(doctorId)
  }).then(() => {
    res.json({message: 'Doctor Deleted'})
  }).catch(err => {
    console.log(err)
    next(err)
  })
}


exports.getPatients = (req, res, next) => {
   User.find({role: 'patient'}).then((patients) => {
    if (!patients) {
      const error = new Error("Patient not found");
      error.statusCode = 500;
      throw error;
    }
     res.json({message: 'All Patient', patients: patients})
   }).catch(err => {
     console.log(err)
     next(err)
   })
}


exports.get_doctor_patients = (req, res, next) => {
  const doctorName = req.query.name
  AppointmentData.find({doctor: doctorName}).populate('creator').then((appointments) => {
     console.log(appointments)
     if(!appointments) {
      const error = new Error("Appointment not found");
      error.statusCode = 500;
      throw error;
     }

     let app = appointments.map((app) => {
          return {
            name: app.creator.name,
            email: app.creator.email,
            gender: app.creator.gender
          }
     })

     console.log(app)

     return res.json({message: 'doctor-patients', patients: app})
  }).catch(err => {
    console.log(err)
    next(err)
  })
}


exports.addAdmin = (req, res, next) => {
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  const gender = req.body.gender

  bcrypt.hash(password, 12).then(hashedPass => {
    const admin = new User({
      name: name,
      email: email,
      password: hashedPass,
      gender: gender,
      role: 'admin'
    })

    return admin.save()
  }).then((admin) => {
     res.json({message: 'Created admin successfully', admin: admin})
  }).catch(err => {
    console.log(err)
    next(err)
  })
}


exports.get_all_admin = (req, res, next) => {
  User.find({role: 'admin'}).then((admins) => {
    if (!admins) {
      const error = new Error("admins not found");
      error.statusCode = 500;
      throw error;
    }

    res.json({message: 'All Admin', admins: admins})
  }).catch((err) => {
    next(err)
  })
} 


exports.get_admin = (req, res, next) => {
  const adminId = req.params.adminId

  User.findById(adminId).then((admin) => {
    if (!admin) {
      const error = new Error("Admin not found");
      error.statusCode = 500;
      throw error;
    }

    res.json({message: 'Get single admin', admin: admin})
  }).catch((err) => {
    console.log(err)

    next(err)
  })
}


exports.editAdmin = (req, res, next) => {
  const adminId = req.params.adminId
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password
  const gender = req.body.gender
  // let imageUrl = req.body.imageUrl

//   if(req.file) {
//     imageUrl = req.file.path
//   }

//   if (!imageUrl) {
//    const error = new Error("No file picked");
//    error.statusCode = 422;
//    throw error;
//  }

  let hashedPass;

  bcrypt.hash(password, 12).then((pass) => {
    hashedPass = pass
    return User.findById(adminId)
  }).then((admin) => {
    if (!admin) {
      const error = new Error("Could not find admin");
      error.statusCode = 500;
      throw error;
    }
 
 
   //  if(admin.imageUrl !== imageUrl) {
   //    clearImage(admin.imageUrl)
   //  }
 
   admin.name = name;
   admin.email = email;
   admin.password = hashedPass;
   admin.gender = gender;
 
   return admin.save()
  }).then((admin) => {
   res.status(200).json({message: 'Updated Admin Successfully', admin: admin})
 }).catch(err => {
   console.log(err)
   next(err)
 })
}


exports.deleteAdmin = (req, res, next) => {
  const adminId = req.params.adminId

  User.findById(adminId).then((admin) => {
   if (!admin) {
     const error = new Error("Could not find admin");
     error.statusCode = 500;
     throw error;
   }

  //  clearImage(doctor.imageUrl)
   return User.findByIdAndDelete(admin)
  }).then(() => {
    res.json({message: 'Admin Deleted'})
  }).catch(err => {
    console.log(err)
    next(err)
  })
}


exports.logout = (req, res) => {
  // Simply respond to the client, indicating that the token should be removed
  return res.status(200).json({ message: "Successfully logged out. Remove token from client" });
};



function clearImage(filePath) {
  let fileUrl = path.join(__dirname, '..', filePath)
  fs.unlink(fileUrl, (err) => {
     console.log(err)
  })
}
