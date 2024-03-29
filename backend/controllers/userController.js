const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, picture } = req.body;

    // Regular expression for email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@email\.com$/;

    // Check if the email matches the desired format
    if (!emailRegex.test(email.toLowerCase())) {
        res.status(400);
        throw new Error("Invalid email format. Please use the format john@email.com");
    }

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all required fields");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({ name, email, password, picture });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: user.picture,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error("Failed to create the User");
    }
});


//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
  
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        picture: user.picture,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid Email or Password");
    }
  });
  
//   /api/user?search=hari
 //@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
      const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }); 
      res.send(users);
      console.log(users);
    });
module.exports = {registerUser,loginUser, allUsers}