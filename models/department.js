const mongoose = require('mongoose')

const Schema = mongoose.Schema

const departmentSchema = new Schema({
  departmentName: {
    type: String,
    required: true
  },

  departmentImg: {
    type: String,
    required: true
  },

  departmentDesc: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('department', departmentSchema)