const mongoose = require("mongoose");

// schema to create specifiec structure for every Note
const noteSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        require: true,
    },
    title:{
        type: String,
        require: true,
    },
    description:{
        type: String,
        require: true,
    },
    tag:{
        type: String,
        default: "General"
    },
    Date:{
        type: Date,
        default: Date.now
    }
});

// export model created from NoteSchema 
module.exports = mongoose.model("note",noteSchema);