const fs = require("fs")
module.exports = {
  apps: [
    {
      name: "auto-create-private-adn-local",
      script: "./server.js",
      
      env: {
        NODE_ENV: "local",
        PORT: 9090,
        DATABASE: "localhost:27017",
        DATABASENAME: "myaccount-cms",
        DATABASECOLLECTION: "customer_identity",
        HOSTADMD: "https://10.138.46.239:8443/loginByB2B2C",
        HOSTAEMF: "https://10.138.37.77:9000",
        ENPOINTIP: "https://10.138.34.153:8443/privateADN/receivetopic",
        LOGPATHINCOMING: "/Volumes/Learning/NodeJS/logs/auto-create-pricate-adn/incoming",
        LOGPATHINFO: "/Volumes/Learning/NodeJS/logs/auto-create-pricate-adn/info",
        LOGPATHSERVICE: "/Volumes/Learning/NodeJS/logs/auto-create-pricate-adn/service",
        
      },
      name: "auto-create-private-adn",
      script: "./server2.js",
      env_development: {
        NODE_ENV: "development",
        PORT: 8443,
        DATABASE: "mongodb://10.138.34.153:27017,10.138.34.153:27018,10.138.34.153:27019/admin?replicaSet=rsMyAcc&readPreference=secondary&maxStalenessSeconds=120",
        DATABASENAME: "myaccount-cms",
        DATABASECOLLECTION: "customer_identity",
        HOSTADMD: "https://10.138.46.239:8443/loginByB2B2C",
        HOSTAEMF: "https://10.138.37.77:9000",
        ENPOINTIP: "https://10.138.34.153:8443/privateADN/receivetopic",
        LOGPATHINCOMING: "/Volumes/Learning/NodeJS/logs/auto-create-pricate-adn/incoming",
        LOGPATHINFO: "/Volumes/Learning/NodeJS/logs/auto-create-pricate-adn/info",
        LOGPATHSERVICE: "/Volumes/Learning/NodeJS/logs/auto-create-pricate-adn/service",
      },
      // env_production: {
      //   NODE_ENV: "production",
      //   PORT: 9443,
      //   NODE_TLS_REJECT_UNAUTHORIZED: 0,
      //   MONGODB_URL: '...',
      //   SERVEROPTIONS: {
      //     key: fs.readFileSync(`/etc/ssl/certs/privateadn.key`),
      //     cert: fs.readFileSync(`/etc/ssl/certs/privateadn.cert`),
      //     ciphers:
      //       //"!RC4-SHA:!RC4:HIGH:!MD5:!aNULL:!EDH:!AESGCM:!eNULL:!EXPORT:!DEC:!PSK:!SRP:!CAMELLIA:!SHA1",
      //       "ECDH+AESGCM:!ECDH+CHACHA20:ECDH+AES256:ECDH+AES128:!aNULL:!SHA1:!AESCCM",
      //     honorCipherOrder: true,
      //     secureProtocol: "TLSv1_2_method",
      //   },
      // }
    }
  ]
};