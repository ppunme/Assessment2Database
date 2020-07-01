const winston = require("winston");
require("winston-mongodb");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "My App" },
  transports: [
    // Write all logs error to `error.log`.
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),

    // Write all logs warning to `warnings.log`.
    new winston.transports.File({
      filename: "logs/warnings.log",
      level: "warn",
    }),

    // Write to all logs with level `info` and below to `combined.log`
    new winston.transports.File({ filename: "logs/combined.log" }),

    //Save error to database and pass in database details
    new winston.transports.MongoDB({
      db: "mongodb://localhost:37017/koala",
    }),
  ],
});

//Log express errors
function error(err, req, res, next) {
  logger.error(err.message, err);
  res.status(500).send("Something failed.");
  process.exit(1); //11. We could also exit the application to reset everything
  //Note in production we would need to use tools called "Process Managers" these tools will automatically restart our app if it is exited.
}

process.on("uncaughtException", (ex) => {
  console.log("An uncaught exception occurred ");
  logger.error(ex.message, ex);
  process.exit(1); //12. We could also exit the application to reset everything
  //Note in production we would need to use tools called "Process Managers" these tools will automatically restart our app if it is exited.
});

process.on("unhandledRejection", (ex) => {
  console.log("An uncaught rejection occurred ");
  logger.error(ex.message, ex);
});

// Export middleware
module.exports = error;
