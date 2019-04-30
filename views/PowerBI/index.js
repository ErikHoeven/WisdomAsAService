'use strict';

exports.init = function(req, res, next){
    var user = {}
    user = req.user||{}
    res.render('PowerBI/index',{user: user});
}