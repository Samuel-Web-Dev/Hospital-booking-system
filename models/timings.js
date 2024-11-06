const mongoose = require('mongoose')

const Schema = mongoose.Schema


const timingSchema = new Schema({
    day: {
        type: String,
        required: true
    },
    shift: {
        type: String,
        enum: ['shift_1', 'shift_2'],
        required: true
    },
    startTime: {
        type: Number, // Still Making changes to it later
        required: true
    },
    endTime: {
        type: Number, // Still Making changes to it later
        required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      required: true  
    }
})

module.exports = mongoose.model('timing', timingSchema)