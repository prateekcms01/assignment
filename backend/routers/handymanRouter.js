const express = require("express");
const router = express.Router();

const authController = require("../controllers/handyman/authController");
const adminController = require("../controllers/handyman/handymanController");

router.post("/data/loginHandyman", authController.loginHandyman);

router.use(authController.protectHandyman);
router.get("/data/getHandymanProfile", adminController.getHandymanProfile);
router.get(
  "/data/getHandymanassignedZoneandServices",
  adminController.getHandymanassignedZoneandServices,
);

module.exports = router;
