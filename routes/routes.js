const express = require("express");

const pages = require(__dirname + "/../controllers/pageController.js");

const router = express.Router();

router.get("/", pages.homeView);
router.get("/about",  pages.aboutView);

router.post("/", pages.addTask);
router.put('/done/:taskID', pages.finishTask);


module.exports = router;