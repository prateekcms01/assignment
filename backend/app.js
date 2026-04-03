const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const AppError = require("./utils/appError.js");
const db = require("./database/db.js");

const adminRouter = require("./routers/adminRouter.js");
const providerRouter = require("./routers/providerRouter.js");
const handymanRouter = require("./routers/handymanRouter.js");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/providers", providerRouter);
app.use("/api/v1/handymen", handymanRouter);

app.get("/health", (req, res) => {
  res.status(200).send("API server up");
});

// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
