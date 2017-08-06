'use strict';

exports.init = function(req, res){
   var user = {}
   user = req.user||{}
   res.render('index', {user: user});
};
