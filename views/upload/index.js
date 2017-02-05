/**
 * Created by erik on 1/31/17.
 */
'use strict';

// Global variable
var multer  =   require('multer'),
    cheerio = require("cheerio"),
    fs = require('fs'),
    csv = require('fast-csv'),
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
     PropertiesReader = require('properties-reader'),
     upload = multer({ storage : storage}).single('upload'),
     br = db.get('businessrules'),
     url = 'mongodb://localhost:27017/commevents',
     translate = require('translate'),
     sys = require('sys');


// START PROGRAM
exports.init = function(req, res) {
    console.info('Show file list:')
    var files = []


    fs.readdir(testFolder, function (err, item) {
        if(item){

            item.forEach(function (f) {

                var stat = fs.statSync(testFolder + f)
                var file = {}
                file.creationDate =  stat.birthtime
                file.filename = f
                file.AddToDataStore = 'NaN'

                files.push (file)
            })
            console.info(files)
            res.render('upload/index', {files: files})
        }
        else {
            console.log(err)
        }
    })
}

exports.fileupload = function (req, res, next){
    console.info('Upload File')
    //console.info(req)
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }

        res.redirect(req.originalUrl)

    });
}

exports.readFile =  function (req, res, next) {
    console.info('readFile:')
    var files = req.body.selectedFiles
    var locals = {};
    var businessrules = []
    var scoreWoorden = []

    mongo.connect(url, function (err, db) {


        var tasks = [   // Load tweets
            // Load business rules
            function (callback) {
                db.collection('businessrules').find({ typeBusinessRule: "score"}).toArray(function (err, businessrules) {
                    if (err) return callback(err);
                    locals.businessrules = businessrules;
                    callback();
                });
            }

        ];
        console.info('--------------- EINDE ASYNC ------------------------')
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            businessrules = locals.businessrules

            fs.createReadStream('./uploads/' + files[0])
                .pipe(csv())
                .on('data', function (data) {
                    //console.log(data)
                    var scoreword = data[0].replace('\t','')
                    scoreword = scoreword.replace(new RegExp("[0-9]"),'')
                    scoreword = scoreword.replace('-','')
                    scoreWoorden.push(scoreword)
                })
                .on('end', function (data) {
                    console.log('Finsish reading')
                    console.info(scoreWoorden)
                    res.status(201).json(scoreWoorden)
                })
            console.info(scoreWoorden)

        })
    })
}



function scoreWoordenLijst(scoreWoord) {

}

