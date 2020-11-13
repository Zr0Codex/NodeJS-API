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


var service2 = require("../NodeJS-API/services/logs/incomingLOG/writeIncomingLOG")
const test = app.get("/test", (req, res) => {
  var logging = {
    CALL_SERVICE: "TEST",
    METHOD: "GET",
    URI: process.env.DATABASE,
    REQHEADERS: ``,
    REQBODY: `${req.body}`,
    SERVICES: `TEST`,
    RESPBODY: `DD`,
    RESPSTATUS: `20000`,
    RESTIME: new Date().getTime(),
  };
  logging.LOGTYPE = "INFO";
  logging.RESPSTATUS = "20000";
  logging.RESPBODY = "TEST";
  service2.writen(logging.LOGTYPE, logging);
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