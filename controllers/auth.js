
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

exports.signup = (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const gender = req.body.gender

    bcrypt.hash(password, 12)
     .then(hashedPass => {
        const user = new User({
          name: name,
          email: email,
          password: hashedPass,
          gender: gender,
          role: 'patient'
        })
        return user.save()
     }).then(user => {
       res.status(200).json({ message: "User created successfully", user: user, userId: user._id })
     }).catch(err => {
       console.log(err)
       throw new Error('Error Occured, Check your code')
     })
}


exports.moreabout = (req, res, next) => {
  const userId = req.query.userId
  User.findById(userId)
   .then(user => {
    console.log(user)
    if(!user) {
      const error = new Error('User not found')
      error.statusCode = 404
      throw error
    }
    
    user.insuranceProvider = req.body.insuranceProvider
    user.insurancePolicyNumber = req.body.insurancePolicyNumber
    user.allergies = req.body.allergies
    user.currentMedication = req.body.currentMedication
    user.familyMedicalHistory = req.body.familyMedicalHistory
    user.pastMedicalHistory = req.body.pastMedicalHistory
    return user.save()
   }).then(user => {
     res.status(201).json({message: 'User Details Modified', user: user})
   }).catch(err => {
    console.log(err)
   })
}


exports.login = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  let loadedUser;

  User.findOne({email: email})
   .then(user => {
    if(!user) {
        const error = new Error("User with this email could not be found");
        error.statusCode = 401;
        throw error;
    }

    loadedUser = user
    return bcrypt.compare(password, user.password)
   }).then(isMatched => {
    if(!isMatched) {
      const error = new Error("Password is Incorrect");
      error.statusCode = 401;
      throw error;
    }


    const token = jwt.sign(
      {
      user: loadedUser,
      userId: loadedUser._id
    }, 'this-is-an-hospital-data', { expiresIn: '3h' })

    res.json({ message: 'Login Success', token: token, role: loadedUser.role })
   }).catch(err => {
     console.log(err)
   })
}