const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
      enum: ['patient', 'doctor', 'admin']
    },

    imageUrl: {
      type: String
    },

    gender: {
      type: String
    },

    designation: {
      type: String
    },

    physician: {
      type: String,
    },

    department: {
      type: String,
    },

    qualification: {
      type: String
    },

    experience: {
      type: String
    },

    specialization: {
      type: String
    },

    consultation_fee: {
      type: String
    },

    address: {
      type: String
    },

     isActive: {
       type: Boolean
     },

     isBanned: {
       type: Boolean
     },

    insuranceProvider: {
      type: String,
    },
    insurancePolicyNumber: {
      type: String,
    },
    allergies: {
      type: String,
    },
    currentMedication: {
      type: String,
    },
    familyMedicalHistory: {
      type: String,
    },
    pastMedicalHistory: {
      type: String,
    },

    appointments: [{
      type: Schema.Types.ObjectId,
      ref: 'AppointmentData'
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
