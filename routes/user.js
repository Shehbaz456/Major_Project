const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");

const userController = require("../controllers/users")

// signup Form & signup 
router.route("/signup")
.get(userController.RenderSignUpForm)
.post(wrapAsync(userController.SignUp))

// Login Form & Login
router.route("/login")
.get(userController.RenderLoginForm)
.post(saveRedirectUrl, passport.authenticate('local', { failureRedirect: '/login' , failureFlash:true }),
userController.Login
)

// LogOut
router.get("/logout",userController.LogOut);


module.exports = router;