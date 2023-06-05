const dotenv = require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
const errorHandler = require("./middleware/errorMiddleware")
const cookieParser = require("cookie-parser")

// routes imports
const userRoute = require("./routes/userRoute")

// Initialisation de express
const app = express()

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors())


// Routes
app.get("/", (req, res) => {
    res.send("Home Page")
})

// user register route
app.use("/api/users", userRoute)

const PORT = process.env.PORT || 5001

//error middleware
app.use(errorHandler)

// Connexion a mongodb et lancement du serveur
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server Running on port: ${PORT}`)
        })
    }).catch((err) => console.log("Error: ", err))
