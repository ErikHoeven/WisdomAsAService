/**
 * Created by erik on 8/3/17.
 */
'use strict';
var request = require("request")

exports.init = function(req, res, next){
    var user = {}
    user = req.user||{}
    res.render('Dashboard/index',{user: user});
}