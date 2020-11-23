const request = require("request");
var logInfo = require("../logsService/infoLOG/writeInfoLOG");
var logServices = require("../logsService/servicesLOG/writeserviceLOG");
var conector = require("../database/connector")
// var logIncoming = require("../logsService/incomingLOG/writeIncomingLOG");

// var database = require("../database/connector");
var topic = require("../../configs/topics.json");

var year = new Date().getFullYear();
var month = new Date().getMonth();
var day = new Date().getDate();
var hour = new Date().getHours();
var min = new Date().getMinutes();
var sec = new Date().getSeconds();
var milisec = new Date().getMilliseconds();

const event = new Date(Date.UTC(year, month, day, hour, min, sec, milisec));


function checknullProperties(obj) {
  for (var key in obj) {
    if (obj[key] == null || obj[key] == "") {
      return true;
    }
  }
  return false;
}


function randomCommandId(len) {
  var crypto = require("crypto");
  return crypto
    .randomBytes(Math.ceil(len / 2))
    .toString("hex")
    .slice(0, len);
}
function gettopic(topics, ordertype, data) {
  for (var i in topics) {
    for (var j in topics[i]) {
      if (ordertype.includes(topics[i][j])) {
        data = topics[i]
      }
    }
  }
  return data
}

var logging3 = {
  LOGTYPE: ``,
  RESPSTATUS: ``,
  RESPBODY: ``,
  CALL_SERVICE: `CALL_LOGINB2B2C`,
  METHOD: `POST`,
  IP: ``,
  URI: ``,
  REQHEADERS: ``,
  REQBODY: ``,
  SERVICES: ``,
  RESTIME: new Date().getTime(),
};
var responsevalue = {
  resultCode: ``,
  developerMessage: ``,
  moreInfo: ``
};

var insertdata = {
  publicid: ``,
  privateid2: ``,
  time: Date
};



