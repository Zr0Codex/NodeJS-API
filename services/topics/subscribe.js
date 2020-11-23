
var infolog = require("../logsService/infoLOG/writeInfoLOG")
var servicelog = require("../logsService/servicesLOG/writeserviceLOG")
// require log //



module.exports.subscribe = function (topic, ip) {

  return new Promise((resolve, reject) => {
    var crypto = require("crypto");
    const request = require("request");
    var date = new Date();
    var twoDigitDate = getTwoDigitDateFormat(date.getDate());
    var twoDigitMonth = getTwoDigitDateFormat(date.getMonth() + 1);
    var twoDigitYear = date.getFullYear().toString().substr(-2);

    var xTIDRan = randomValue(11);
    var dataDigit = twoDigitYear + twoDigitMonth + twoDigitDate;



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

    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    var URL = `${process.env.HOSTAEMF}/aemf/v1/subscribe/topic/${topic}.json`;
    var options = {
      method: "POST",
      url: `${URL}`,
      headers: {
        "X-Tid": `phoenix-${dataDigit}${xTIDRan}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscriberName: "MyAccount",
        endpoint: `${process.env.ENDPOINTIP}`,
      }),
      // agentOptions: {
      //   ca: fs.readFileSync("/opt/adnapp/ssl/aemf.intra.ais.crt"),
      // },
    };
    var logging3 = {
      LOGTYPE: `INFO`,
      RESPSTATUS: ``,
      RESPBODY: ``,
      CALL_SERVICE: `SUBSCRIBE_TOPIC`,
      METHOD: `${options.method}`,
      IP: `${ip}`,
      URI: `${URL}`,
      REQHEADERS: `${JSON.stringify(options.headers)}`,
      REQBODY: `${options.body}`,
      SERVICES: ``,
      RESTIME: new Date().getTime(),
    };
    var responsevalue = {
      resultCode: ``,
      developerMessage: ``
    };
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    request(options, function (err, response) {
      if (err) {
        logging3.RESPBODY = `${err}`;
        logging3.RESPSTATUS = `50000`;
        infolog.writen(logging3);
        responsevalue.resultCode = `50000`;
        responsevalue.developerMessage = `Internal Server Error`;
        reject(responsevalue);
      }
      if (response.statusCode == '403') {
        logging3.RESPSTATUS = `${JSON.stringify(response.statusCode)}`;
        logging3.RESPBODY = `${JSON.stringify(response.body)}`;
        servicelog.writen(logging3);
        responsevalue.resultCode = `40301`;
        responsevalue.developerMessage = `Already Exites`;
        resolve(responsevalue);
      }
      if (response.statusCode == '200') {
        logging3.RESPSTATUS = `${JSON.stringify(response.statusCode)}`;
        logging3.RESPBODY = `${JSON.stringify(response.body)}`;
        servicelog.writen(logging3);
        responsevalue.resultCode = `20000`;
        responsevalue.developerMessage = `Success`;
        resolve(responsevalue);
      }
    });
  })
};