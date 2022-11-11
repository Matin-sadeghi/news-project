const e = require("connect-flash");
const Category = require("./../../models/caregory");
const Article = require("./../../models/article");
const fs = require('fs')
const path = require('path')


const { salert, salertAndBack } = require("./../../utils/alert");
const {persianSlug} = require('./../../utils/slug');

exports.index = async (req, res) => {
  let page = req.query.page || 1;
  const categories = await Category.paginate({}, { page, limit: 10, sort:{updatedAt:-1} });
  res.render("admin/categories/index", { pageTitle: "دسته بندی ها",categories });
};

exports.createPage = async (req,res)=>{
  res.render("admin/categories/create", { pageTitle: "ایجاد دسته بندی ها",oldValue:req.flash("oldValue")[0] });
}

exports.create = async(req,res)=>{
  const errorArr = [];
  try {
    await Category.categoryValidation(req.body);
    let {title,slug} =req.body;
    slug = persianSlug(slug);

    const category = await Category.findOne({slug});
    if(category){
      salert(req,{title:"خطا",message:[{ name:"خطا",message: "اسلاگ تکراری وارد کردید"}],icon:"error",button:"تایید"})
      req.flash("oldValue",req.body)
      return res.redirect(req.header("Referer") || "/");
    }

   await Category.create({title,slug});
   salert(req,{title:"موفقیت آمیز بود",message:[{ name:"موفقیت آمیز بودن",message: "دسته بندی شما با موفقیت ایجاد شد"}],icon:"success",button:"تایید"})
   res.redirect("/admin/categories")
   
  } catch (err) {
    err.inner.forEach(e => {
      errorArr.push({name:e.path,message:e.message})
    }); 

   salert(req,{title:"خطا",message:errorArr,icon:"error",button:"تایید"})
   req.flash("oldValue",req.body)

   res.redirect(req.header("Referer") || "/");

  }
}

exports.editPage= async(req,res)=>{
  const category = await Category.findById(req.params.id);
  if(!category) {return res.redirect("/404")}
  res.render("admin/categories/edit",{pageTitle:"ویرایش دسته بندی",category,oldValue:req.flash("oldValue")[0]})
}
exports.update = async(req,res)=>{
  const category = await Category.findById(req.params.id);
  if(!category) {return res.redirect("/404")}
  const errorArr = [];
  try {
    await Category.categoryValidation(req.body);
    let {title,slug} =req.body;
    let oldSlug = category.slug
    slug = persianSlug(slug);

    const categorySlug = await Category.findOne({slug});
    if(oldSlug!=slug&&categorySlug){
      salert(req,{title:"خطا",message:[{ name:"خطا",message: "اسلاگ تکراری وارد کردید"}],icon:"error",button:"تایید"})
      req.flash("oldValue",req.body)
      return res.redirect(req.header("Referer") || "/");
  }
  category.title = title;
  category.slug = slug;
  await category.save();
   salert(req,{title:"موفقیت آمیز بود",message:[{ name:"موفقیت آمیز بودن",message: "دسته بندی شما با موفقیت ویرایش شد"}],icon:"success",button:"تایید"})
   res.redirect("/admin/categories")
   
  } catch (err) {
    err.inner.forEach(e => {
      errorArr.push({name:e.path,message:e.message})
    }); 

   salert(req,{title:"خطا",message:errorArr,icon:"error",button:"تایید"})
   req.flash("oldValue",req.body)

   res.redirect(req.header("Referer") || "/");

  }


}


exports.delete = async(req,res)=>{
  const category = await Category.findById(req.params.id);
  if(!category) {return res.redirect("/404")}
  //
  const articles = await Article.find({category:category._id});

  articles.forEach(async article => {
    
  fs.unlinkSync(
    path.join(process.cwd(), "public", "uploads", "articleImages", article.thumbnail)
  );

  await article.remove();

  });

  await category.remove();
  salert(req,{title:"موفقیت آمیز بود",message:[{ name:"موفقیت آمیز بودن",message: "دسته بندی شما با موفقیت حذف شد"}],icon:"success",button:"تایید"})
  res.redirect(req.header("Referer") || "/");

}