module.exports.calloginb2b2c = function (msisdn) {
  return new Promise((resolve, reject) => {
    const URL = process.env.HOSTADMD;
    logging3.IP = `${URL}`
    logging3.RESTIME = new Date().getTime()

    var commandId = randomCommandId(8);
    var options = {
      method: "POST",
      url: `${URL}`,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commandId: `${commandId}`,
        clientId: "x+hOTiuvwB7wR6Zp0lGpl9hC4qTSIiIG1A7hLpAUOIg=",
        publicId: msisdn,
        appName: "AISWeb",
        partnerId: "30046",
      }),
    }
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    request.post(options, (err, response) => {
      if (err) {
        reject(err);
      }
      else {
        var dataX = JSON.parse(response.body)
        resolve(dataX);
      }
    });
  });

}
module.exports.loginb2b2c = function (hp1, ordertype, msisdn) {
  return new Promise((resolve, reject) => {

    var method = gettopic(topic, ordertype).operation

    switch (method.toLowerCase()) {
      case "insert":
        this.calloginb2b2c(msisdn).then((result) => {
          var resultCode = result.resultCode;
          var devMessage = result.developerMessage;
          var info = result.moreInfo;
          var privateId2 = result.privateId;

          insertdata.publicid = hp1;
          insertdata.privateid2 = privateId2;
          insertdata.time = event;
          if (resultCode.includes("50000")) {
            logging3.LOGTYPE = `SERVICE`
            logging3.RESPSTATUS = `50000`;
            logging3.RESPBODY = result;
            logServices.writen(logging3);
            responsevalue.resultCode = `${resultCode}`;
            responsevalue.developerMessage = `${devMessage}`;
            responsevalue.moreInfo = `${info}`
            resolve(responsevalue)
          }
          else if (resultCode.includes("40401")) {
            logging3.LOGTYPE = `SERVICE`
            logging3.RESPSTATUS = `${resultCode}`;
            logging3.RESPBODY = result;
            logServices.writen(logging3);
            responsevalue.resultCode = `${resultCode}`;
            responsevalue.developerMessage = `${devMessage}`;
            responsevalue.moreInfo = `${info}`;
            resolve(responsevalue)
          }
          else {
            if (checknullProperties(insertdata) == false) {
              if (resultCode.includes("20000")) {

                conector.upsert(insertdata)
                logging3.LOGTYPE = `SERVICE`
                logging3.RESPSTATUS = `${resultCode}`;
                logging3.RESPBODY = insertdata;
                logServices.writen(logging3);
                responsevalue.resultCode = `${resultCode}`;
                responsevalue.developerMessage = `${devMessage}`;
                responsevalue.moreInfo = `${info}`
                resolve(responsevalue)
              }
              if (resultCode.includes("20100")) {
                conector.upsert(insertdata)
                logging3.LOGTYPE = `SERVICE`
                logging3.RESPSTATUS = `${resultCode}`;
                logging3.RESPBODY = insertdata;
                logServices.writen(logging3);
                responsevalue.resultCode = `${resultCode}`;
                responsevalue.developerMessage = `${devMessage}`;
                responsevalue.moreInfo = `${info}`
                resolve(responsevalue)
              }
            }
            else {
              logging3.LOGTYPE = `INFO`
              logging3.RESPBODY = `Missing some values in: ${JSON.stringify(insertdata)}`;
              logging3.RESPSTATUS = `40301`;
              logInfo.writen(logging3);
              responsevalue.resultCode = `40301`;
              responsevalue.developerMessage = `Missing Or Invalid Parameters`;
              responsevalue.moreInfo = ``;
              resolve(responsevalue)
            }
          }
        }).catch((err) => {
          reject(err)
        });
        break;
      case "delete":
        var find = {
          publicid: hp1,
        };
        conector.delete(find).then((result) => {
          responsevalue.resultCode = `${result.resultCode}`;
          responsevalue.developerMessage = `${result.developerMessage}`;
          resolve(responsevalue);
        }).catch((err) => {
          responsevalue.resultCode = `50000`;
          responsevalue.developerMessage = `${JSON.stringify(err)}`;
          reject(responsevalue)
        })
        break;
      case "chown":
        // finc value and delete in database //
        var find = {
          publicid: hp1,
        };
        conector.delete(find).then((result) => {

        }).catch((err) => {
          responsevalue.resultCode = `50000`;
          responsevalue.developerMessage = `${JSON.stringify(err)}`;
          reject(responsevalue)
        })
        //finc value and delete in database //
        this.calloginb2b2c(msisdn).then((result) => {
          var resultCode = result.resultCode;
          var devMessage = result.developerMessage;
          var info = result.moreInfo;
          var privateId2 = result.privateId;
          insertdata.publicid = hp1;
          insertdata.privateid2 = privateId2;
          // insertdata.time = dateTimes;
          if (resultCode.includes("50000")) {
            logging3.LOGTYPE = `SERVICE`
            logging3.RESPSTATUS = `50000`;
            logging3.RESPBODY = result;
            logServices.writen(logging3);
            responsevalue.resultCode = `${resultCode}`;
            responsevalue.developerMessage = `${devMessage}`;
            responsevalue.moreInfo = `${info}`
            resolve(responsevalue)
          }
          else if (resultCode.includes("40401")) {
            logging3.LOGTYPE = `SERVICE`
            logging3.RESPSTATUS = `${resultCode}`;
            logging3.RESPBODY = result;
            logServices.writen(logging3);
            responsevalue.resultCode = `${resultCode}`;
            responsevalue.developerMessage = `${devMessage}`;
            responsevalue.moreInfo = `${info}`;
            resolve(responsevalue)
          }
          else {
            if (checknullProperties(insertdata) == false) {
              if (resultCode.includes("20000")) {
                // console.log(`insertdate: ${JSON.stringify(insertdata)}`);
                conector.insert(insertdata)
                logging3.LOGTYPE = `SERVICE`
                logging3.RESPSTATUS = `${resultCode}`;
                logging3.RESPBODY = insertdata;
                logServices.writen(logging3);
                responsevalue.resultCode = `${resultCode}`;
                responsevalue.developerMessage = `${devMessage}`;
                responsevalue.moreInfo = `${info}`
                resolve(responsevalue)
              }
              if (resultCode.includes("20100")) {
                conector.insert(insertdata)
                logging3.LOGTYPE = `SERVICE`
                logging3.RESPSTATUS = `${resultCode}`;
                logging3.RESPBODY = insertdata;
                logServices.writen(logging3);
                responsevalue.resultCode = `${resultCode}`;
                responsevalue.developerMessage = `${devMessage}`;
                responsevalue.moreInfo = `${info}`
                resolve(responsevalue)
              }
            }
            else {
              logging3.LOGTYPE = `INFO`
              logging3.RESPBODY = `Missing some values in: ${JSON.stringify(insertdata)}`;
              logging3.RESPSTATUS = `40301`;
              logInfo.writen(logging3);
              responsevalue.resultCode = `40301`;
              responsevalue.developerMessage = `Missing Or Invalid Parameters`;
              responsevalue.moreInfo = ``;
              resolve(responsevalue)
            }
          }
        }).catch((err) => {

        })
        break;
      default:
        break;
    }
    // resolve(hp1, ordertype)
  })
}