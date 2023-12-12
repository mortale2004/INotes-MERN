const User = require("../models/User");
const express = require("express")
const router = express.Router();

// to validate the data provided by the user
const { body, validationResult } = require("express-validator");

// to hash the password of the user which will protect from hackers
const bcrypt = require("bcryptjs");

// to create and verify authentication token for each user
const jwt = require("jsonwebtoken");

// middleware for checking authentication of user
const getuser = require("../middleware/getuser");

// imports env file which contain the secret code to make authentication token more strong
require("dotenv").config()

// store JWT_SECRET from environment variable to JWT_SECRET variable
const JWT_SECRET = process.env.JWT_SECRET;

//Route -> 1 : Method-> POST :  User Registration End Point - Sign In Not Required: 'api/auth/register'
router.post("/register",

    // validation of data from user to register
    [
        body("name", "Enter A Valid Name").isLength({ min: 1 }),
        body("email", "Enter A Valid Email").isEmail(),
        body("password", "Minimum Password Must Be 8 Letters").isLength({ min: 7 })
    ],
    async (req, res) => {

        // if user sent invalid data
        if (!validationResult(req).isEmpty()) {
            return res.status(400).json({ status: "error", msg: validationResult(req).errors.map(m => m.msg) });
        }

        try {
            // store name and email by using destructuring syntax
            const { name, email } = req.body;

            // is email exist already in the database for the unique email to each user 
            const user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ status: "error", msg: ["This Email Already Exist! Choose Another Email."] });
            }
            else {

                // generates the salt to make hash more powerful
                const salt = await bcrypt.genSalt(10);

                // creates the hash with combination of salt and password of user
                const password = await bcrypt.hash(req.body.password, salt);

                // creates the user and store in the database
                const newUser = await User.create({ name, email, password });

                // payload to add in the authtoken
                const data = {
                    user: {
                        id: newUser.id
                    }
                }

                // authToken with header, payload and signature
                const authToken = jwt.sign(data, JWT_SECRET);

                // gives the response to the user i.e. authToken 
                return res.status(200).json({ status: "success", msg: [authToken] });
            }
        }
        catch (error) {
            // in case of unexpected error - Internal Server Error
            console.log(error.message);
            return res.status(500).json({ status: "error", msg: ["Internal Server Error"] });
        }
    });

//Route -> 2  : Method-> GET :  User Login End Point - Sign In Not Required: 'api/auth/login'
router.post("/login",
    [
        // validation of data from user to login
        body("email", "Enter Valid Email").isEmail(),
        body("password", "Enter Valid Password").isLength({ min: 7 }),
    ],
    async (req, res) => {

        // if user sent invalid data
        if (!validationResult(req).isEmpty()) {
            return res.status(400).json({ status: "error", msg: validationResult(req).errors.map(m => m.msg) })
        }

        try {
            // store name and email by using destructuring syntax
            const { email, password } = req.body;


            // searches the user in the database with email given by the user
            const user = await User.findOne({ email });

            // if it is not present in the database then restrict user.
            if (!user) {
                return res.status(200).json({ status: "error", msg: ["Please Enter Correct Email/Password"] });
            }

            // compare the password entered by the user and hash password stored in the database and assigns the result the variable
            const isPasswordMatch = await bcrypt.compare(password, user.password);

            // is password is not matched then restrict user.
            if (!isPasswordMatch) {
                return res.status(200).json({ status: "error", msg: ["Please Enter Correct Email/Password"] });
            }

            // payload to add in the authtoken
            const data = {
                user: {
                    id: user.id
                }
            }

            // authToken with header, payload and signature
            const authToken = jwt.sign(data, JWT_SECRET);

            // gives the response to the user i.e. authToken 
            return res.status(200).json({ status: "success", msg: [authToken] });


        }
        catch (error) {
            // in case of unexpected error - Internal Server Error
            console.log(error.message);
            return res.status(500).json({ status: "error", msg: ["Internal Server Error"] })
        }

    });



//Route -> 3 : METHOD: POST :  Retrieve User - Sign In Required: 'api/auth/getuser'
router.post("/getuser",

    // Middleware functioon to check Authentication of the user
    getuser,
    async (req, res) => {

        // store the id of the user in the id variable which is extracted from auth tokenn
        const id = req.user.id;
        try {

            // retrieves user from the database except the password of the user 
            const user = await User.findOne({ _id: id }).select("-password");

            // if user not found then response for that is sent
            if (!user) {
                return res.status(404).json({ status: "error", msg: ["User Not Found"] });
            }

            // if user find then the data of that user is sent in reponse
            return res.status(200).json({ status: "success", msg: user })

        } catch (error) {
            // in case of unexpected error - Internal Server Error
            console.log(error.message);
            return res.status(500).json({ status: "error", msg: ["Internal Server Error"] })
        }
    })

module.exports = router;

