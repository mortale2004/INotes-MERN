const mongoose = require("mongoose");

// schema to create specifiec structure for every message
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

// export model created from MessageSchema 
module.exports = mongoose.model("message", MessageSchema);

