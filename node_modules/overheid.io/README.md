overheid.io
===========

overheid.io API wrapper

[![npm](https://img.shields.io/npm/v/overheid.io.svg?maxAge=3600)](https://github.com/fvdm/nodejs-overheid.io/blob/master/CHANGELOG.md)
[![Build Status](https://travis-ci.org/fvdm/nodejs-overheid.io.svg?branch=master)](https://travis-ci.org/fvdm/nodejs-overheid.io)
[![Dependency Status](https://gemnasium.com/badges/github.com/fvdm/nodejs-overheid.io.svg)](https://gemnasium.com/github.com/fvdm/nodejs-overheid.io#runtime-dependencies)
[![Coverage Status](https://coveralls.io/repos/github/fvdm/nodejs-overheid.io/badge.svg?branch=master)](https://coveralls.io/github/fvdm/nodejs-overheid.io?branch=master)

* [Node.js](https://nodejs.org)
* [overheid.io](https://overheid.io)
* [API documentation](https://overheid.io/documentatie)


Example
-------

```js
var ovio = require ('overheid.io') ({
  apikey: 'abc123',
  dataset: 'rdw'
});

ovio ({
  path: '4-TFL-24',
  params: { fields: ['eerstekleur'] },
  callback: function (err, data) {
    if (err) { return console.log (err); }

    console.log (data.eerstekleur);
  }
});
```


Installation
------------

`npm install overheid.io`


Configuration
-------------

This module provides one _function_, use it for configuration.


#### Config parameters

param   | type    | required | default | description
:-------|:--------|:---------|:--------|:--------------------
apikey  | string  | yes      |         | Your account API key
dataset | string  | no       |         | Which dataset to use
timeout | integer | no       | 5000    | Wait time out in ms


```js
var ovio = require ('overheid.io') ({
  apikey: 'abc123',
  dataset: 'voertuiggegevens'
});
```


API function
------------

param    | type     | required | default                    | required
:--------|:---------|:---------|:---------------------------|:------------------------------
path     | string   | no       |                            | Resource path, i.e. `DA-GO-12`
params   | object   | no       |                            | Parameters to send along
dataset  | string   | no       | `config.dataset`           | Which dataset to use
timeout  | integer  | no       | `5000` or `config.timeout` | Wait timeout in ms
callback | function | yes      |                            | `function (err, data) {}`


```js
ovio ({
  path: '4-TFL-24',
  params: { fields: ['eerstekleur'] },
  callback: function (err, data) {
    if (err) { return console.log (err); }
    console.log (data.eerstekleur);
  }
});
```


Unlicense
---------

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>


Author
------

[Franklin van de Meent](https://frankl.in)
