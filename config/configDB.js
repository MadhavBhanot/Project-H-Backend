const mongoose = require('mongoose')
require('dotenv').config()

// DB Connection
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Connected: ${connection.connection.host}`)
  } catch (error) {
    console.log(error)
  }
}

module.exports = connectDB
