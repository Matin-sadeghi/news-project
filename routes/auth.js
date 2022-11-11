const express = require("express");

//controller
const userController = require('./../controllers/auth/userController');
const router = express.Router();
router.use((req , res , next) => {
  res.locals.layout = "layouts/authLayout";
  next();
})

// Login Page
// route GET /users/login
router.get("/login",userController.login);


//Login handler
//route post /users/login
router.post("/login",userController.handleLogin,userController.rememberMe);

// register Page
// route GET /users/register
router.get("/register",userController.register);

// register prosess
// route post /users/register
router.post("/register",userController.createUser);

// forget password page
// route GET /users/forget-password
router.get("/forget-password",userController.forgetPassword);

//handle forget password 
// route POST /users/forget-password
router.post("/forget-password",userController.handleForgetPassword);

// reset password page
// route GET /users/reset-password/:token
router.get("/reset-password/:token",userController.resetPassword);

// reset password handler
// route POST /users/reset-password/:token/:id
router.post("/reset-password/:token/:id",userController.resetPasswordHandle)

//logout 
//route GET /users/logout
router.get("/logout",userController.logout)

module.exports = router
