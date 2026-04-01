const express = require("express");
const router = express.Router();

const authController = require("../controllers/admin/authController");
const adminController = require("../controllers/admin/admindataController");

router.post("/data/create-user", authController.createUser);
router.post("/data/login", authController.loginUser);

router.use(authController.protectUser);
router.post("/data/createProvider", authController.createUser);
router.get("/data/getProviders", authController.getProviders);
router.get("/data/profile", adminController.getAdminProfile);

router.post("/data/create-service", adminController.createService);
router.get("/data/getadminServices", adminController.getadminServices);
router.get("/data/getadminService/:id", adminController.getadminServiceById);
router.put("/data/update-service/:id", adminController.updateadminService);
router.delete("/data/delete-service/:id", adminController.deleteadminService);

router.post("/data/createZone", adminController.createZone);
router.get("/data/getadminZones", adminController.getadminZones);
router.get("/data/getadminZone/:id", adminController.getadminZoneById);
router.put("/data/updateadminZone/:id", adminController.updateadminZone);
router.delete("/data/deleteadminZone/:id", adminController.deleteadminZone);

module.exports = router;
