/**
 * Created by erik on 8/3/17.
 */
'use strict';
var request = require("request")

exports.init = function(req, res, next){
    req.flash('succes_msg','fdsafadfdasf')
    res.render('Dashboard/index');
}