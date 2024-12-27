const express = require('express')
const cors = require('cors')
const connectDB = require('./config/configDB')
const apiRoutes = require('./routes/api')

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5001

connectDB()

//All API Routes
app.use(apiRoutes)
app.all('*', (req, res) => {
  res.status(404).json({ message: `${req.originalUrl} is not found on this server` })
})

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})
