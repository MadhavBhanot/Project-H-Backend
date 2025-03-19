const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
    },
    location: {
      type: String,
      required: true,
      enum: ['remote', 'on-site', 'hybrid'],
    },
    salary: {
      type: Number,
      min: 0,
      default: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true, // Removes extra spaces
    },
    duration: {
      type: String,
      required: true,
    },
    minReq: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      default: null, // Optional field
    },
    status: {
      type: String,
      enum: [
        'pending',
        'accepted',
        'rejected',
        'no longer accepting responses',
      ],
      default: 'pending',
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId, // Reference to Users who applied
        ref: 'User',
      },
    ],
    category: {
      type: String,
      required: true,
      enum: ['Technology', 'Finance', 'Education', 'Healthcare'], // Example categories
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Job', jobSchema)
