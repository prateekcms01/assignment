const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../../database/db");
const AppError = require("../../utils/appError");
const catchAsyncError = require("../../utils/catchAsyncError");

exports.getProviderProfile = catchAsyncError(async (req, res, next) => {
  if (req.user.role !== "provider") {
    return next(new AppError("Access denied. Provider only", 403));
  }
  const providerId = req.user.id;
  const query = "SELECT * FROM users WHERE id = ?";
  const provider = await db(query, [providerId]);

  if (provider.length === 0) {
    return next(new AppError("Provider not found", 404));
  }

  res.status(200).json({
    message: "Provider profile retrieved successfully",
    provider: provider[0],
  });
});

exports.getProviderHandymen = catchAsyncError(async (req, res, next) => {
  if (req.user.role !== "provider") {
    return next(new AppError("Access denied. Provider only", 403));
  }
  const providerId = req.user.id;
  const query =
    "SELECT id, name, email FROM users WHERE provider_id = ? AND role = 'handyman'";
  const handymen = await db(query, [providerId]);

  res.status(200).json({
    message: "Handymen retrieved successfully",
    count: handymen.length,
    handymen,
  });
});

exports.getServicesForProvider = catchAsyncError(async (req, res, next) => {
  // ✅ Only provider allowed
  if (req.user.role !== "provider") {
    return next(new AppError("Access denied. Provider only", 403));
  }

  const query = `
    SELECT id, name, description, created_at
    FROM services
    ORDER BY id DESC
  `;

  const services = await db(query);

  res.status(200).json({
    success: true,
    count: services.length,
    services,
  });
});

exports.getZonesForProvider = catchAsyncError(async (req, res, next) => {
  // ✅ Only provider allowed
  if (req.user.role !== "provider") {
    return next(new AppError("Access denied. Provider only", 403));
  }

  const query = `
    SELECT id, name, city, created_at
    FROM zones
    ORDER BY id DESC
  `;

  const zones = await db(query);

  res.status(200).json({
    success: true,
    count: zones.length,
    zones,
  });
});

exports.assignServiceToHandyman = catchAsyncError(async (req, res, next) => {
  const { handyman_id, service_id } = req.body;

  if (req.user.role !== "provider") {
    return next(new AppError("Access denied. Provider only", 403));
  }

  if (!handyman_id || !service_id) {
    return next(new AppError("handyman_id and service_id are required", 400));
  }

  // ✅ Check handyman belongs to this provider
  const handymanCheck = await db(
    "SELECT * FROM users WHERE id = ? AND role = 'handyman' AND provider_id = ?",
    [handyman_id, req.user.id],
  );

  if (handymanCheck.length === 0) {
    return next(new AppError("Invalid handyman for this provider", 400));
  }

  // ✅ Check service exists
  const serviceCheck = await db("SELECT * FROM services WHERE id = ?", [
    service_id,
  ]);

  if (serviceCheck.length === 0) {
    return next(new AppError("Service not found", 404));
  }

  // ✅ Prevent duplicate assignment
  const existing = await db(
    "SELECT * FROM handyman_services WHERE handyman_id = ? AND service_id = ?",
    [handyman_id, service_id],
  );

  if (existing.length > 0) {
    return next(new AppError("Service already assigned to handyman", 400));
  }

  // ✅ Insert
  const insertQuery = `
    INSERT INTO handyman_services (handyman_id, service_id, assigned_by)
    VALUES (?, ?, ?)
  `;

  const result = await db(insertQuery, [handyman_id, service_id, req.user.id]);

  res.status(201).json({
    success: true,
    message: "Service assigned successfully",
    id: result.insertId,
  });
});

exports.getProviderHandymanServices = catchAsyncError(
  async (req, res, next) => {
    if (req.user.role !== "provider") {
      return next(new AppError("Access denied. Provider only", 403));
    }

    const query = `
    SELECT hs.id, hs.handyman_id, u.name AS handyman_name,
           hs.service_id, s.name AS service_name
    FROM handyman_services hs
    JOIN users u ON hs.handyman_id = u.id
    JOIN services s ON hs.service_id = s.id
    WHERE hs.assigned_by = ?
    ORDER BY hs.id DESC
  `;

    const data = await db(query, [req.user.id]);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  },
);

