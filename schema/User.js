'use strict';

var bcrypt =  require('bcryptjs')
var mongoose = require('mongoose')
var url = 'mongodb://localhost:27017/commevents'
mongoose.connect(url)

var db = mongoose.connection

    var UserSchema = new mongoose.Schema({
        name: { type: String},
        email: { type: String, required:true},
        username: { type: String},
    });

var User = module.exports = mongoose.model('user_waas',UserSchema)

module.exports.createUser = function(newUser, callback){

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.passport, salt, function(err, hash) {
            newUser.password = hash
            newUser.save(callback)
        });
    });

}








