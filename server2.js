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

// WRITE LOGS EVERY 15 MINS //
var writeincoming15minsLOG = require("./services/logs/incomingLOG/writeIncoming15minsLOG")
writeincoming15minsLOG.writeIncominglog15()
var writeinfo15minsLOG = require("./services/logs/infoLOG/writeInfo15minsLOG")
writeinfo15minsLOG.writeIncominglog15()
var writeservice15minsLOG = require("./services/logs/servicesLOG/writeservice15minsLOG")
writeservice15minsLOG.writeIncominglog15()
// WRITE LOGS EVERY 15 MINS //

var incominglog = require("./services/logs/incomingLOG/writeIncomingLOG")
var infolog = require("./services/logs/infoLOG/writeInfoLOG")
var servicelog = require("./services/logs/servicesLOG/writeserviceLOG")

const test = app.get("/test", (req, res) => {
  var cutIp = JSON.stringify(req.ip);
  // console.log(cutIp);
  cutIp = cutIp.slice(1, -1);
  // console.log(cutIp);
  var uri = JSON.stringify(req.url);
  uri = uri.slice(1, -1)
  var logging = {
    LOGTYPE: "INCOMING",
    RESPSTATUS: "20000",
    RESPBODY: "TEST",
    CALL_SERVICE: "INCOMING",
    METHOD: "GET",
    IP: `${cutIp}`,
    URI: uri,
    REQHEADERS: ``,
    REQBODY: `TEST`,
    SERVICES: `TEST`,
    RESTIME: new Date().getTime(),
  };

  var logging2 = {
    LOGTYPE: "INFO",
    RESPSTATUS: "20000",
    RESPBODY: "TEST",
    CALL_SERVICE: "INFO",
    METHOD: "GET",
    IP: `${cutIp}`,
    URI: uri,
    REQHEADERS: ``,
    REQBODY: `TEST`,
    SERVICES: `TEST`,
    RESTIME: new Date().getTime(),
  };

  var logging3 = {
    LOGTYPE: "SERVICE",
    RESPSTATUS: "20000",
    RESPBODY: "TEST",
    CALL_SERVICE: "SERVICE",
    METHOD: "GET",
    IP: `${cutIp}`,
    URI: uri,
    REQHEADERS: ``,
    REQBODY: `TEST`,
    SERVICES: `TEST`,
    RESTIME: new Date().getTime(),
  };

  
  incominglog.writen(logging);
  infolog.writen(logging2);
  servicelog.writen(logging3);
  res.send("TEST")
})

const sunscripbe = app.post("/aemf/subscribetopic", (req, res) => {
  
})



var serverOptions = {
  ciphers:
    //"!RC4-SHA:!RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM:!eNULL:!EXPORT:!DEC:!PSK:!SRP:!CAMELLIA:!SHA1",
    "ECDH+AESGCM:!ECDH+CHACHA20:ECDH+AES256:ECDH+AES128:!aNULL:!SHA1:!AESCCM",
  honorCipherOrder: true,
  secureProtocol: "TLSv1_2_method",
};

http.createServer(serverOptions, test).listen(process.env.PORT, () => {
  console.log(`app is run on port ${process.env.PORT}`);
})