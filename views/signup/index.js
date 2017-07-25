'use strict';

var multer  =   require('multer'),
    fs = require('fs'),
    testFolder = './uploads/',
    request = require("request"),
    originalFileName = [],
    storage =  multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './uploads');
        },
        filename: function (req, file, callback) {
            originalFileName = file.originalname.split('.')
            callback(null, originalFileName[0] + '-' + Date.now());
        }
    }),
    async = require('async'),
    mongo = require('mongodb'),
    db = require('monk')('localhost/commevents'),
    upload = multer({ storage : storage}).single('uploadFile'),
    br = db.get('businessrules'),
    url = 'mongodb://localhost:27017/commevents',
    sys = require('sys'),
    businessRules = db.get('businessrules');


exports.init = function(req, res){
    res.render('signup/index');
};

exports.fileupload = function (req, res, next){
    console.info('Upload File')
    testFolder =  './uploads'
    console.info('------------------------------------')
    var name, email, username, password, confirmpassword



    upload(req,res,function(err) {
        if(err) {
            console.info('Errror!!')
            return res.end("Error uploading file.");
        }
        console.info('succes')
        console.info(req.body.name)

        name = req.body.name
        email = req.body.email
        username = req.body.username
        password = req.body.password
        confirmpassword = req.body.confirm




        res.render('signup/index')

    });
}