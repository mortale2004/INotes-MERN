const express = require("express");
const router = express.Router();
const {body, validationResult} = require("express-validator");
const Message = require("../models/Message");
const getuser = require("../middleware/getuser");


//Route -> 1 : Method-> POST :  Contact Us End Point - Sign In Required: 'api/message'
router.post("/message", 

    // Middleware function to check Authentication of the user
getuser,

    // validation of data from user to register
[
    body("name", "Minimum 2 Characters Required").isLength(2),
    body("mobile", "Mobile Number Should be 10 Digit").isLength({min: 10, max: 10}),
    body("message", "Minimum Message Length Must Be 5").isLength(5)
]
, async (req, res)=>{

    
    // if user sent invalid data
    if (!validationResult(req).isEmpty())
    {
        return res.status(401).json({status: "error", msg: validationResult(req).errors.map(m=> m.msg)})
    }

    try {
        
        // store the data of request into separate variables
        const {name, mobile, message} = req.body;
        
        // store the id in the user which is extracted after authorization of the user
        const user = req.user.id;

        // this will create a new message
        const storedMessage = await Message.create({user, name, mobile, message})

        // send the response after message creation
        return res.status(200).json({status: "success", msg:["Message Sent Successfully"]});
    } catch (error) {

        // in case of unexpected error - Internal Server Error
        console.log(error.message);
        return res.status(500).json({ status: "error", msg: ["Internal Server Error"] });
    }
});

module.exports = router;