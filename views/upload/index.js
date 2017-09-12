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
                            callback(null, originalFileName[0] + '-' + Date.now() + '.' + originalFileName[1] );
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
     sys = require('sys'),
     csvdb = db.get('csv'),
     businessRules = db.get('businessrules'),
     excel2json = require("excel-to-json");





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
            var user = {}
            user = req.user||{}
            console.info(files)
            res.render('upload/index', {files: files, user: user})
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
            console.info('Errror!!')
            return res.end("Error uploading file.");
        }
        console.info('succes')
        res.redirect(req.originalUrl)

    });

}

exports.readFile =  function (req, res, next) {
    console.info('readFile:')
    var files = req.body.selectedFiles
        , score = []
    csvdb.remove({})


            fs.createReadStream('./uploads/' + files[0])
                .pipe(csv())
                .on('data', function (data) {
                    //console.log(data)
                    var scoreword = data[0].replace('\t','')
                    scoreword = scoreword.replace(new RegExp("[0-9]"),'')
                    scoreword = scoreword.replace('-','')

                    var scoreNumbers = data[0].split("\t")
                    score.push({scoreword: scoreword, scoreNumber: scoreNumbers[1], files: files})
                    csvdb.insert({scoreword: scoreword, scoreNumber: scoreNumbers[1] })
                })
                .on('end', function (data) {
                    console.log('Finsish reading')
                    //console.info(score)
                    res.status(201).json(score)
                })
}



exports.tranlateWords =  function (req, res, next) {
    console.info('-----------------------  tranlateWords ---------------------------------------')
    var selectedText = req.body.selectedText
        , file = req.body.files
        , locals = {}
        , businessrules = []
        , scoreWoorden = []
        , searchWords = []
        //, lstWoorden = req.body.lstWoorden
        , restult = []
    console.info(selectedText)



    mongo.connect(url, function (err, db) {
        var tasks = [
            // Load business rules
            function (callback) {
                db.collection('businessrules').find({typeBusinessRule: "score"}).toArray(function (err, businessrules) {
                    if (err) return callback(err);
                    locals.businessrules = businessrules;
                    callback();
                })
            },
           // Load CSV from table
            function (callback) {
                db.collection('csv').find({}).toArray(function (err, csv) {
                    if (err) return callback(err);
                    locals.csv = csv;
                    callback();
                });
            },
        ];
        console.info('--------------- EINDE ASYNC ------------------------')
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            businessrules = locals.businessrules
            console.info(businessrules)
            console.info('CSV')
            //console.info(locals.csv)
            searchWords = translateSearchResult(selectedText, locals.csv)
            console.info('searchWords:')
            //console.info(searchWords)
            restult = matchWordWithBusinessRules(searchWords,businessrules)
            console.info('-------------start restult:------------------')
            //console.info(restult)
            console.info('-------------einde restult:------------------')
            res.status(201).json(restult)

        })
    })


    function translateSearchResult(searchWord, lstSearchWord) {
        var relativePosition, setPosition, set, searchWords = [], selectedPosition, isPlusOne = 0, i = 0
        console.info(searchWord)


        for (var i = 0; i < lstSearchWord.length; i++) {
            if (lstSearchWord[i].scoreword == searchWord) {
                relativePosition = i
            }
        }


        set = Math.floor((relativePosition / 3))
        if (set == 0) {
            set = 1
            isPlusOne = 1
        }


        console.info('relativePosition: ' + relativePosition)
        console.info('set: ' + set)

        if (set == 1 && isPlusOne == 1) {
            setPosition = relativePosition
        }

        if (set > 1 || set == 1 && isPlusOne == 0) {
            // relativePosition = 13, set = 3 , 13 - 12 = 1 -> setPosition
            setPosition = relativePosition - (set * 3)
        }

        console.info('setPosition: ' + setPosition)
        if (setPosition == 0) {
            selectedPosition = [relativePosition, relativePosition + 1, relativePosition + 2]
        }

        if (setPosition == 1) {
            selectedPosition = [relativePosition - 1, relativePosition, relativePosition + 1]
        }

        if (setPosition == 2) {
            selectedPosition = [relativePosition - 2, relativePosition - 1, relativePosition]
        }

        selectedPosition.forEach(function (pos) {
            searchWords.push(lstSearchWord[pos])
        })

        return searchWords
    }

    function matchWordWithBusinessRules(searchWords, BusinessRules) {
           var  ruleResult = []
               ,br = {}
               ,foundWord = 0
               ,previousWord = ''

        console.info(searchWords)


        if (BusinessRules.length > 0){
            console.info('-------  br exist !! -----')
            searchWords.forEach(function (word) {
                foundWord = 0
                br = {}
                BusinessRules.forEach(function (rule) {

                    if (rule.lookupValue == word.scoreword){
                        console.info(rule.lookupValue + ' ==  ' + word.scoreword)
                         foundWord = 1
                         br.typeBusinessRule = rule.typeBusinessRule
                         br.ScoreWord = rule.lookupValue
                         br.score = rule.tagScore
                         br.translation = rule.tranlatedWord
                         br.IsUpdated = 1
                     }

                     if (rule.lookupValue != word.scoreword && foundWord == 0 ) {
                         console.info(word.scoreword + ' not found')

                         br.typeBusinessRule = 'score'
                         br.ScoreWord = word.scoreword
                         br.score = word.scoreNumber
                         br.translation = ''
                         br.IsUpdated = 0
                         foundWord = 1
                     }
                })
                if (foundWord == 1 ){
                    ruleResult.push(br)
                    previousWord = word.scoreword
                    foundWord = 0
                }
             })
        }
        else {
            console.info('ELSE ...')
            console.info(searchWords)
            searchWords.forEach(function (word) {
                console.info(word + ' not found')
                br = {}

                br.typeBusinessRule = 'score'
                br.ScoreWord = word.scoreword
                br.score = word.scoreNumber
                br.translation = ''
                br.IsUpdated = 0

                console.info(br)
                ruleResult.push(br)
            })


        }

        return ruleResult
    }

}
exports.saveTranlateWords =  function (req, res, next) {
    console.info('saveTranlateWords')
    var scores = req.body.updateValue
    console.info(scores)
    scores.forEach(function (sc) {
      if (sc.IsAlreadyTranslated == 0){
          businessRules.insert({ typeBusinessRule: 'score'
                                ,lookupValue: sc.lookupWord
                                ,tranlatedWord: sc.TranlatedWord
                                ,tagScore: sc.score  })
      }

    })

    //businessRules.insert({})
    res.status(201).json('saveTranlateWords')

}