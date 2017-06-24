'use strict';

var fs = require('fs');
var path = require('path');
var request  = require('request');
var Bluebird = require('bluebird');
var options = {};
var util = require('util');
var BaseStore;

try {
  BaseStore = require('ghost/core/server/storage/base');
} catch (e) {
  if (e.code !== 'MODULE_NOT_FOUND') throw e;
  BaseStore = require(path.join(process.cwd(), 'core/server/storage/base'));
}

function BlobberStore(config) {
  BaseStore.call(this);
  options = config;
}

util.inherits(BlobberStore, BaseStore);

function logError(error) {
  console.log('error in ghost-blobber-service', error);
}

function logInfo(info) {
  console.log('info in ghost-blobber-service', info);
}

function validOptions(opts) {
  return (!!opts.url)
}

BlobberStore.prototype.save = function save(image) {
  if (!validOptions(options)) {
    return Bluebird.reject('ghost-blobber-service is not configured');
  }

  var targetDir = this.getTargetDir();

  return new Bluebird(function (resolve, reject) {
      var req = request.post({
        uri: options.url + '/files',
        method: 'PUT',
        headers: {
          'X-API-KEY': options.apiKey,
        }
      }, function(err,res,body) {
        console.log("err",err);
        console.log("res",res);
        console.log("body",body);
        if (res.statusCode === 201 || res.statusCode === 409) {
          resolve(options.url + '/files/' + JSON.parse(body).uuid);
        } else {
          reject('Error [' + res.statusCode + '] ');
        }
      });

    req.on('error', function (e) {
      reject('Error: ' + e);
    });

    var form = req.form();
    form.append('file', fs.createReadStream(image.path));
  });
};

BlobberStore.prototype.serve = function serve() {
  return function (req, res, next) {
    next();
  };
}

BlobberStore.prototype.exists = function exists() {};
BlobberStore.prototype.delete = function deleteFile() {};

module.exports = BlobberStore;
