// framework require //
const express = require("express");
const colors = require("colors");
var cron = require("node-cron");
const fs = require("fs");
const app = express();
const helmet = require("helmet");
//const PORTHTTPS = 8443;
const bodyParser = require("body-parser");
const expressip = require("express-ip");
const requestIp = require("request-ip");
const path = require("path");
const https = require("https");
const http = require("http");
// csp content
const { expressCspHeader, INLINE, NONE, SELF } = require("express-csp-header");
app.use(
  expressCspHeader({
    directives: {
      "default-src": [SELF],
      "script-src": [SELF, INLINE, "somehost.com"],
      "style-src": [SELF, "mystyles.net"],
      "img-src": ["data:", "images.com"],
      "worker-src": [NONE],
      "block-all-mixed-content": true,
    },
  })
);
// csp content
//const cors = require("cors");
const xssFilter = require("x-xss-protection");
const sts = require("strict-transport-security");
const globalSTS = sts.getSTS({ "max-age": { days: 30 } });
const localSTS = sts.getSTS({
  "max-age": { days: 10 },
  includeSubDomains: true,
});
const csp = require("content-security-policy");
const cspPolicy = {
  "report-uri": "/reporting",
  "default-src": csp.SRC_NONE,
  "script-src": [csp.SRC_SELF, csp.SRC_DATA],
};
const globalCSP = csp.getCSP(csp.STARTER_OPTIONS);
const localCSP = csp.getCSP(cspPolicy);

app.use(helmet.frameguard());
var ONE_YEAR = 31536000000;
app.use(
  helmet.hsts({
    maxAge: ONE_YEAR,
    includeSubDomains: true,
    force: true,
  })
);
app.use(xssFilter());

app.use(globalSTS);
app.use(globalCSP);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(expressip().getIpInfoMiddleware);
app.use(express.static(__dirname + "/templates/notfound404.html"));

var cors = require("cors");
app.use((req, res, next) => {
  res.header("X-Content-Type-Options", "nosniff");
  res.removeHeader("X-Powered-By");
  return next();
});
var corsOptions = {
  origin: "*",
  methods: "GET, POST",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  //allow: "OPTIONS"
};
// test
app.use(cors(corsOptions));

// HP1 encoder //
try {
  // HP1 Encoder module
  console.info("Init HP1 Module");
  // Module builded
  const HP1Module = "./extensions/aishp1/build/Release/hp1";
  // Require HP1 Module
  var encoder = require(HP1Module);
  // Success
  console.info(": Module loaded");
} catch (e) {
  // Error
  console.error("Failed to load HP1 Module");
}
// HP1 encoder //


// WRITE LOGS EVERY 15 MINS //
var writeincoming15minsLOG = require("./services/logsService/incomingLOG/writeIncoming15minsLOG")
writeincoming15minsLOG.writeIncominglog15()
var writeinfo15minsLOG = require("./services/logsService/infoLOG/writeInfo15minsLOG")
writeinfo15minsLOG.writeIncominglog15()
var writeservice15minsLOG = require("./services/logsService/servicesLOG/writeservice15minsLOG")
writeservice15minsLOG.writeIncominglog15()
// WRITE LOGS EVERY 15 MINS //

var incominglog = require("./services/logsService/incomingLOG/writeIncomingLOG")
var infolog = require("./services/logsService/infoLOG/writeInfoLOG")
var servicelog = require("./services/logsService/servicesLOG/writeserviceLOG")

// function saved topic config //
// read method
const configPath = __dirname + "/configs";
const dataPath = path.join(configPath, `topics.json`);
const readFile = (
  callback,
  returnJson = false,
  filePath = dataPath,
  encoding = "utf8"
) => {
  fs.readFile(filePath, encoding, (err, data) => {
    if (err) {
      throw err;
    }
    callback(returnJson ? JSON.parse(data) : data);
  });
  // fs.close()
};
// write method
const writeFile = (
  fileData,
  callback,
  filePath = dataPath,
  encoding = "utf8"
) => {
  fs.writeFile(filePath, fileData, encoding, (err) => {
    if (err) {
      throw err;
    }
    callback();
  });
  // fs.close();
};
// function saved topic config //


