const Article = require("./../../models/article");
const Category = require("./../../models/caregory");
const sharp = require("sharp");
const shortid = require("shortid");
const { salert, salertAndBack } = require("./../../utils/alert");
const fs = require('fs');
const path = require('path');

exports.index = async (req, res) => {
  let page = req.query.page || 1;
  const articles = await Article.paginate(
    {},
    { page, limit: 10, sort: { updatedAt: -1 },populate:[{path:"category",select:"title"},{path:"user",select:"username"}] }
  );
  res.render("admin/articles/index", { pageTitle: "مقاله ها", articles });
};

exports.createPage = async (req, res) => {
  const categories = await Category.find({});
  res.render("admin/articles/create", {
    pageTitle: "مقاله ها",
    categories,
    oldValue: req.flash("oldValue")[0],
  });
};

exports.store = async (req, res) => {
  const errorArr = [];
  try {
    await Article.articleValidation(req.body);
    await Article.create({ ...req.body, user: req.user.id });
    salert(req, {
      title: "موفقیت آمیز بود",
      message: [{ name: "موفقیت", message: "مقاله شما با موفقیت ایجاد شد" }],
      icon: "success",
      button: "تایید",
    });
    res.redirect("/admin/articles");
  } catch (err) {
    console.log(err)
    err.inner.forEach((e) => {
      errorArr.push({ name: e.name, message: e.message });
    });
    salert(req, {
      title: "خطا",
      message: errorArr,
      icon: "error",
      button: "تایید",
    });
    req.flash("oldValue", req.body);
    res.redirect(req.header("Referer") || "/");
  }
};

exports.editPage = async (req, res) => {
  const article = await Article.findById(req.params.id);
  const categories = await Category.find({});

  if (!article) return res.redirect("/404");

  res.render("admin/articles/edit", {
    pageTitle: "ویرایش مقاله",
    article,
    categories,
    oldValue: req.flash("oldValue")[0],
  });
};

exports.update = async (req, res) => {
  const errorArr = [];
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.redirect("/404");

  if(req.body.thumbnail==""){
    console.log("matinnnn")
    req.body.thumbnail = article.thumbnail
  }    
  console.log(req.body)
  console.log(article.thumbnail)

    await Article.articleValidation(req.body);
    await Article.findByIdAndUpdate(req.params.id,req.body);
    salert(req, {
      title: "موفقیت آمیز بود",
      message: [{ name: "موفقیت", message: "مقاله شما با موفقیت ویرایش شد" }],
      icon: "success",
      button: "تایید",
    });
    res.redirect("/admin/articles")
  } catch (err) {
    console.log(err)
    err.inner.forEach((e) => {
      errorArr.push({ name: e.name, message: e.message });
    });

    salert(req, {
      title: "خطا",
      message: errorArr,
      icon: "error",
      button: "تایید",
    });
    req.flash("oldValue", req.body);
    res.redirect(req.header("Referer") || "/");
  }
};


exports.editStatus = async(req,res)=>{
  const article = await Article.findById(req.params.id);
  if (!article) return res.redirect("/404");
  article.status = article.status == "visible"?"visible":"invisible";
  if(article.status == "visible" ){
    article.status = "invisible"
  }else{
    article.status = "visible"
  }
  await article.save();
  salert(req, {
    title: "موفقیت آمیز بود",
    message: [{ name: "موفقیت", message: "مقاله شما با موفقیت ویرایش شد" }],
    icon: "success",
    button: "تایید",
  });
  res.redirect("/admin/articles")
}


exports.delete = async (req,res)=>{
  const article = await Article.findById(req.params.id);
  if (!article) return res.redirect("/404");


  fs.unlinkSync(
    path.join(process.cwd(), "public", "uploads", "articleImages", article.thumbnail)
  );

  await article.remove();
  salert(req, {
    title: "موفقیت آمیز بود",
    message: [{ name: "موفقیت", message: "مقاله شما با موفقیت حذف شد" }],
    icon: "success",
    button: "تایید",
  });
  res.redirect("/admin/articles")

}



exports.ajaxImg = async (req, res) => {
  if (req.files.image.size > 4000000) {
    return res.status(400).json({
      address: "",
      message: "",
      name: "size error",
      error: "حجم عکس باید کمتر از 4 مگابایت باشد",
    });
  }
  if (req.files.image.mimetype != "image/jpeg") {
    return res.status(400).json({
      address: "",
      message: "",
      name: "ext error",
      error: "تنها پسوند JPEG پشتیبانی میشود",
    });
  }
  if (req.files) {
    const fileName = `${shortid.generate()}_${req.files.image.name}`;
    await sharp(req.files.image.data)
      .jpeg({
        quality: 60,
      })
      .toFile(`./public/uploads/articleImages/${fileName}`)
      .catch((err) => {
        console.log(err);
      });
    console.log(`${process.env.DOMAIN}/uploads/articleImages/${fileName}`);
    return res.status(200).json({
      address: `${process.env.DOMAIN}/uploads/articleImages/${fileName}`,
      fileName: fileName,
      message: "آپلود عکس موفقیت آمیز بود",
      name: "success",
      error: "",
    });
  } else {
    res.send("ابتدا عکس خود را انتخاب کنید");
  }
};
