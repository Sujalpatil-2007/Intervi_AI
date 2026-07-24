const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

/**
 * - user register controller
 * - POST /api/auth/register
 */

async function userRegisterController(req, res) {
  try{
    const {
    fullName,
    email,
    password,
    avatar,
    targetRole,
    experienceLevel,
    skills,
  } = req.body;

  if (!fullName || !email || !password) {
  return res.status(400).json({
    success: false,
    message: "Full name, email and password are required.",
  });
}

  const isExists = await userModel.findOne({
    email: email,
  });

  if (isExists) {
    return res.status(409).json({
      success: false,
      message: "User already exists with this Email.",
    });
  }

  const user = await userModel.create({
    fullName,
    email,
    password,
    avatar,
    targetRole,
    experienceLevel,
    skills,
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {expiresIn: "3d"});

  res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
});

  res.status(201).json({
    success:true,
    message:"User registered successfully",
    user:{
        _id:user._id,
        email:user.email,
        fullName:user.fullName,
        avatar:user.avatar,
        targetRole:user.targetRole,
        experienceLevel:user.experienceLevel,
        skills:user.skills,
    },
    token
  })
}catch(err){
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
}

}

/**
 *  - user login controller
 *  - POST /api/auth/login
 */

async function userLoginController(req, res) {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
  return res.status(400).json({
    success: false,
    message: "Email and password are required.",
  });
}

    const user = await userModel.findOne({email}).select("+password");

    if(!user){
        return res.status(401).json({
            success:false,
            message:"Email or password is INVALID"
        })
    }

    const isValidPassword = await user.comparePassword(password);

    if(!isValidPassword){
        return res.status(401).json({
            success:false,
            message:"Email or password is INVALID"
        })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {expiresIn: "3d"});

    res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    res.status(200).json({
    success:true,
    message:"User Login successfully",
    user:{
        _id:user._id,
        email:user.email,
        fullName:user.fullName,
        avatar:user.avatar,
        targetRole:user.targetRole,
        experienceLevel:user.experienceLevel,
        skills:user.skills,
    },
    token
  })
    } catch (err) {
        console.error(err);

        return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        });
    }
}

module.exports = {
  userRegisterController,
  userLoginController,
};
