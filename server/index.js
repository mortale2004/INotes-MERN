const express = require("express");
const app = express();
const connectToMongo = require("./db");
const cors = require("cors");
const path = require("path");


app.use(cors({
    origin: "https://inotes-ckzr.onrender.com"
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});


// port no
const PORT = process.env.PORT;

// to fetch json from the request of the user
app.use(express.json());

// function to connect with mongo database
connectToMongo();

// routes for the user -> login and register
app.use("/api/auth", require("./routes/authRouter"));

// routes for the notes -> create, update, read and delete
app.use("/api/notes/", require("./routes/noteRouter"));


app.use("/api/", require("./routes/messageRouter"));

  
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, "../client/build/index.html"))
})

// starts the server on the port no 5000
app.listen(PORT, (req, res)=>{
})
