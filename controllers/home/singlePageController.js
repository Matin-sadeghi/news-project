const Article = require("../../models/article");
const Category = require("../../models/caregory");
const Menu = require("../../models/menu");
const Comment = require('./../../models/comment')
const {salert,salertAndBack} = require('./../../utils/alert');

const { formatDate } = require("../../utils/moment");

exports.single = async (req, res) => {
    const article = await Article.findById(req.params.id).populate([{path:"comments",options: { sort: { createdAt: -1 } },match:{parent:null,approved:true},populate:[{path:"user",select:"username"}]}]).exec();
    //return res.json(article)
    article.viewCount += 1;
    await article.save();
    const categories = await Category.find({});
    const category = await Category.findById(article.category);
    const articles = await Article.find({ category: category._id });
    const populateArticles = await Article.find({ status: "visible" })
      .sort({ viewCount: -1 })
      .limit(5);
    const lastArticles = await Article.find({ status: "visible" })
      .sort({ updatedAt: -1 })
      .limit(9);
  
    res.render("home/single", {
      pageTitle: "تک صفحه ای",
      categories,
      populateArticles,
      category,
      articles,
      lastArticles,
      article,
      formatDate,
    });
  };

  
exports.storeComment= async(req,res)=>{
    const article = await Article.findById(req.params.articleId);
    await Comment.create({body:req.body.body,user:req.user._id,article:req.params.articleId})
    salert(req, {
      title: "موفقیت آمیز بود",
      message: [{ name: "موفقیت", message: "کامنت شما با موفقیت ثبت شد" }],
      icon: "success",
      button: "تایید",
    });
    res.redirect(req.header("Referer") || "/");

}