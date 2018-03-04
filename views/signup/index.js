'use strict';

var multer  =   require('multer'),
    request = require("request"),
    fs = require('fs'),
    async = require('async'),
    mongo = require('mongodb'),
    db = require('monk')('localhost/commevents'),
    br = db.get('businessrules'),
    url = 'mongodb://localhost:27017/commevents',
    sys = require('sys'),
    businessRules = db.get('businessrules'),
    userWaas = db.get('user_waas'),
    moment = require('moment')




exports.init = function(req, res){
    res.render('signup/index');
};

exports.fileupload = function (req, res, next) {
    console.info('Upload File')
    console.info('------------------------------------')

    var frmUser = {}
      , message = []
      , originalFileName = []
      ,uploadFolder = './uploads/'

    if (!fs.existsSync(uploadFolder)){
        fs.mkdirSync(uploadFolder);
    }


    var storage =  multer.diskStorage({
            destination: function (req, file, callback) {
                console.info({user: req.body.name})

                // Create per user a folder in the upload directory
                uploadFolder = uploadFolder + req.body.username

                if (!fs.existsSync(uploadFolder)){
                    fs.mkdirSync(uploadFolder);
                }

                callback(null, uploadFolder);
            },
            filename: function (req, file, callback) {
                originalFileName = file.originalname.split('.')
                callback(null, originalFileName[0] + '-' + moment().format('YYYYMMDD'));
            }
        }),
    upload = multer({ storage : storage}).single('uploadFile')


    upload(req, res, function (err) {
        if (err) {
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
        frmUser.profilePictureURI = '.' + uploadFolder + '/' + originalFileName[0] + '-' + moment().format('YYYYMMDD')

        userWaas.findOne({username: frmUser.username}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                userWaas.insert(frmUser)
                res.render('./', {message: 'succesfull signup'})
            }
            if (user) {
                message = checkUserExist(user)
                res.render('/signup', {message: message})
            }
            return done(null, user);
        })


    })
}

function checkUserExist(objdbUser,frmUser) {
    var message = []
    if(objdbUser[0].name == frmUser.name){
        message.push('name already exist')
    }
    if (objdbUser[0].email == frmUser.email){
        message.push('email already exist')
    }
    if (objdbUser[0].username == frmUser.username){
        message.push('username already exist')
    }
    return message
}

