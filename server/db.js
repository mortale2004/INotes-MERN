const mongoose = require("mongoose");
require("dotenv").config();

// mongo db uri to conenct with database inotes
const mongoURI = process.env.MONGO_URI;

// function to connect with given uri
const connectToMongo = () => {
    mongoose.connect(mongoURI);
}

// Listeners to notify when database is connected | error | disconnected
mongoose.connection.on("connected", () => {
    console.log("connected successfully");
})

mongoose.connection.on("error", (err) => {
    console.error("Error: " + err);
})

mongoose.connection.on("disconnected", () => {
    console.log("disconnected successfully");
})

module.exports = connectToMongo;