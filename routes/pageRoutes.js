const express = require("express");
const router = express.Router();
const {getDuyurularPage, getLoginPage, getİndexPage,getMontessoriPage, getWaldorfPage, getMotorBeceriPage, getStemPage, getBlogsPage, getHakkimizdaPage, getIletisimPage } = require("../controllers/pageController");

// Ana sayfa
router.get("/", getİndexPage);
router.get("/login", getLoginPage);
router.get("/blog-montessori", getMontessoriPage);
router.get("/blog-waldorf", getWaldorfPage);
router.get("/blog-motor-beceri", getMotorBeceriPage);
router.get("/blog-stem", getStemPage);
router.get("/blogS", getBlogsPage);
router.get("/hakkimizda", getHakkimizdaPage);
router.get("/iletisim", getIletisimPage);
router.get("/duyurular", getDuyurularPage);
module.exports = router;
