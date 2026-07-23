const userModel = require("../models/user.model");

/*
*user register controller
*POST /api/auth/register
*/

function userRegisterController(req, res) {
    
    const {fullName, email, password, avatar, targetRole, experienceLevel, skills} = req.body;

}