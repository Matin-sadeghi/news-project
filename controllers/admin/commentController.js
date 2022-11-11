const Comment = require('./../../models/comment')
const { salert, salertAndBack } = require("./../../utils/alert");

exports.index = async(req,res)=>{
    let page = req.query.page || 1;
    const comments = await Comment.paginate(
      {},
      { page, limit: 10, sort: { createdAt: -1 },populate:[{path:"user",select:"username"},{path:"article",select:"title"}] }
    );
    res.render("admin/comments/index", { pageTitle: "کامنت ها", comments });
}

exports.editStatus = async(req,res)=>{
  const comment = await Comment.findById(req.params.id);

  comment.approved = comment.approved==false?true:false
    await comment.save()
  salert(req, {
    title: "موفقیت آمیز بود",
    message: [{ name: "موفقیت", message: "وضعیت کامنت با موفقیت ویرایش شد" }],
    icon: "success",
    button: "تایید",
  });
  res.redirect(req.header("Referer") || "/");

}

exports.delete = async(req,res)=>{
  const comment = await Comment.findById(req.params.id);
  await comment.delete();
  salert(req, {
    title: "موفقیت آمیز بود",
    message: [{ name: "موفقیت", message: "کامنت با موفقیت حذف شد" }],
    icon: "success",
    button: "تایید",
  });
  res.redirect(req.header("Referer") || "/");

}