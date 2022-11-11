const router = require("express").Router();
const indexController = require("../controllers/admin/indexController");
const categoryController = require("../controllers/admin/categoryController");
const articleController = require('./../controllers/admin/articleController');
const menuController = require('./../controllers/admin/menuController');
const commentController = require('./../controllers/admin/commentController');
const userController = require('./../controllers/admin/userController');

const {isAdmin} = require('../middlewares/isAdmin');
const { route } = require("./home");
router.use((req, res, next) => {
  res.locals.layout = "layouts/adminLayout";
  next();
});


// GET route / 
//index Page
router.get("/",isAdmin ,indexController.index);



//CATEGORY
//GET route admin/categories
// categoires page
router.get("/categories", isAdmin,categoryController.index);

//GET route admin/categories/create
// create categoires page 
router.get("/categories/create", isAdmin,categoryController.createPage);

//POST route admin/categories/create
// create categoires  
router.post("/categories/create", isAdmin,categoryController.create);


//GET route admin/categories/edit/:id
// edit categoires page 
router.get("/categories/edit/:id", isAdmin,categoryController.editPage);


//PUT route admin/categories/update/:id
// update categoires  
router.put("/categories/update/:id", isAdmin,categoryController.update);



//DELETE route admin/categories/delete/:id
// delete category
router.delete("/categories/delete/:id",isAdmin,categoryController.delete)


//ARTICLE
//GET route admin/articles
// categoires page
router.get("/articles", isAdmin,articleController.index);

//GET route admin/articles/create
// create categoires page 

router.get("/articles/create", isAdmin,articleController.createPage);

//POST route admin/articles/create
// create categoires  
router.post("/articles/create", isAdmin,articleController.store);


//GET route admin/articles/edit/:id
// edit categoires page 
router.get("/articles/edit/:id", isAdmin,articleController.editPage);

//GET route admin/articles/edit/status/:id
// edit categoires page 
router.get("/articles/edit/status/:id", isAdmin,articleController.editStatus);



//PUT route admin/articles/update/:id
// update categoires  
router.put("/articles/update/:id", isAdmin,articleController.update);



//DELETE route admin/categories/delete/:id
// delete category
router.delete("/articles/delete/:id",isAdmin,articleController.delete)


//MENU
//GET route admin/menus
// menus page
router.get("/menus",isAdmin,menuController.index)

//GET route admin/create
// menus create page
router.get("/menus/create",isAdmin,menuController.createPage)

//POST route admin/create
// menus create 
router.post("/menus/create",isAdmin,menuController.store)


//GET route admin/edit/:id
// edit menus page
router.get("/menus/edit/:id",isAdmin,menuController.editPage)  

//GET route admin/update/:id
// update menus 
router.put("/menus/update/:id",isAdmin,menuController.update)  

//GET route admin/delete/:id
// delete menus 
router.delete("/menus/delete/:id",isAdmin,menuController.delete)

//COMMENT

//GET route admin/comments
// comments page
router.get("/comments",isAdmin,commentController.index)

// GET route admin/comments/edit/:id
// edit status of comment
router.get("/comments/edit/:id",isAdmin,commentController.editStatus)
//DELETE route admin/comments/delete/:id
// delete comment
router.delete("/comments/delete/:id",isAdmin,commentController.delete)


//USER
// GET route admin/users
// users index page
router.get("/users",isAdmin,userController.index)

// GET route admin/users/toggle/:id
// users toggle admin
router.get("/users/toggle/:id",isAdmin,userController.toggleAdmin)

//DELETE route admin/users/delete/:id
// delete users
router.delete("/users/delete/:id",isAdmin,userController.delete)




//AJAX
router.post("/ajax-imgUplod",isAdmin,articleController.ajaxImg)

module.exports = router;
