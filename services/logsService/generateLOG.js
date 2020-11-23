const timestamp = require("time-stamp");
const uuidv4 = require("uuid-v4");

var start = process.hrtime()

function messager(message) {
  var log = []
  for (const key in message) {
    if (message.hasOwnProperty(key)) {
      var logging = message[key]
      if (typeof logging == "object") {
        try {
          logging = JSON.stringify(logging)
        } catch (error) {
          logging = null
        }
      }
      log.push(`${key}|${logging}`);
    }
  }
  return log.join("|");
}

module.exports.generate2 = function (message) {
  var finish = new Date().getTime();
  var begins = message.hasOwnProperty("RESTIME") ? message.RESTIME : 0;
  message.RESTIME = finish - begins;

  return messager(
    Object.assign(
      {
        TIMESTAMP: `${timestamp("YYYY-MM-DD HH:mm:ss.ms")}`,
        LOGTYPE: message.LOGTYPE,
        CALL_SERVICE: ``,
        THEAD: ``,
        IP: ``,
        METHOD: ``,
        URI: ``,
        REQID: uuidv4(),
        REQHEADERS: ``,
        REQBODY: ``,
        PARAM: `{"lang": "EN"}`,
        RESPBODY: ``,
        RESPSTATUS: ``,
        DESC: `DESC`,
        SERVICES: ``,
        ERRORMESSAGE: ``,
        EXCEPTION: ``,
        RESTIME: ``,
      },
      message
    )
  );
};
  
