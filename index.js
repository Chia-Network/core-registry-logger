const { createLogger, format, transports, addColors } = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const { getChiaRoot } = require("chia-root-resolver");
const fs = require("fs");

/**
 * @file Manages the logging for Core Registry.
 * @module core-registry-logger
 */

class Logger {
  /**
   * @param {Object} options - Logger options
   * @param {string} options.projectName - The name of the project using the logger.
   * @param {string} options.logLevel - The logging level.
   * @param {string} options.packageVersion - The version of the package.
   */
  constructor(options) {
    const { projectName, logLevel, packageVersion } = options;

    const customLevels = {
      levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        task: 4,
        debug: 5,
        trace: 6,
      },
      colors: {
        fatal: "red",
        error: "red",
        warn: "yellow",
        task: "cyan",
        info: "green",
        debug: "blue",
        trace: "magenta",
      },
    };

    addColors(customLevels.colors);

    const chiaRoot = getChiaRoot();
    const logDir = `${chiaRoot}/core-registry/logs/${projectName}`;

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logFormat = format.printf((info) => {
      const metadataStr = Object.keys(info.metadata || {}).length
        ? JSON.stringify(info.metadata)
        : "";
      return `${info.timestamp} [${packageVersion}] [${info.level}]: ${info.message} ${metadataStr}`;
    });

    const sharedFileFormat = format.combine(
      format.json(),
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" })
    );

    this.logger = createLogger({
      levels: customLevels.levels,
      level: logLevel,
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat,
        format.metadata({ fillExcept: ["message", "level", "timestamp"] })
      ),
      transports: [
        new transports.File({
          filename: `${logDir}/error.log`,
          level: "error",
          format: sharedFileFormat,
        }),
        new transports.File({
          filename: `${logDir}/combined.log`,
          format: sharedFileFormat,
        }),
        new DailyRotateFile({
          filename: `${logDir}/application-%DATE%.log`,
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "20m",
          utc: true,
          format: sharedFileFormat,
        }),
      ],
      exitOnError: false,
    });

    this.logger.add(
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.prettyPrint(),
          logFormat
        ),
      })
    );
  }
}

module.exports = Logger;
