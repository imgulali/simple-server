import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { successLogger, errorLogger } from "./logger.js";

const app = express();
const PORT = 5000;

app.set('trust proxy', true);
app.use(cors());
app.use(bodyParser.json());

// Middleware to handle secure connections
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] === 'https') {
    req.secure = true;
  }
  next();
});

// Route handling
app.post("/endpoint", (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.length === 0) {
      return res.status(400).json({
        success: false,
        response: "An error occurred",
        message: "Message is required",
      });
    }

    successLogger.info(message);
    console.log(message);

    res.status(200).json({
      success: true,
      response: "Request Successful",
      message: message,
    });
  } catch (error) {
    errorLogger.error(`Error in /endpoint: ${error.message}`);
    res.status(500).json({
      success: false,
      response: "An error occurred",
      message: "Internal Server Error",
    });
  }
});

// Error handling middleware for JSON syntax errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    errorLogger.error(`Invalid JSON: ${err.message}`);
    return res.status(400).json({
      success: false,
      response: "An error occurred",
      message: "Invalid JSON format",
    });
  }
  next(err); // Pass the error to the next middleware
});

// General error handling middleware
app.use((err, req, res, next) => {
  errorLogger.error(`Unexpected error: ${err.message}`);
  res.status(500).json({
    success: false,
    response: "An error occurred",
    message: "Internal Server Error",
  });
});

// 404 Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    response: "Resource not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
