const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:user
    },
    targetRole:{
        type:String,
    },
    experienceLevel:{
        type:String,
    },
    skills:{
        type:String,
    },
    isVerified:{
        type:String,
    },
    refreshToken:{
        type:String,
    },
    createdAt,
    updatedAt
});

const userModel = mongoose.model("user",userSchema);
module.exports = userModel;