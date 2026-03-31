const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../../database/db");
const AppError = require("../../utils/appError");
const catchAsyncError = require("../../utils/catchAsyncError");

exports.getHandymanProfile = catchAsyncError(async (req, res, next) => {
  if (req.user.role !== "handyman") {
    return next(new AppError("Access denied. Handyman only", 403));
  }
  const handymanId = req.user.id;
  const query = "SELECT * FROM users WHERE id = ?";
  const handyman = await db(query, [handymanId]);

  if (handyman.length === 0) {
    return next(new AppError("Handyman not found", 404));
  }

  res.status(200).json({
    message: "Handyman profile retrieved successfully",
    handyman: handyman[0],
  });
});

exports.getHandymanassignedZoneandServices = catchAsyncError(
  async (req, res, next) => {
    if (req.user.role !== "handyman") {
      return next(new AppError("Access denied. Handyman only", 403));
    }

    const handymanId = req.user.id;

    const servicesQuery = `
    SELECT s.id, s.name, s.description
    FROM handyman_services hs
    JOIN services s ON hs.service_id = s.id
    WHERE hs.handyman_id = ?
  `;

    const services = await db(servicesQuery, [handymanId]);

    const zonesQuery = `
    SELECT z.id, z.name, z.city
    FROM handyman_zones hz
    JOIN zones z ON hz.zone_id = z.id
    WHERE hz.handyman_id = ?
  `;

    const zones = await db(zonesQuery, [handymanId]);

    res.status(200).json({
      success: true,
      handyman_id: handymanId,
      services,
      zones,
    });
  },
);
