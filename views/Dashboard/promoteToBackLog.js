/**
 * Created by erik on 12/2/17.
 */
'use strict';

var async = require('async'),
    db = require('monk')('localhost/commevents'),
    backlog = db.get('backlog'),
    moment = require('moment'),
    d3 = require('d3')

exports.promoteToBackLog = function (req, res, next) {
        backlog.insert(req.body.dataset)

    res.status(200).json({message: 'User Stories to planning'})

}
