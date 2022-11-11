const express = require("express");
const router = express.Router();

const indexController = require("../controllers/home/indexController");
const singlePageController = require("../controllers/home/singlePageController");


//GET route /
//index page

router.get("/", indexController.index);

//GET route /single/:id
//single page
router.get("/single/:id", singlePageController.single);

//GET route /categories/:slug
//category page
router.get("/categories/:slug",indexController.catSearch)

//POST route /comments/:articleId
// create comment
router.post("/comments/:articleId",singlePageController.storeComment)


module.exports = router;
