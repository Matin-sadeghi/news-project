const { salert, salertAndBack } = require("./../../utils/alert");
const User = require("./../../models/user");
const passport = require("passport");
const jwt = require('jsonwebtoken');
const {sendEmail} =require('./../../utils/mailer');

exports.login = (req, res) => {
  res.render("auth/login", { pageTitle: "ورود", error: req.flash("error") });
};

exports.handleLogin = async (req, res, next) => {
  const errorArr = [];
  try {
    await User.userValidationLogin(req.body);

    passport.authenticate("local.login", {
      failureFlash: true,
      failureRedirect: "/users/login",
    })(req, res, next);
  } catch (err) {
    console.log(err);
    err.inner.forEach((e) => {
      errorArr.push({ name: e.path, message: e.message });
    });
    salert(req, {
      title: "خطا",
      message: errorArr,
      icon: "error",
      button: "تایید",
    });
    res.redirect("/users/login");
  }
};

exports.rememberMe = (req, res) => {
  if (req.body.rememberMe) {
    req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000;
  } else {
    req.session.cookie.expires = null;
  }
  res.redirect("/");
};

exports.register = (req, res) => {
  res.render("auth/register", { pageTitle: "ثبت نام" });
};

exports.createUser = async (req, res) => {
  const errorArr = [];
  try {
    await User.userValidation(req.body);
    const { username, email, password, confirmPassword } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      errorArr.push({
        name: "ایمیل تکراری",
        message: "شما قبلا ثبت نام کردید",
      });
      salert(req, {
        title: "خطا",
        message: errorArr,
        icon: "error",
        button: "تایید",
      });
      return res.redirect("/users/register");
    } else {
      await User.create({ username, email, password });

      salert(req, {
        title: "تبریک",
        message: [
          {
            name: "کاربر با موفقیت ثبت نام کرد",
            message: "ثبت نام شما موفقیت آمیز بود",
          },
        ],
        icon: "success",
        button: "تایید",
      });
      res.redirect("/users/login");
    }
  } catch (err) {
    err.inner.forEach((e) => {
      errorArr.push({ name: e.path, message: e.message });
    });

    salert(req, {
      title: "خطا",
      message: errorArr,
      icon: "error",
      button: "تایید",
    });
    res.redirect("/users/register");
  }
};

exports.forgetPassword = (req, res) => {
  res.render("auth/forget-password", { pageTitle: "فراموشی کلمه عبور" });
};

exports.handleForgetPassword = async (req, res) => {

  const { email } = req.body;
  const user = await User.findOne({ email });
  if(!user){
     salert(req, {
      title: "خطا",
      message: [{name:"خطا",message:"ایمیل وارد شده در پایگاه داده ثبت نشده"}],
      icon: "error",
      button: "تایید",
    });
    res.redirect("/users/forget-password");
  }else{
    const token = jwt.sign({userId:user._id},process.env.JWTSECRETKEY,{expiresIn:"1h"})

    const resetPasswordUrl = `http://localhost:3000/users/reset-password/${token}`;

    const emailText = `<a href=${resetPasswordUrl}>بازیابی کلمه عبور</a>`

    sendEmail(email,user.username,"فراموشی کلمه عبور",emailText);
    salert(req, {
      title: "موفقیت آمیز بود",
      message: [{name:"موفقیت",message:"ایمیل بازیابی کلمه عبور با موفقیت ارسال شد"}],
      icon: "success",
      button: "تایید",
    });
    res.redirect("/users/forget-password");
  }
};

exports.resetPassword = async(req,res)=>{
  const token = req.params.token;
  try {
      let decode =  jwt.decode(token);
      const verifyToken = jwt.verify(token,process.env.JWTSECRETKEY);
      res.render("auth/reset-password",{pageTitle:"بازیابی کلمه عبور",id:decode.userId,token})
  } catch (error) {
    res.redirect("/404")
  }
}

exports.resetPasswordHandle = async(req,res)=>{
  const token = req.params.token
  const id = req.params.id
  const newPassword = req.body.password;
  const confirmNwPassword = req.body.confirmPassword;

  if (newPassword.length < 4) {
    salert(req, {
      title: "خطا",
      message: [{name:"خطا",message:"کلمه عبور حداقل 4 کاراکتر است"}],
      icon: "error",
      button: "تایید",
    });
    res.redirect(`/users/reset-password/${token}`);
    return;
  }
  if(confirmNwPassword!=newPassword){
    salert(req, {
      title: "خطا",
      message: [{name:"خطا",message:"کلمه عبور و تکرار کلمه عبور تفاوت دارند"}],
      icon: "error",
      button: "تایید",
    });
    res.redirect(`/users/reset-password/${token}`);
    return;
  }

  const user = await User.findById(id);
  user.password = newPassword;
  await user.save();
  salert(req, {
    title: "موفقیت آمیز بود",
    message: [{name:"موفقیت آمیز",message:"کلمه عبور شما با موفقیت تغییر کرد"}],
    icon: "success",
    button: "تایید",
  });

  res.redirect("/users/login");



}


exports.logout = (req,res,next)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
}