const privateADN = app.post("/privateADN/receivetopic", (req, res) => {
  var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  ip = ip.slice(7)
  let payload = req.body;
  var logging3 = {
    LOGTYPE: `INCOMING`,
    RESPSTATUS: `20000`,
    RESPBODY: `${JSON.stringify(payload)}`,
    CALL_SERVICE: `INCOMING_PAYLOADS`,
    METHOD: `POST`,
    IP: `${ip}`,
    URI: `/privateADN/receivetopic`,
    REQHEADERS: ``,
    REQBODY: ``,
    SERVICES: ``,
    RESTIME: new Date().getTime(),
  };
  incominglog.writen(logging3)
  // console.log(JSON.stringify(payload));
  if (
    payload.hasOwnProperty("MSISDN") &&
    payload.hasOwnProperty("ORDER_TYPE")
  ) {
    var msisdn = payload.MSISDN;
    var orderType = payload.ORDER_TYPE;
    var hp1 = encoder ? encoder.hp1(msisdn) : msisdn;
    var loginb2b2c = require("./services/loginb2b2c/callLoginB2B2C")
    loginb2b2c.loginb2b2c(hp1, orderType, msisdn).then((result) => {
      res.send(result)
    }).catch((err) => {
      res.send(err)
    })
  }
});

const subscribe = app.post("/aemf/subscribetopic", (req, res) => {
  var topicID = req.body;
  var response = {
    resultCode: ``,
    developerMessage: ``,
  };

  var logging3 = {
    LOGTYPE: `INFO`,
    RESPSTATUS: ``,
    RESPBODY: ``,
    CALL_SERVICE: `SAVE_TOPIC`,
    METHOD: ``,
    IP: `${ip}`,
    URI: ``,
    REQHEADERS: ``,
    REQBODY: ``,
    SERVICES: ``,
    RESTIME: new Date().getTime(),
  };
  // this function to check empty or null valuea //
  function checkProperties(obj) {
    for (var key in obj) {
      if (obj[key] == null || obj[key] == "") {
        return true;
      }
    }
    return false;
  }
  // this function to check empty or null valuea //

  // this will checking request data from requester that value not null 
  if (checkProperties(topicID) == false) {

    var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    ip = ip.slice(7)
    // var infolog = require("./services/logsService/infoLOG/writeInfoLOG")
    var subscribeID = req.body.subscribeID;
    // function to call subscribe topic this will comment while running on locahost

    logging3.IP = `${ip}`
    readFile((data) => {
      const topicId = req.body.subscribeID;
      data[topicId.toString()] = req.body;
      writeFile(JSON.stringify(data, null, 2), (err) => {
        if (err) {
          logging3.RESPSTATUS = `40400`;
          logging3.RESPBODY = `not found file to save topic`;
          infolog.writen(logging3)
        }
        logging3.RESPSTATUS = `20000`;
        logging3.RESPBODY = `data saved at: ${dataPath}`;
        infolog.writen(logging3)
      });
    }, true);
    var subscribe = require("./services/topics/subscribe")
    subscribe.subscribe(subscribeID, ip).then((result) => {
      res.send(result);
    }).catch((err) => {
      res.send(err);
    })
  }
  else {
    response.resultCode = "40401";
    response.developerMessage = "Missing or Invalid Parameter"
    res.send(response)
  }
});

