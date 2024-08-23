import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { successLogger, errorLogger } from "./logger.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/endpoint", (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.length == 0) {
      return res.status(401).json({
        success: false,
        response: "An error occured",
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
    errorLogger.error(error.message);
    res.status(501).json({
      success: false,
      response: "An error occured",
      message: error.message,
    });
  }
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    errorLogger.error(`Invalid JSON: ${err.message}`);
    res.status(400).json({
      success: false,
      response: "An error occured",
      message: "Invalid JSON format",
    });
  } else {
    next();
  }
});

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    response: "Resource not found",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
