const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../../database/db");
const AppError = require("../../utils/appError");
const catchAsyncError = require("../../utils/catchAsyncError");

exports.getAdminProfile = catchAsyncError(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError("Access denied. Admin only", 403));
  }

  const adminId = req.user.id;

  const query = `
    SELECT id, name, email, role, created_at, updated_at
    FROM users
    WHERE id = ?
  `;

  const result = await db(query, [adminId]);

  if (result.length === 0) {
    return next(new AppError("Admin not found", 404));
  }

  const admin = result[0];

  res.status(200).json({
    success: true,
    admin,
  });
});

exports.createService = catchAsyncError(async (req, res, next) => {
  const { name, description } = req.body;

  if (req.user.role !== "admin") {
    return next(new AppError("Access denied. Admin only", 403));
  }

  if (!name) {
    return next(new AppError("Service name is required", 400));
  }

  const checkQuery = "SELECT * FROM services WHERE name = ?";
  const existingService = await db(checkQuery, [name]);

  if (existingService.length > 0) {
    return next(new AppError("Service already exists", 400));
  }

  const insertQuery = `
    INSERT INTO services (name, description, created_by)
    VALUES (?, ?, ?)
  `;

  const result = await db(insertQuery, [
    name,
    description || null,
    req.user.id,
  ]);

  res.status(201).json({
    success: true,
    message: "Service created successfully",
    service_id: result.insertId,
  });
});

exports.getadminServices = catchAsyncError(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError("Access denied. Admin only", 403));
  }

  const query = `
    SELECT id, name, description, created_at
    FROM services
    WHERE created_by = ?
    ORDER BY id DESC
  `;

  const services = await db(query, [req.user.id]);

  res.status(200).json({
    success: true,
    count: services.length,
    services,
  });
});

exports.getadminServiceById = catchAsyncError(async (req, res, next) => {
  const id = req.params.id;

  if (req.user.role !== "admin") {
    return next(new AppError("Access denied. Admin only", 403));
  }

  const query = `
    SELECT id, name, description, created_at
    FROM services
    WHERE id = ? AND created_by = ?
  `;

  const result = await db(query, [id, req.user.id]);

  if (result.length === 0) {
    return next(new AppError("Service not found or not authorized", 404));
  }

  res.status(200).json({
    success: true,
    service: result[0],
  });
});

exports.updateadminService = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (req.user.role !== "admin") {
    return next(new AppError("Access denied. Admin only", 403));
  }

  if (!name && !description) {
    return next(new AppError("Nothing to update", 400));
  }

  const existing = await db(
    "SELECT * FROM services WHERE id = ? AND created_by = ?",
    [id, req.user.id],
  );

  if (existing.length === 0) {
    return next(new AppError("Service not found or not authorized", 404));
  }

  const query = `
    UPDATE services 
    SET name = ?, description = ?
    WHERE id = ? AND created_by = ?
  `;

  await db(query, [
    name || existing[0].name,
    description || existing[0].description,
    id,
    req.user.id,
  ]);

  res.status(200).json({
    success: true,
    message: "Service updated successfully",
  });
});

exports.deleteadminService = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (req.user.role !== "admin") {
    return next(new AppError("Access denied. Admin only", 403));
  }

  const existing = await db(
    "SELECT * FROM services WHERE id = ? AND created_by = ?",
    [id, req.user.id],
  );

  if (existing.length === 0) {
    return next(new AppError("Service not found or not authorized", 404));
  }

  await db("DELETE FROM services WHERE id = ? AND created_by = ?", [
    id,
    req.user.id,
  ]);

  res.status(200).json({
    success: true,
    message: "Service deleted successfully",
  });
});

exports.createZone = catchAsyncError(async (req, res, next) => {
  const { name, city } = req.body;

  if (!name) {
    return next(new AppError("Zone name is required", 400));
  }

  const checkQuery = `
    SELECT * FROM zones WHERE name = ? AND created_by = ?
  `;
  const existing = await db(checkQuery, [name, req.user.id]);

  if (existing.length > 0) {
    return next(new AppError("Zone already exists", 400));
  }

  const insertQuery = `
    INSERT INTO zones (name, city, created_by)
    VALUES (?, ?, ?)
  `;

  const result = await db(insertQuery, [name, city || null, req.user.id]);

  res.status(201).json({
    success: true,
    message: "Zone created successfully",
    zone_id: result.insertId,
  });
});

exports.getadminZones = catchAsyncError(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError("Access denied. Admin only", 403));
  }

  const query = `
    SELECT id, name, city, created_at
    FROM zones
    WHERE created_by = ?
    ORDER BY id DESC
 `;

  const zones = await db(query, [req.user.id]);

  res.status(200).json({
    success: true,
    count: zones.length,
    zones,
  });
});

exports.getadminZoneById = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (req.user.role !== "admin") {
    return next(new AppError("Access denied. Admin only", 403));
  }

  const query = `
    SELECT id, name, city, created_at
    FROM zones
    WHERE id = ? AND created_by = ?
  `;

  const result = await db(query, [id, req.user.id]);

  if (result.length === 0) {
    return next(new AppError("Zone not found or not authorized", 404));
  }

  res.status(200).json({
    success: true,
    zone: result[0],
  });
});

exports.updateadminZone = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { name, city } = req.body;

  if (req.user.role !== "admin") {
    return next(new AppError("Access denied. Admin only", 403));
  }

  if (!name && !city) {
    return next(new AppError("Nothing to update", 400));
  }

  const existing = await db(
    "SELECT * FROM zones WHERE id = ? AND created_by = ?",
    [id, req.user.id],
  );

  if (existing.length === 0) {
    return next(new AppError("Zone not found or not authorized", 404));
  }

  const query = `
    UPDATE zones
    SET name = ?, city = ?
    WHERE id = ? AND created_by = ?
  `;

  await db(query, [
    name || existing[0].name,
    city || existing[0].city,
    id,
    req.user.id,
  ]);

  res.status(200).json({
    success: true,
    message: "Zone updated successfully",
  });
});

exports.deleteadminZone = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  if (req.user.role !== "admin") {
    return next(new AppError("Access denied. Admin only", 403));
  }

  const existing = await db(
    "SELECT * FROM zones WHERE id = ? AND created_by = ?",
    [id, req.user.id],
  );

  if (existing.length === 0) {
    return next(new AppError("Zone not found or not authorized", 404));
  }

  await db("DELETE FROM zones WHERE id = ? AND created_by = ?", [
    id,
    req.user.id,
  ]);

  res.status(200).json({
    success: true,
    message: "Zone deleted successfully",
  });
});