const unsubscribe = app.post("/aemf/unsubscribetopic", (req, res) => {
  var unsubscribetopic = require("./services/topics/unsubscribe")
  var topicID = req.body;
  var response = {
    resultCode: ``,
    developerMessage: ``,
  };

  var logging3 = {
    LOGTYPE: `INFO`,
    RESPSTATUS: ``,
    RESPBODY: ``,
    CALL_SERVICE: `DELETE_TOPIC`,
    METHOD: ``,
    IP: `${ip}`,
    URI: ``,
    REQHEADERS: ``,
    REQBODY: ``,
    SERVICES: ``,
    RESTIME: new Date().getTime(),
  };
  // this function to check empty or null valuea //
  function checkProperties(obj) {
    for (var key in obj) {
      if (obj[key] == null || obj[key] == "") {
        return true;
      }
    }
    return false;
  }
  // this function to check empty or null valuea //

  // this will checking request data from requester that value not null 
  if (checkProperties(topicID) == false) {

    var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    ip = ip.slice(7)
    var infolog = require("./services/logsService/infoLOG/writeInfoLOG")
    var subscribeID = req.body.subscribeID;

    // function to call subscribe topic this will comment while running on locahost
    // unsubscribetopic.unsubscribe(subscribeID, ip); 

    logging3.IP = `${ip}`
    readFile((data) => {
      const topicId = req.body.subscribeID;
      data[topicId.toString()] = req.body;

      var json = data;
      var key = req.body.subscribeID;
      delete json[key];

      writeFile(JSON.stringify(json, null, 2), (err) => {
        if (err) {
          logging3.RESPSTATUS = `40400`;
          logging3.RESPBODY = `not found file to save topic`;
          infolog.writen(logging3)
        }
        logging3.RESPSTATUS = `20000`;
        logging3.RESPBODY = `deleted data : ${dataPath}`;
        infolog.writen(logging3)
        // console.log(`deleted data from: ${dataPath}`);
      });
    }, true);
    var unsubscribe = require("./services/topics/unsubscribe")
    unsubscribe.unsubscribe(subscribeID, ip).then((result) => {
      res.send(result);
    }).catch((err) => {
      res.send(err);
    })
  }
  else {
    response.resultCode = "40301";
    response.developerMessage = "Missing or Invalid Parameter"
    res.send(response)
  }
});


if (process.env.NODE_ENV == 'macbookpro') {
  var serverOptionsLocal = {
    ciphers:
      "ECDH+AESGCM:!ECDH+CHACHA20:ECDH+AES256:ECDH+AES128:!aNULL:!SHA1:!AESCCM",
    honorCipherOrder: true,
    secureProtocol: "TLSv1_2_method",
  };
  http.createServer(serverOptionsLocal, privateADN, subscribe, unsubscribe).listen(process.env.PORT, () => {
    console.log(`app is run on port ${process.env.PORT}`);
    console.log(`application is running at here`);
  })
}
else if (process.env.NODE_ENV == 'development') {
  var serverOptionsDev = {
    key: fs.readFileSync(`${process.env.KEY}`),
    cert: fs.readFileSync(`${process.env.CERT}`),
    ciphers:
      "ECDH+AESGCM:!ECDH+CHACHA20:ECDH+AES256:ECDH+AES128:!aNULL:!SHA1:!AESCCM",
    honorCipherOrder: true,
    secureProtocol: "TLSv1_2_method",
  };
  https.createServer(serverOptionsDev, privateADN, subscribe, unsubscribe).listen(process.env.PORT, () => {
    console.log(`app is run on develop at port ${process.env.PORT}`);
  })
}
else if (process.env.NODE_ENV == 'production') {
  // console.log(JSON.stringify(process.env_development));
  var serverOptionsProd = {
    key: fs.readFileSync(`${process.env.KEY}`),
    cert: fs.readFileSync(`${process.env.CERT}`),
    ca: fs.readFileSync(`${process.env.CA}`),
    ciphers:
      "ECDH+AESGCM:!ECDH+CHACHA20:ECDH+AES256:ECDH+AES128:!aNULL:!SHA1:!AESCCM",
    honorCipherOrder: true,
    secureProtocol: "TLSv1_2_method",
  };
  https.createServer(serverOptionsProd, privateADN, subscribe, unsubscribe).listen(process.env.PORT, () => {
    console.log(`app is run on port ${process.env.PORT}`);
  })
}

