const mongoose = require('mongoose')

const Schema = mongoose.Schema

const appointmentDataSchema = new Schema({
    doctor: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' }
}, { timestamps: true })

module.exports = mongoose.model('AppointmentData', appointmentDataSchema)