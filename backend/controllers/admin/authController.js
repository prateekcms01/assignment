const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../../database/db");
const AppError = require("../../utils/appError");
const catchAsyncError = require("../../utils/catchAsyncError");

exports.createUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, role, provider_id } = req.body;

  if (!name || !email || !password || !role) {
    return next(
      new AppError("Name, email, password and role are required", 400),
    );
  }

  const validRoles = ["admin", "provider", "handyman"];
  if (!validRoles.includes(role)) {
    return next(new AppError("Invalid role", 400));
  }

  if (role === "handyman" && !provider_id) {
    return next(new AppError("provider_id is required for handyman", 400));
  }

  const checkQuery = "SELECT * FROM users WHERE email = ?";
  const existingUser = await db(checkQuery, [email]);

  if (existingUser.length > 0) {
    return next(new AppError("User already exists with this email", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const insertQuery = `
    INSERT INTO users (name, email, password, role, provider_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  const result = await db(insertQuery, [
    name,
    email,
    hashedPassword,
    role,
    role === "handyman" ? provider_id : null,
  ]);

  res.status(201).json({
    message: `${role} created successfully`,
    user_id: result.insertId,
  });
});

exports.getProviders = catchAsyncError(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError("Access denied. Admin only", 403));
  }
  const query = `
    SELECT id, name, email, role, provider_id, created_at, updated_at
    FROM users
    WHERE role = 'provider'
  `;
  const providers = await db(query);

  res.status(200).json({
    success: true,
    providers,
  });
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  const query = "SELECT * FROM users WHERE email = ?";
  const users = await db(query, [email]);

  if (users.length === 0) {
    return next(new AppError("Invalid credentials", 401));
  }

  const user = users[0];

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError("Invalid credentials", 401));
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      provider_id: user.provider_id,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
  });
});

exports.protectUser = catchAsyncError(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in first.", 401),
    );
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError("Invalid or expired token", 401));
  }

  const searchUserSql = `
    SELECT id, name, email, role, provider_id, created_at, updated_at 
    FROM users 
    WHERE id = ?
  `;

  const searchResult = await db(searchUserSql, [decoded.id]);

  if (searchResult.length === 0) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401),
    );
  }

  const user = searchResult[0];

  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    provider_id: user.provider_id,
  };

  next();
});
