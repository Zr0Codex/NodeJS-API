const fs = require("fs");
const timestamp = require("time-stamp");

var infolog = require("../infoLOG/writeInfoLOG")

function writeIncominglog15() {
  try {
    const cron = require("node-cron");
    cron.schedule("*/15 * * * *", function () {
      const path = require("path");
      const filenameInfo = path.join(process.env.LOGPATHSERVICE, `service.log`);
      var dataInfo = fs.readFileSync(filenameInfo, "utf8");
      var timestampfilename = timestamp("YYYYMMDD_HHmm");
      const filenameInfoSave = path.join(
        process.env.LOGPATHSERVICE,
        `service.log.${timestampfilename}`
      );

      var logging2 = {
        LOGTYPE: "INFO",
        RESPSTATUS:  ``,
        RESPBODY: `data was saved at ${filenameInfoSave}`,
        CALL_SERVICE: "WRITE_LOGS_15MINS",
        METHOD: "WRITELOG",
        IP: ``,
        URI: ``,
        REQHEADERS: ``,
        REQBODY: ``,
        SERVICES: ``,
        RESTIME: new Date().getTime(),
      };
      infolog.writen(logging2);
      fs.writeFileSync(filenameInfoSave, `${dataInfo}`);
      fs.writeFileSync(filenameInfo, "");
      fs.chmodSync(filenameInfoSave, 0o744);
    });
  } catch (e) {
    var logging2 = {
      LOGTYPE: "INFO",
      RESPSTATUS: ``,
      RESPBODY: ``,
      CALL_SERVICE: "ERROR_LOG",
      METHOD: `EXCEPTION`,
      ERRORMESSAGE: `${e}`,
      IP: ``,
      URI: ``,
      REQHEADERS: ``,
      REQBODY: ``,
      SERVICES: ``,
      RESTIME: new Date().getTime(),
    };
    infolog.writen(logging2);
  }
}

module.exports = {
  writeIncominglog15,
};
