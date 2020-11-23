const { createLogger, format, transports } = require("winston");
const path = require("path");
//generated logs
// data
const help2 = require("../generateLOG");

const env = process.env.NODE_ENV

const filename = path.join(process.env.LOGPATHSERVICE, `service.log`);
const logger = createLogger({
  // change level if in dev environment versus production
  level: env === "development" ? "debug" : "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.printf(info => `${info.message}`)
  ),
  transports: [
    new transports.Console({
      level: "info",
      format: format.combine(
        format.colorize(),
        format.printf(info => `${info.message}`)
      )
    }),
    new transports.File({
      filename
    })
  ]
});

module.exports.writelogsState = function (value) {
  logger.info(`${value}`);
};

module.exports.writen = function (message) {
  var logging2 = help2.generate2(message);
  this.writelogsState(logging2);
};
