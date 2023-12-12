const jwt = require("jsonwebtoken");
require("dotenv").config();

// stores the jwt_secret string from the environment variable to JWT_SECRET variable
const JWT_SECRET = process.env.JWT_SECRET;

// It is middlewawre function to check authentication of the user using authToken in the header 
const getuser = (req, res, next)=>{

    // store the auth-token from the header to authToken variable  
    const authToken = req.header("auth-token"); 

    // if user doen't provide authToken then access denied (Unauthorized user)
    if (!authToken)
    {
        res.status(401).json({status:"error", msg:"Access Denied Please Login Again"});
    }
    
    try {
        // extracts data from authToken and store in data variable
        const data = jwt.verify(authToken, JWT_SECRET);

        // send the user object in the request 
        req.user = data.user;

        // call next function in the route
        next();
        
    } catch (error) {
        // if any error occurs in authToken then access denied (Unauthorized user)
        console.log(error.message);
        res.status(401).json({status:"error", msg:"Access Denied Please Login Again"});
    }

}

module.exports = getuser;