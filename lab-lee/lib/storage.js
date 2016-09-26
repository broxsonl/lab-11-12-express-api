'use strict';

const Promise = require('bluebird');
const createError = require('http-errors');
const debug = require('debug')('duck:storage');
const fs = Promise.promisifyAll(require('fs'), {suffix: 'Prom'});

const mkdirp = Promise.promisifyAll(require('mkdirp'), {suffix: 'Prom'});

module.exports = exports = {};

exports.createItem = function(schemaName, item) {
  debug('createItem');

  if (!schemaName) return Promise.reject(createError(400, 'expected schemaName'));
  if (!item) return Promise.reject(createError(400, 'expected an item'));

  let json = JSON.stringify(item);
  return fs.accessProm(`${__dirname}/../data/${schemaName}`)
  .catch(err => {
    if(err.code === 'ENOENT') {
      return mkdirp.mkdirpProm(`${__dirname}/../data/${schemaName}`);
    }
    return Promise.reject(err);
  })
  .then( () =>
  fs.writeFileProm(`${__dirname}/..data/${schemaName}/${item.id}.json`, json))
  .then( () => item)
  .catch( err => Promise.reject(createError(500, err.message)));
};
