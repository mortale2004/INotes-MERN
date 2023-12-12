const mongoose = require("mongoose");

// schema to create specifiec structure for every User
const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

// export model created from UserSchema
module.exports = mongoose.model("user", userSchema);
