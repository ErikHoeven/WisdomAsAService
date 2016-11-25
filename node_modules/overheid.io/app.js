/*
Name:         overheid.io
Description:  Access overheid.io endpoints like OpenKvK, RDW and BAG with node.js
Author:       Franklin van de Meent (https://frankl.in)
Source code:  https://github.com/fvdm/nodejs-overheid.io
Feedback:     https://github.com/fvdm/nodejs-overheid.io/issues
License:      Unlicense (Public Domain) - see LICENSE file
              (https://github.com/fvdm/nodejs-overheid.io/raw/master/LICENSE)
*/

var http = require ('httpreq');

var defaults = {
  timeout: 5000
};


/**
 * Call back an error
 *
 * @callback callback
 * @param msg {string} - Error.message
 * @param err {mixed} - Error.error
 * @param res {object, null} - Client response
 * @param callback {function} - `function (err) {}`
 * @return {void}
 */

function doError (msg, err, res, callback) {
  var error = new Error (msg);

  error.error = err;
  error.code = res && res.statusCode;
  error.body = res && res.body;
  callback (error);
}


/**
 * Translate nested params to string
 *
 * @param obj {mixed} - Object to process
 * @return {string} - Querystring
 */

function fixParams (obj) {
  var key;
  var nw = [];
  var k;
  var i;

  if (obj) {
    for (key in obj) {
      if (obj [key] instanceof Array) {
        for (i = 0; i < obj [key] .length; i++) {
          nw.push (key + '[]=' + encodeURIComponent (obj [key] [i]));
        }
      } else if (obj [key] instanceof Object) {
        for (k in obj [key]) {
          nw.push (key + '[' + k + ']=' + encodeURIComponent (obj [key] [k]));
        }
      } else {
        nw.push (key + '=' + encodeURIComponent (obj [key]));
      }
    }
  }
  return nw.length ? '?' + nw.join ('&') : '';
}


/**
 * Setup
 *
 * @param config {object}
 * @param config.apikey {string} - API key
 * @param config.dataset {string} - API dataset
 * @param [config.timeout = 5000] {number} - Request timeout in ms
 * @return {function}
 */

module.exports = function (config) {
  /**
   * Send API request
   *
   * @param request {object}
   * @param request.dataset {string} - Name of dataset, i.e. `kvk`
   * @param [request.timeout = 5000] {number} - Request timeout in ms
   * @param request.path {string} - Request path after `dataset` part
   * @param request.params {object} - Data parameters to send
   * @param request.callback {function} - `function (err, data) {}`
   * @return {void}
   */

  return function (request) {
    var options = {
      url: 'https://overheid.io/api/' + (request.dataset || config.dataset),
      method: 'GET',
      headers: {
        'ovio-api-key': config.apikey || '',
        'User-Agent': 'overheid.io (https://github.com/fvdm/nodejs-overheid.io)'
      },
      timeout: request.timeout || config.timeout || defaults.timeout
    };

    options.url += request.path ? '/' + request.path : '';
    options.url += fixParams (request.params);

    http.doRequest (options, function (err, res) {
      var data = res && res.body || null;
      var error;

      if (err) {
        doError ('request failed', err, res, request.callback);
        return;
      }

      try {
        data = JSON.parse (data);

        if (Object.keys (data) .length === 1 && Object.keys (data.headers) .length === 0) {
          error = new Error ('no result');
          request.callback (error);
          return;
        }
      } catch (e) {
        doError ('invalid response', e, res, request.callback);
        return;
      }

      if (res.statusCode >= 300) {
        error = new Error ('API error');
        error.code = res.statusCode;
        error.text = data.error || null;
        request.callback (error);
        return;
      }

      request.callback (null, data);
    });
  };
};
