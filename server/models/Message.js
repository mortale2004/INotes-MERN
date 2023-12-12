const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "user",
        require: true,
    },
    name:{
        type: String,
        require: true,
    },
    mobile:{
        type: Number,
        require: true
    },
    message:{
        type:String,
        require: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("message", MessageSchema);

