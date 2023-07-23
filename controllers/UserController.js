const asyncHandler=require("express-async-handler");
const User=require("../models/UserModel");
const generateToken=require("../config/generateToken");

// get or search all users

const allUsers=asyncHandler(async(req,res)=>{
  console.log("enter node allUsers");
    const keyword=req.query.search!==undefined?{
        $or:[
            {name:{$regex:req.query.search,$options:"i"}},
            {email:{$regex:req.query.search,$options:"i"}},
        ]
    }:{};
    // console.log("keyword : ",req.query.search);
    let users=await User.find(keyword);
    users=users.filter((val)=>{
      return val._id.toString()!==req.user._id.toString();
    })
    res.status(200).json({
        message:"getting all users",
        data:users
    })
});

// register new user

const registerUser = asyncHandler(async (req, res) => {
  // console.log("enter registerUser");
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name:name,
    email:email,
    password:password,
    pic:pic,
  });

  if (user) {
    var token= generateToken(user._id);
    res.status(201).json({
        message:"register success",
        data:user,
        token:token,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

// auth the user

const authUser = asyncHandler(async (req, res) => {
  // console.log("login user enter");
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    var token= generateToken(user._id);

    res.cookie("userchatcookie",token,{
      expires:new Date(Date.now()+9000000),
      httpOnly:true
    });

    res.status(200).json({
        message:"login success",
        data:user,
        token:token,
    });

  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const logout=async(req,res)=>{
  try {
    console.log("logout");
    res.clearCookie("userchatcookie",{path:'/'});
  } catch (error) {
    console.log(error);
  }
}

module.exports = { allUsers, registerUser, authUser,logout };