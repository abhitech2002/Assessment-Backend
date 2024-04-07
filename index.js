import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userSignUp from './routes/userSignUp.js'

dotenv.config()

const app = express()

// Middleware
app.use(express.json())

app.use('/signup', userSignUp);

// Mongoose for connecting to mongoDB Database
const MONGODB_URI = process.env.MONGODB_URI
mongoose
    .connect(MONGODB_URI)
    .then( () => {
        console.log("MongoDB connected")
    })
    .catch((error) => console.log(error))

// Hello World Testing 
app.get("/", (req, res) => {
    console.log(req)
    return res.status(200).send("Hello World!")
} )


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`)
})