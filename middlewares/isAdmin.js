exports.isAdmin = (req, res, next) => {
  if ((req.isAuthenticated()&&req.user.permisson == "admin")) {
    return next();
  } else {
    res.redirect("/404");
  }
};
