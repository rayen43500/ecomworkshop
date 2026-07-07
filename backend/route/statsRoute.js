const express = require("express");
const router = express.Router();
const { getAdminStats } = require("../controller/statsController");
const { isAuthentictedUser, authorizeRoles } = require("../middleWare/auth");

router
  .route("/admin/stats")
  .get(isAuthentictedUser, authorizeRoles("admin"), getAdminStats);

module.exports = router;
