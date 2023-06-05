const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a name"]
    },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please enter a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minLength: [6, "Password must be at least 6 characters"],
        //maxLength: [23, "Password must be max 23 characters"],
    },
    photo: {
        type: String,
        required: [true, "Please enter a photo"],
        default: "https://i.ibb.co/4pDNDk1/avatar.png"
    },
    phone: {
        type: String,
        default: "+32 000 00 00 00"
    },
    bio: {
        type: String,
        default: "bio",
        maxLength: [250, "Bio must not be more than 250 characters"],
    }
}, {timestamps: true})

// Encrypt the password before saving in the db
userSchema.pre("save", async function(next) {

    if (!this.isModified("password")) {
        return next();
    }

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
})

const User = mongoose.model("User", userSchema)

module.exports = User