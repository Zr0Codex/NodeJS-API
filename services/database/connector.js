var infolog = require("../logsService/infoLOG/writeInfoLOG")
var servicelog = require("../logsService/servicesLOG/writeserviceLOG")
const { MongoClient } = require("mongodb");

//setting data base
var databaseURL = process.env.DATABASE;
var databaseNAME = process.env.DATABASENAME;
var databaseCOLLECTION = process.env.DATABASECOLLECTION;
var options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
var logging3 = {
  LOGTYPE: `SERVICE`,
  RESPSTATUS: ``,
  RESPBODY: ``,
  CALL_SERVICE: ``,
  METHOD: ``,
  IP: ``,
  URI: `${databaseURL}`,
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
function connect(query) {
  MongoClient.connect(databaseURL, options, (err, connector) => {
    if (err) {
      logging3.CALL_SERVICE = `QUERY_DATABASE`;
      logging3.RESPBODY = `${err}`;
      logging3.RESPSTATUS = `50000`;
      logging3.METHOD = `SELECT`;
      infolog.writen(logging3);
    }
    var collection = connector.db(databaseNAME).collection(databaseCOLLECTION);
    query(connector, collection);
  });
}

module.exports.exists = (find) => {
  //var start = process.hrtime();
  return new Promise((resolve, reject) => {
    connect((connect, collection) => {
      collection.findOne(find, function (err, result) {
        if (err) {
          logging3.CALL_SERVICE = `QUERY_DATABASE`;
          logging3.RESPBODY = `${err}`;
          logging3.RESPSTATUS = `50000`;
          logging3.METHOD = `SELECT`;
          infolog.writen(logging3);
          reject(err);
        } else {
          var exists = false;
          exists = result ? true : exists;
          logging3.RESPSTATUS = "20000";
          logging3.RESPBODY = JSON.stringify(exists);
          servicelog.writen(logging3)
          resolve(exists);
        }
        connect.close();
      });
    });
  });
};

module.exports.insert = function (data) {
  return new Promise((resolve, reject) => {
    logging3.RESTIME = new Date().getTime()
    logging3.REQBODY = JSON.stringify({
      publicid: data.publicid,
      privateid2: data.privateid2,
    });

    connect((connect, collection) => {
      collection.insertOne(data, function (err, result) {
        logging3.CALL_SERVICE = `INSERT_CUSTOMER`;
        logging3.METHOD = `INSERT`;
        if (err) {
          logging3.RESPBODY = `${err}`;
          logging3.RESPSTATUS = `50000`;
          infolog.writen(logging3);
          reject(err);
        } else {
          logging3.RESPSTATUS = "20000";
          logging3.RESPBODY = JSON.stringify({
            insertedID: result.insertedId,
            insertedCount: result.insertedCount,
          });
          servicelog.writen(logging3)
          resolve(result.insertedId);
        }
        connect.close();
      });
    });
  });
};

module.exports.upsert = function (data) {
  return new Promise((resolve, reject) => {
    logging3.RESTIME = new Date().getTime()
    logging3.REQBODY = JSON.stringify({
      publicid: data.publicid,
      privateid2: data.privateid2,
    });
    var publicid = data.publicid;
    var update = {
      privateid2: data.privateid2,
      time: data.time
    }
    var options = { upsert: true };
    connect((connect, collection) => {
      collection.findOneAndUpdate({ publicid }, { $set: update }, options, function (err, result) {
        logging3.CALL_SERVICE = `UPDATE_CUSTOMER`;
        logging3.METHOD = `UPSERT`;
        if (err) {
          logging3.RESPBODY = `${err}`;
          logging3.RESPSTATUS = `50000`;
          infolog.writen(logging3);
          reject(err);
        } else {
          // console.log(`result: ${result}`);
          logging3.RESPSTATUS = "20000";
          logging3.RESPBODY = JSON.stringify({
            updatedExisting: result.updatedExisting,
            value: result.value,
          });
          servicelog.writen(logging3)
          resolve(result.insertedId);
        }
        connect.close();
      });
    });
  });
};

module.exports.delete = function (find) {
  return new Promise((resolve, reject) => {
    logging3.RESTIME = new Date().getTime()
    logging3.CALL_SERVICE = `DELETE_CUSTOMER`;
    logging3.METHOD = `DELETE`;
    logging3.REQBODY = `${JSON.stringify(find.publicid)}`;
    connect((connect, collection) => {
      collection.deleteOne(find, function (err, result) {
        if (err) {
          logging3.RESPBODY = `${err}`;
          logging3.RESPSTATUS = `50000`;
          responsevalue.resultCode = `50000`;
          responsevalue.developerMessage = `${JSON.stringify(err)}`;
          infolog.writen(logging3);
          reject(responsevalue);
        } else {
          var deleted = JSON.stringify(result.deletedCount)
          if (deleted != 0) {
            logging3.RESPBODY = `${JSON.stringify({
              requestId: result.message.requestId,
              deletetionValue: find.publicid,
            })}`;
            servicelog.writen(logging3)
            responsevalue.resultCode = `20000`;
            responsevalue.developerMessage = `Success`;
            resolve(responsevalue);
          }
          else if (deleted == 0) {
            logging3.RESPSTATUS = `40401`;
            logging3.RESPBODY = `Not Found Data`;
            servicelog.writen(logging3)
            responsevalue.resultCode = `40401`;
            responsevalue.developerMessage = `Not Found Data`;
            resolve(responsevalue);
          }
        }
        connect.close();
      });
    });
  });
};


module.exports.deletemany = function (find) {
  return new Promise((resolve, reject) => {
    logging3.RESTIME = new Date().getTime()
    logging3.CALL_SERVICE = `DELETE_MANY_CUSTOMER`;
    logging3.METHOD = `DELETE`;
    logging3.REQBODY = `${JSON.stringify(find.publicid)}`;
    connect((connect, collection) => {
      collection.find(find).count(function (err, count) {
        if (err) {
          logging3.RESPBODY = `${err}`;
          logging3.RESPSTATUS = `50000`;
          infolog.writen(logging3);
          reject(err);
        }
        else {
          if (count > 0) {
            console.log(`found duplicates: ${count} rows`);
            collection.deleteMany(find, function (err, result) {
              if (err) {
                logging3.RESPBODY = `${err}`;
                logging3.RESPSTATUS = `50000`;
                infolog.writen(logging3);
                reject(err);
              } else {
                var deleted = result.deleteCount > 0;
                logging3.RESPSTATUS = `20000`;
                logging3.RESPBODY = `${JSON.stringify({
                  requestId: result.message.requestId,
                  deletetionValue: find.publicid,
                })}`;
                servicelog.writen(logging3)
                resolve(deleted);
              }
              connect.close();
            });
            console.log(`deleted: ${count} rows`);
          }
        }
      })
    });
  });
};
