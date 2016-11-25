/*
Name:         overheid.io - test.js
Description:  Access overheid.io endpoints like OpenKvK, RDW and BAG with node.js
Author:       Franklin van de Meent (https://frankl.in)
Source code:  https://github.com/fvdm/nodejs-overheid.io
Feedback:     https://github.com/fvdm/nodejs-overheid.io/issues
License:      Unlicense (Public Domain) - see LICENSE file
              (https://github.com/fvdm/nodejs-overheid.io/raw/master/LICENSE)
*/

var dotest = require ('dotest');
var app = require ('./');


// Setup
var config = {
  apikey: process.env.OVIO_APIKEY || null,
  timeout: process.env.OVIO_TIMEOUT || 5000,
  dataset: 'voertuiggegevens'
};

var ovio = app (config);


// Tests
dotest.add ('Module', function (test) {
  test ()
    .isFunction ('fail', 'exports', app)
    .isFunction ('fail', 'interface', ovio)
    .done ();
});


dotest.add ('config.timeout', function (test) {
  ovio ({
    path: '4-TFL-24',
    params: {
      fields: ['eerstekleur']
    },
    timeout: 1,
    callback: function (err) {
      var error = err && err.error;

      test ()
        .isError ('fail', 'err', err)
        .isExactly ('fail', 'err.message', err && err.message, 'request failed')
        .isError ('fail', 'err.error', error)
        .isExactly ('fail', 'err.error.code', error && error.code, 'TIMEOUT')
        .done ();
    }
  });
});


dotest.add ('no result', function (test) {
  ovio ({
    path: 'error.test',
    callback: function (err) {
      test ()
        .isError ('fail', 'err', err)
        .isExactly ('fail', 'err.message', err && err.message, 'no result')
        .done ();
    }
  });
});


dotest.add ('item', function (test) {
  ovio ({
    path: '4-TFL-24',
    callback: function (err, data) {
      test (err)
        .isNotEmpty ('fail', 'data', data)
        .isObject ('fail', 'data', data)
        .isExactly ('fail', 'data.kenteken', data && data.kenteken, '4-TFL-24')
        .isString ('fail', 'data.eerstekleur', data && data.eerstekleur)
        .done ();
    }
  });
});


dotest.add ('list', function (test) {
  ovio ({
    params: {
      filters: { merk: 'bmw' },
      fields: ['eerstekleur', 'vermogen']
    },
    callback: function (err, data) {
      var embedded = data && data._embedded;

      test (err)
        .isObject ('fail', 'data', data)
        .isCondition ('fail', 'data.totalItemCount', data && data.totalItemCount, '>=', 1)
        .isObject ('fail', 'data._embedded', embedded)
        .isArray ('fail', 'data._embedded.kenteken', embedded && embedded.kenteken)
        .isNotEmpty ('warn', 'data._embedded.kenteken', embedded && embedded.kenteken)
        .done ();
    }
  });
});


// Start the tests
dotest.run ();
