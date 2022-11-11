const User = require('./../../models/user');
const Article = require("./../../models/article");
const fs = require('fs')
const path = require('path')
const { salert, salertAndBack } = require("./../../utils/alert");

exports.index = async (req,res)=>{
    let page = req.query.page ||1;
    const users = await User.paginate({},{ page, limit: 10, sort: { updatedAt: -1 }})
    res.render("admin/users/index",{pageTitle:"کاربران",users})

}

exports.toggleAdmin = async(req,res)=>{
    const user = await User.findById(req.params.id);
    user.permisson = user.permisson=="admin"?"user":"admin"
    await user.save()

    // salert(req, {
    //     title: "موفقیت آمیز بود",
    //     message: [{ name: "موفقیت", message: ` کاربر
    //     ${user.username} 
    //     از الان
    //     ${user.permisson}
    //     است
    //     ` }],
    //     icon: "success",
    //     button: "تایید",
    //   });
    



        salert(req, {
        title: "موفقیت آمیز بود",
        message: [{ name: "موفقیت", message: "عنوان کاربر با موفقیت تغییر کرد"}],
        icon: "success",
        button: "تایید",
      });

  res.redirect(req.header("Referer") || "/");



}


exports.delete =async (req,res)=>{
    const user = await User.findById(req.params.id);
    const userArticels = await Article.find({user:user._id});

    userArticels.forEach(async userArticel =>{
        fs.unlinkSync(
            path.join(process.cwd(), "public", "uploads", "articelImages", userArticel.thumbnail)
          );
        
       await userArticel.remove();
    })
    await user.remove();
}