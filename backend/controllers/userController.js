const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const generateToken = (id) => {
    return jwt.sign(
        {id},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )  
}

const registerUser = asyncHandler( async (req, res) => {
    const { name, email, password } = req.body

    // validation
    if (!name || !email || !password) {
        res.status(400)
        throw new Error("Please fill in all required fields")
    }

    if (password.length < 6) {
        throw new Error("Password must be at least 6 characters")
    }

    // check if user email already exist
    const userExist = await User.findOne({ email })

    if (userExist) {
        res.status(400)
        throw new Error("This email has already been registered!!")
    }

    // create a new user if new email
    const user = await User.create({
        name,
        email,
        password
    })

    //generate token
    const token = generateToken(user._id)

    // send http-only cookie to the frontend
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000*86400), // 1 day
        sameSite: "none",
        secure: true
    })

    if (user) {
        const { _id, name, email, photo, phone, bio } = user
        res.status(201).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
            token
        })
    }else {
        res.status(400)
        throw new Error("Invalid user data")
    }

})

const loginUser = asyncHandler( async (req, res) => {
    const { email, password } = req.body

    // validation request
    if (!email || !password) {
        res.status(400)
        throw new Error("Please add your email and password")
    }

    // check if user exist
    const user = await User.findOne({ email })
    if (!user) {
        res.status(400)
        throw new Error("User not found, please sign up")
    }

    //user exist, now check if password is correct
    const passwordIsCorrect = await bcrypt.compare(password, user.password)

    //generate token
    const token = generateToken(user._id)

    // send http-only cookie to the frontend
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000*86400), // 1 day
        sameSite: "none",
        secure: true
    })

    if (user && passwordIsCorrect) {
        const { _id, name, email, photo, phone, bio } = user

        res.status(200).json({
            _id,
            name,
            email,
            photo,
            phone,
            bio,
            token
        })
    }else {
        res.status(400)
        throw new Error("Invalid email or password")
    }
})

module.exports = {
    registerUser,
    loginUser
}