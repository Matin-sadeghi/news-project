const Menu = require("./../../models/menu");
const { salert, salertAndBack } = require("./../../utils/alert");

exports.index = async (req, res) => {
  let page = req.query.page || 1;

  const menus = await Menu.paginate(
    {},
    {
      page,
      limit: 10,
      sort: { updatedAt: -1 },
      populate: [{ path: "parentId", select: "title" }],
    }
  );
  //return  res.json(menus)
  res.render("admin/menus/index", { pageTitle: "منو ها", menus });
};

exports.createPage = async (req, res) => {
  const menus = await Menu.find({ parentId: null });
  res.render("admin/menus/create", {
    pageTitle: "ایجاد منو",
    menus,
    oldValue: req.flash("oldValue")[0],
  });
};

exports.store = async (req, res) => {
  const errorArr = [];
  try {
    await Menu.menuValidation(req.body);

    const { title, url, parentId } = req.body;
    const menu = await Menu.findOne({ url });
    if (menu) {
      salert(req, {
        title: "خطا",
        message: [{ name: "خطا", message: "آدرس تکراری وارد کردید" }],
        icon: "error",
        button: "تایید",
      });
      req.flash("oldValue", req.body);
      return res.redirect(req.header("Referer") || "/");
    } else {
      await Menu.create({
        title,
        parentId: parentId != "none" ? parentId : null,
        url,
      });
      salert(req, {
        title: "موفقیت آمیز بود",
        message: [
          { name: "موفقیت آمیز بود", message: "منو شما با موفقیت ایجاد شد" },
        ],
        icon: "success",
        button: "تایید",
      });
      res.redirect("/admin/menus");
    }
  } catch (err) {
    console.log(err);
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
  const menu = await Menu.findById(req.params.id);
  const menus = await Menu.find({ parentId: null });
  res.render("admin/menus/edit", {
    pageTitle: "ویرایش منو",
    menus,
    menu,
    oldValue: req.flash("oldValue")[0],
  });
};

exports.update = async (req, res) => {
  const errorArr = [];
  try {
    await Menu.menuValidation(req.body);
    const menu = await Menu.findById(req.params.id);
    const { title, url, parentId } = req.body;
    const oldMenu = await Menu.findOne({ url });
    if (url != menu.url && oldMenu) {
      salert(req, {
        title: "خطا",
        message: [{ name: "خطا", message: "آدرس تکراری وارد کردید" }],
        icon: "error",
        button: "تایید",
      });
      req.flash("oldValue", req.body);
      return res.redirect(req.header("Referer") || "/");
    } else {
    
      await Menu.findByIdAndUpdate(req.params.id, {
        title,
        parentId: parentId != "none" ? parentId : null,
        url,
      });
      salert(req, {
        title: "موفقیت آمیز بود",
        message: [
          { name: "موفقیت آمیز بود", message: "منو شما با موفقیت ویرایش شد" },
        ],
        icon: "success",
        button: "تایید",
      });
      res.redirect("/admin/menus");
    }
  } catch (err) {
    console.log(err);
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

exports.delete = async(req,res)=>{
    const menu = await Menu.findById(req.params.id);
    if(!menu) return res.redirect("/404")
    if(menu.parentId==null){
        const subMenus = await Menu.find({parentId:menu._id})
        subMenus.forEach(async subMenu => {
            await subMenu.remove();
        });
    }

    await menu.remove();

    salert(req, {
        title: "موفقیت آمیز بود",
        message: [
          { name: "موفقیت آمیز بود", message: "منو شما با موفقیت حذف شد" },
        ],
        icon: "success",
        button: "تایید",
      });

    res.redirect(req.header("Referer") || "/");

}