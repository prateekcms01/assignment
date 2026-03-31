const express = require("express");
const router = express.Router();

const authController = require("../controllers/provider/authController");
const providerController = require("../controllers/provider/providerController");

const adminauthController = require("../controllers/admin/authController");

router.post("/data/createProvider", adminauthController.createUser);

router.post("/data/loginProvider", authController.loginProvider);

router.use(authController.protectProvider);
router.post("/data/createHandyman", authController.createHandyman);
router.get("/data/getProviderProfile", providerController.getProviderProfile);

router.get("/data/getProviderHandymen", providerController.getProviderHandymen);

router.get("/data/getServices", providerController.getServicesForProvider);
router.get("/data/getZones", providerController.getZonesForProvider);

router.post(
  "/data/assignServiceToHandyman",
  providerController.assignServiceToHandyman,
);
router.get(
  "/data/getProviderHandymanServices",
  providerController.getProviderHandymanServices,
);
router.put(
  "/data/updateHandymanService/:id",
  providerController.updateHandymanService,
);
router.delete(
  "/data/deleteHandymanService/:id",
  providerController.deleteHandymanService,
);

router.post(
  "/data/assignZoneToHandyman",
  providerController.assignZoneToHandyman,
);
router.get(
  "/data/getProviderHandymanZones",
  providerController.getProviderHandymanZones,
);
router.delete(
  "/data/deleteHandymanZone/:id",
  providerController.deleteHandymanZone,
);

module.exports = router;
