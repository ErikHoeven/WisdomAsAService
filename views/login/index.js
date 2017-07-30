'use strict';
var request = require("request")

exports.init = function(req, res, next){
    req.flash('succes_msg','fdsafadfdasf')
    res.render('login/index');
}





