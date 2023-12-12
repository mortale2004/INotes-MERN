const express = require("express");
const router = express.Router();
const { validationResult, body } = require("express-validator");
const getuser = require("../middleware/getuser");
const Note = require("../models/Note");
require("dotenv").config();



//Route -> 1 : METHOD-> POST:  New Note Adding End Point - Sign In Required: '/api/notes/addnote'
router.post("/addnote",
    // Middleware function to check Authentication of the user
    getuser,

    // validation of data from user to add new note
    [
        body("title", "Minimum Title Length Must Be 2").isLength(2),
        body("description", "Minimum Description Length Must Be 3").isLength(3),
    ],
    async (req, res) => {

        // if user sent invalid data
        if (!validationResult(req).isEmpty()) {
            return res.status(401).json({ status: "error", msg: validationResult(req).errors.map(m => m.msg) });
        }

        // store the data of request into separate variables
        const { title, description, tag } = req.body;

        // store the id in the user which is extracted after authorization of the user
        const user = req.user.id;

        try {
            // this will create a new note 
            const note = await Note.create({ user, title, description, tag });

            // send the created note into the response
            return res.status(200).json({ status: "success", msg: ["Note Added Successfully"] });

        } catch (error) {

            // in case of unexpected error - Internal Server Error
            console.log(error.message);
            return res.status(500).json({ status: "error", msg: ["Internal Server Error"] });
        }
});



//Route -> 2 :  Retrieve All Notes End Point - Sign In Required: '/api/notes/getnotes'
router.get("/getnotes",
    // Middleware functioon to check Authentication of the user
    getuser,
    async (req, res) => {

        // store the id in the user which is extracted after authorization of the user
        const user = req.user.id;

        try {
            // retrieve all notes of the user with it's id
            const notes = await Note.find({ user });

            // send the retrieved notes into the response  
            return res.status(200).json({ status: "success", msg: notes });
        } catch (error) {

            // in case of unexpected error - Internal Server Error
            console.log(error.message);
            return res.status(500).json({ status: "error", msg: "Internal Server Error" });
        }
});


//Route -> 3 :  Update Note End Point - Sign In Required: '/api/notes/updatenote/:id'
router.put("/updatenote/:id",

    // Middleware function to check Authentication of the user
    getuser,

    // validation of data from user to update the note
    [
        body("title", "Minimum Title Length Must Be 2").isLength(2),
        body("description", "Minimum Description Length Must Be 3").isLength(3),
    ],
    async (req, res) => {

        // validation of data from user to add new note
        if (!validationResult(req).isEmpty()) {
            return res.status(401).json({ status: "error", msg: validationResult(req).errors.map(m => m.msg) });
        }

        // store the data of request into separate variables
        const { title, description, tag } = req.body;

        // store the id in the user which is extracted after authorization of the user
        const user = req.user.id;

        try {

            // search the note in the database using id provided in the put request
            const note = await Note.findById(req.params.id);

            // if id in the note and the id in the authToken of user is not matching then access denied to update note of another user
            if (note.user.toString() !== user) {
                return res.status(401).json({ status: "error", msg: ["Access Denied"] });
            }

            // store note retrieved from database in the updatedNote variable 
            let updatedNote = note;
            // if user have updated the value of title, description and tag then it's value is changed otherwise no change 
            if (title) updatedNote.title = title;
            if (description) updatedNote.description = description;
            if (tag) updatedNote.tag = tag;

            // searches note in the database by using id provided by the id in the put request and udpate it with updatedNote
            await Note.findByIdAndUpdate(req.params.id, updatedNote);

            // send the updated note in the response  
            return res.status(200).json({ status: "success", msg: ["Note Updated Successfully"] });
        } catch (error) {
            
            // in case of unexpected error - Internal Server Error
            console.log(error.message);
            return res.status(500).json({ status: "error", msg: ["Internal Server Error"] });
        }
});



//Route -> 4 :  Delete Note End Point - Sign In Required: '/api/notes/deletenote/:id'
router.post("/deletenote/:id",

    // Middleware functioon to check Authentication of the user
    getuser,
    async (req, res) => {

        try {
            
            // store the id in the user which is extracted after authorization of the user
            const user = req.user.id;

            // search the note in the database using id provided in the post request
            let note = await Note.findById(req.params.id);

            // if id in the note and the id in the authToken of user is not matching then access denied to update note of another user
            if (note.user.toString() !== user) {
                return res.status(401).json({ status: "error", msg: "Access Denied" });
            }

            // searches note in database and delete it by using the id given in the parameters of post request 
            note = await Note.findByIdAndDelete(req.params.id);
            
            // send the deleted note in the response  
            return res.status(200).json({ status: "success", msg: ["Note Deleted Successfully"] });
        } catch (error) {

            // in case of unexpected error - Internal Server Error
            console.log(error.message);
            return res.status(500).json({ status: "error", msg: ["Internal Server Error"] });
        }
});

module.exports = router;
