const express = require("express");
const app = express();
const connectToMongo = require("./db");
const cors = require("cors");
const path = require("path");

// solve error of cors
app.use(cors());

// port no
const PORT = process.env.PORT;

// to fetch json from the request of the user
app.use(express.json());

// function to connect with mongo database
connectToMongo();

// routes for the user -> login and register
app.use("/api/auth", require("./routes/authRouter"));

// routes for the notes -> create, update, read and delete
app.use("/api/notes", require("./routes/noteRouter"));

// route for the contact us form 
app.use("/api", require("./routes/messageRouter"));

// joins the backend with the static files in build folder
app.use(express.static(path.join(__dirname, "../client/build")));

// serves the static files
app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, "../client/build/index.html"))
})

// starts the server
app.listen(PORT, (req, res)=>{
})
