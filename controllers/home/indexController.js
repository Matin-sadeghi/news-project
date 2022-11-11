const Article = require("../../models/article");
const Category = require("../../models/caregory");
const Menu = require("../../models/menu");

const { formatDate } = require("../../utils/moment");

exports.index = async (req, res) => {
  const articles = await Article.find({ status: "visible" }).sort({
    updatedAt: -1,
  });

  const categories = await Category.find({});
  const articleForCategory0 = await Article.find({
    status: "visible",
    category: categories[0]._id,
  }).populate([{ path: "user", select: "username" }]);
  const articleForCategory1 = await Article.find({
    status: "visible",
    category: categories[1]._id,
  }).populate([{ path: "user", select: "username" }]);
  const articleForCategory2 = await Article.find({
    status: "visible",
    category: categories[2]._id,
  }).populate([{ path: "user", select: "username" }]);
  const populateArticles = await Article.find({ status: "visible" })
    .sort({ viewCount: -1 })
    .limit(5);
  const lastArticles = await Article.find({ status: "visible" })
    .sort({ updatedAt: -1 })
    .limit(9);

  const menus = await Menu.find({});
  res.render("home/index", {
    pageTitle: "اینجا خبر",
    menus,
    categories,
    articles,
    articleForCategory0,
    articleForCategory1,
    articleForCategory2,
    populateArticles,
    lastArticles,
    formatDate,
  });
};


exports.catSearch = async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  const categories = await Category.find({});
  if (!category) return res.redirect("/404");
  const populateArticles = await Article.find({ status: "visible" })
    .sort({ viewCount: -1 })
    .limit(5);
  const lastArticles = await Article.find({ status: "visible" })
    .sort({ updatedAt: -1 })
    .limit(9);
  const articles = await Article.find({ category: category._id });
  res.render("home/catSearch", {
    pageTitle: "دسته بندی",
    lastArticles,
    populateArticles,
    articles,
    category,
    categories,
  });
};
