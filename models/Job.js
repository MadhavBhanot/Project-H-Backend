// Job Schema
const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User who posted the job
    ref: 'User', // Refers to the User schema
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true, // Removes extra spaces
  },
  minReq: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    default: null, // Optional field
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
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps automatically

// Create Job Model
const Job = mongoose.model('Job', jobSchema);