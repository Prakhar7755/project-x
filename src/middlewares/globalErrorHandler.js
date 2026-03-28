const globalErrorHandler = (err, req, res, next) => {
  console.error("ERROR 💥:", err);

  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // 🔴 Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((el) => el.message)
      .join(", ");
  }

  // 🔴 Duplicate Key Error (email / phone unique)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // 🔴 Cast Error (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // 🔴 Bulk Write Errors (insertMany / bulkWrite)
  if (err.name === "BulkWriteError") {
    statusCode = 207; // Multi-status (partial success)
    message = "Some operations failed during bulk write";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      error: err,
    }),
  });
};

export default globalErrorHandler;