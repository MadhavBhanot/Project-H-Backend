const express = require('express')
const cors = require('cors')
const connectDB = require('./config/configDB')
const authRoutes = require('./routes/auth')

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5001

connectDB()

app.get('/', (req, res) => {
  res.status(200).send('Hello World!')
})

//Authentication Routes
app.use('/api/auth',authRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})
