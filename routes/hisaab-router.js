const express = require('express');
const router = express.Router();


const { isLoggedIn, redirectIfLoggedIn } = require('../middlewares/auth-middlewares');
const { createhisaabController, hisaabPageController, readHisaabController, deleteController, editController, editPostController, verifyHisaabController } = require('../controllers/hisaab-controller');

router.get("/create" , isLoggedIn , hisaabPageController)
router.get(`/view/:id`, isLoggedIn , readHisaabController);
router.get(`/delete/:id`, isLoggedIn, deleteController);
router.get(`/edit/:id`, isLoggedIn , editController);



router.post("/create" , isLoggedIn , createhisaabController );
router.post("/edit/:id", isLoggedIn , editPostController);
router.post("/verify/:id", isLoggedIn , verifyHisaabController)

module.exports = router;    