exports.updateHandymanService = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { handyman_id, service_id } = req.body;

  if (req.user.role !== "provider") {
    return next(new AppError("Access denied. Provider only", 403));
  }

  if (!handyman_id && !service_id) {
    return next(new AppError("Nothing to update", 400));
  }

  const existing = await db(
    "SELECT * FROM handyman_services WHERE id = ? AND assigned_by = ?",
    [id, req.user.id],
  );

  if (existing.length === 0) {
    return next(new AppError("Record not found or not authorized", 404));
  }

  const query = `
    UPDATE handyman_services
    SET handyman_id = ?, service_id = ?
    WHERE id = ? AND assigned_by = ?
  `;

  await db(query, [
    handyman_id || existing[0].handyman_id,
    service_id || existing[0].service_id,
    id,
    req.user.id,
  ]);

  res.status(200).json({
    success: true,
    message: "Updated successfully",
  });
});

exports.deleteHandymanService = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (req.user.role !== "provider") {
    return next(new AppError("Access denied. Provider only", 403));
  }

  const existing = await db(
    "SELECT * FROM handyman_services WHERE id = ? AND assigned_by = ?",
    [id, req.user.id],
  );

  if (existing.length === 0) {
    return next(new AppError("Record not found or not authorized", 404));
  }

  await db("DELETE FROM handyman_services WHERE id = ? AND assigned_by = ?", [
    id,
    req.user.id,
  ]);

  res.status(200).json({
    success: true,
    message: "Deleted successfully",
  });
});

exports.assignZoneToHandyman = catchAsyncError(async (req, res, next) => {
  const { handyman_id, zone_id } = req.body;

  if (req.user.role !== "provider") {
    return next(new AppError("Access denied. Provider only", 403));
  }

  if (!handyman_id || !zone_id) {
    return next(new AppError("handyman_id and zone_id are required", 400));
  }

  // ✅ Check handyman belongs to this provider
  const handymanCheck = await db(
    "SELECT * FROM users WHERE id = ? AND role = 'handyman' AND provider_id = ?",
    [handyman_id, req.user.id],
  );

  if (handymanCheck.length === 0) {
    return next(new AppError("Invalid handyman for this provider", 400));
  }

  // ✅ Check zone exists (optional: also check created_by if needed)
  const zoneCheck = await db("SELECT * FROM zones WHERE id = ?", [zone_id]);

  if (zoneCheck.length === 0) {
    return next(new AppError("Zone not found", 404));
  }

  // ✅ Prevent duplicate
  const existing = await db(
    "SELECT * FROM handyman_zones WHERE handyman_id = ? AND zone_id = ?",
    [handyman_id, zone_id],
  );

  if (existing.length > 0) {
    return next(new AppError("Zone already assigned to handyman", 400));
  }

  // ✅ Insert
  const result = await db(
    `INSERT INTO handyman_zones (handyman_id, zone_id, assigned_by)
     VALUES (?, ?, ?)`,
    [handyman_id, zone_id, req.user.id],
  );

  res.status(201).json({
    success: true,
    message: "Zone assigned successfully",
    id: result.insertId,
  });
});

exports.getProviderHandymanZones = catchAsyncError(async (req, res, next) => {
  if (req.user.role !== "provider") {
    return next(new AppError("Access denied. Provider only", 403));
  }

  const query = `
    SELECT hz.id,
           hz.handyman_id, u.name AS handyman_name,
           hz.zone_id, z.name AS zone_name, z.city
    FROM handyman_zones hz
    JOIN users u ON hz.handyman_id = u.id
    JOIN zones z ON hz.zone_id = z.id
    WHERE hz.assigned_by = ?
    ORDER BY hz.id DESC
  `;

  const data = await db(query, [req.user.id]);

  res.status(200).json({
    success: true,
    count: data.length,
    data,
  });
});

exports.deleteHandymanZone = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (req.user.role !== "provider") {
    return next(new AppError("Access denied. Provider only", 403));
  }

  const existing = await db(
    "SELECT * FROM handyman_zones WHERE id = ? AND assigned_by = ?",
    [id, req.user.id],
  );

  if (existing.length === 0) {
    return next(new AppError("Record not found or not authorized", 404));
  }

  await db("DELETE FROM handyman_zones WHERE id = ? AND assigned_by = ?", [
    id,
    req.user.id,
  ]);

  res.status(200).json({
    success: true,
    message: "Deleted successfully",
  });
});
