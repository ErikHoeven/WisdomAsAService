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
    businessRules = db.get('businessrules'),
    userWaas = db.get('user_waas')


exports.init = function(req, res){
    res.render('signup/index');
};

exports.fileupload = function (req, res, next){
    console.info('Upload File')
    testFolder =  './uploads'
    console.info('------------------------------------')
    var frmUser = {}, locals = [], dbWaasUser, message = []



    upload(req,res,function(err) {
        if(err) {
            console.info('Errror!!')
            return res.end("Error uploading file.");
        }
        console.info('succes')
        console.info(req.body.name)

        frmUser.name = req.body.name
        frmUser.email = req.body.email
        frmUser.username = req.body.username
        frmUser.password = req.body.password
        frmUser.confirmpassword = req.body.confirm

        mongo.connect(url, function (err, db) {
            var tasks = [
                // Load users
                function (callback) {
                    db.collection('user_waas').find({name: frmUser.name}).toArray(function (err, wUser) {
                        if (err) return callback(err);
                        locals.wUser = wUser;
                        callback();
                    })
                }
                // Load CSV from table
                //function (callback) {
                //    db.collection('csv').find({}).toArray(function (err, csv) {
                //        if (err) return callback(err);
                //        locals.csv = csv;
                //        callback();
                //    });
                //},
            ];
            console.info('--------------- EINDE ASYNC ------------------------')
            async.parallel(tasks, function (err) {
                if (err) return next(err);
                db.close();
                dbWaasUser = locals.wUser
                message = checkUserExist(dbWaasUser,frmUser)
                if (message.length == 0 || !message){
                    userWaas.insert(frmUser)
                }
                console.info(message)
                //console.info(locals.csv)
                //searchWords = translateSearchResult(selectedText, locals.csv)
                //console.info('searchWords:')
                //console.info(searchWords)
                //restult = matchWordWithBusinessRules(searchWords,businessrules)
                //console.info('-------------start restult:------------------')
                //console.info(restult)
                //console.info('-------------einde restult:------------------')
                //res.status(201).json(restult)
                res.render('signup/index')

            })
        })
    });
}

function checkUserExist(objdbUser,frmUser) {
    var message = []
    if(objdbUser[0].name == frmUser.name){
        message.push('Username already exist')
    }
    if (objdbUser[0].email == frmUser.email){
        message.push('email already exist')
    }
    if (objdbUser[0].username == frmUser.username){
        message.push('username already exist')
    }
    return message
}