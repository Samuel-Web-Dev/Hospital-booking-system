 require('dotenv').config()
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const multer = require('multer')

const app = express()

const authRouter = require('./routes/auth')
const patientRouter = require('./routes/patient')
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin')
const doctorRouter = require('./routes/doctor')


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },

    filename: (req, file, cb) => {
        console.log(file)
        const date = new Date().toISOString().replace(/:/g, '-')
        cb(null, date + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    console.log(file)
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null, true)
     } else {
        cb(null, false)
     }
}



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next()
})


app.use(express.json())
app.use(express.static(path.join(__dirname, 'images')))
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('images'))

app.use(authRouter)
app.use('/admin', adminRouter)
app.use('/doctor', doctorRouter)
app.use('/patient', patientRouter)

const bcrypt = require('bcryptjs');

// The password you want to hash
// const plainPassword = 'admin01';

// // Function to hash the password
// bcrypt.hash(plainPassword, 12).then(hashedPassword => {
//   console.log('Hashed password:', hashedPassword);
// }).catch(err => {
//   console.error('Error hashing the password:', err);
// });


app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message
    const data = error.data
    res.status(status).json({message: message, data: data})
})


mongoose.connect(`mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@first-project.y8uqnxq.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority&appName=first-project`).then(() =>{
    console.log('Database connected successfully')
    app.listen(8080)
}).catch(err => {
    console.log(err)
})