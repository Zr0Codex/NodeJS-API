const fs = require("fs")
module.exports = {
  apps: [
    {
      name: "auto-create-private-adn",
      script: "./server2.js",
      env: {
        NODE_ENV: "macbookpro",
        PORT: 9090,
        DATABASE: "localhost:27017",
        DATABASENAME: "myaccount-cms",
        DATABASECOLLECTION: "customer_identity",
        HOSTADMD: "https://10.138.46.239:8443/loginByB2B2C",
        HOSTAEMF: "https://10.138.37.77:9000",
        ENDPOINTIP: "https://10.138.34.153:8443/privateADN/receivetopic",
        LOGPATHINCOMING: "/Volumes/Learning/NodeJS/logs/auto-create-pricate-adn/incoming",
        LOGPATHINFO: "/Volumes/Learning/NodeJS/logs/auto-create-pricate-adn/info",
        LOGPATHSERVICE: "/Volumes/Learning/NodeJS/logs/auto-create-pricate-adn/service",

      },
      env_development: {
        NODE_ENV: "development",
        PORT: 8443,
        DATABASE: "mongodb://10.138.34.153:27017,10.138.34.153:27018,10.138.34.153:27019/admin?replicaSet=rsMyAcc&readPreference=secondary&maxStalenessSeconds=120",
        DATABASENAME: "myaccount-cms",
        DATABASECOLLECTION: "customer_identity",
        HOSTADMD: "https://10.138.46.239:8443/loginByB2B2C",
        HOSTAEMF: "https://10.138.37.77:9000",
        ENDPOINTIP: "https://10.138.34.153:8443/privateADN/receivetopic",
        LOGPATHINCOMING: "/app/logs/auto-create-private-adn/incoming",
        LOGPATHINFO: "/app/logs/auto-create-private-adn/info",
        LOGPATHSERVICE: "/app/logs/auto-create-private-adn/service",
        KEY: "/etc/ssl/certs/privateadn.key",
        CERT: "/etc/ssl/certs/privateadn.cert",
      },
      env_staging: {
        NODE_ENV: "staging",
        PORT: 8443,
        DATABASE: "mongodb://10.138.34.153:27017,10.138.34.153:27018,10.138.34.153:27019/admin?replicaSet=rsMyAcc&readPreference=secondary&maxStalenessSeconds=120",
        DATABASENAME: "myaccount-cms",
        DATABASECOLLECTION: "customer_identity",
        HOSTADMD: "https://10.138.46.239:8443/loginByB2B2C",
        HOSTAEMF: "https://10.138.37.77:9000",
        ENDPOINTIP: "https://10.138.41.81:8443/privateADN/receivetopic",
        LOGPATHINCOMING: "/app/logs/auto-create-private-adn/incoming",
        LOGPATHINFO: "/app/logs/auto-create-private-adn/info",
        LOGPATHSERVICE: "/app/logs/auto-create-private-adn/service",
        KEY: "/etc/ssl/certs/privateadn.key",
        CERT: "/etc/ssl/certs/privateadn.cert",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 9443,
        DATABASE: "mongodb://dbAdmin:P0w3r0n@PCEMMACD901G:27017,PCEMMACD902G:27017,PCEMMACD903G:27017/admin?replicaSet=OnlineService&readPreference=secondary&maxStalenessSeconds=120&authSource=admin",
        DATABASENAME: "omnidb",
        DATABASECOLLECTION: "customer_identity",
        HOSTADMD: "https://10.198.40.41:443/loginByB2B2C",
        HOSTAEMF: "https://aemf.intra.ais:9000",
        ENDPOINTIP: "https://myaccountapp.intra.ais:9443/privateADN/receivetopic",
        LOGPATHINCOMING: "/app/logs/auto-create-private-adn/incoming",
        LOGPATHINFO: "/app/logs/auto-create-private-adn/info",
        LOGPATHSERVICE: "/app/logs/auto-create-private-adn/service",
        KEY: "/etc/ssl/certs/privateadn.key",
        CERT: "/etc/ssl/certs/privateadn.cert",
        CA: "/opt/adnapp/ssl/aemf.intra.ais.crt"
      },
    }
  ]
};