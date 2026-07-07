const express = require("express");
const router = express.Router();

const {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} = require("../controller/bannerController");
const { isAuthentictedUser, authorizeRoles } = require("../middleWare/auth");

router.route("/banners").get(getAllBanners);

router
  .route("/admin/banner/new")
  .post(isAuthentictedUser, authorizeRoles("admin"), createBanner);

router
  .route("/admin/banner/:id")
  .put(isAuthentictedUser, authorizeRoles("admin"), updateBanner)
  .delete(isAuthentictedUser, authorizeRoles("admin"), deleteBanner);

module.exports = router;
