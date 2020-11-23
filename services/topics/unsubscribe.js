// require library //
var crypto = require("crypto");
const request = require("request");
// require library //

// require log //
var infolog = require("../logsService/infoLOG/writeInfoLOG")
var servicelog = require("../logsService/servicesLOG/writeserviceLOG")
// require log //

// function to generate XTID Values //
function randomValue(len) {
  return crypto
    .randomBytes(Math.ceil(len / 2))
    .toString("hex")
    .slice(0, len);
}
// function to generate XTID Values //

// generate phoenix id //
function getTwoDigitDateFormat(monthOrDate) {
  return monthOrDate < 10 ? "0" + monthOrDate : "" + monthOrDate;
}
// generate phoenix id //

module.exports.unsubscribe = function (topic, ip) {
  return new Promise((resolve, reject) => {
    var date = new Date();
    var twoDigitDate = getTwoDigitDateFormat(date.getDate());
    var twoDigitMonth = getTwoDigitDateFormat(date.getMonth() + 1);
    var twoDigitYear = date.getFullYear().toString().substr(-2);

    var xTIDRan = randomValue(11);
    var dataDigit = twoDigitYear + twoDigitMonth + twoDigitDate;

    //process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    var URL = `${process.env.HOSTAEMF}/aemf/v1/subscribe/topic/${topic}.json`;
    var options = {
      method: "DELETE",
      qs: { endpoint: `${process.env.ENDPOINTIP}` },
      url: `${URL}`,
      headers: {
        "X-Tid": `phoenix-${dataDigit}${xTIDRan}`,
        "Content-Type": "application/json",
      },

      // agentOptions: {
      //   ca: fs.readFileSync("/opt/adnapp/ssl/aemf.intra.ais.crt"),
      // },
    };
    var logging3 = {
      LOGTYPE: `INFO`,
      RESPSTATUS: ``,
      RESPBODY: ``,
      CALL_SERVICE: `UNSUBSCRIBE_TOPIC`,
      METHOD: `${options.method}`,
      IP: `${ip}`,
      URI: `${URL}`,
      REQHEADERS: `${options.headers}`,
      REQBODY: ``,
      SERVICES: ``,
      RESTIME: new Date().getTime(),
    };
    var responsevalue = {
      resultCode: ``,
      developerMessage: ``,
    };
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    request(options, function (err, response) {
      // console.log(JSON.stringify(response.statusCode));
      if (err) {
        logging3.RESPBODY = `${err}`;
        logging3.RESPSTATUS = `50000`;
        infolog.writen(logging3);
        responsevalue.resultCode = `50000`;
        responsevalue.developerMessage = `Internal Server Error`
        reject(responsevalue)
      }
      if (response.statusCode == '404') {
        logging3.RESPSTATUS = `${JSON.stringify(response.statusCode)}`;
        logging3.RESPBODY = `${JSON.stringify(response.body)}`;
        servicelog.writen(logging3)
        responsevalue.resultCode = `40401`;
        responsevalue.developerMessage = `Data Not Found`
        resolve(responsevalue)
      }
      if (response.statusCode == '200') {
        logging3.RESPSTATUS = `${JSON.stringify(response.statusCode)}`;
        logging3.RESPBODY = `${JSON.stringify(response.body)}`;
        servicelog.writen(logging3)
        responsevalue.resultCode = `20000`;
        responsevalue.developerMessage = `Success`;
        resolve(responsevalue);
      }
    });
  });
};