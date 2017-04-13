/**
 * Created by erik on 3/24/17.
 */
var  async = require('async')
    ,mongo = require('mongodb')
    ,db = require('monk')('localhost/commevents')
    ,dbm = require('mongodb').MongoClient
    ,d3 = require('d3')
    ,tmp = db.get('tmp')
    ,dbtrainingset = db.get('trainingset')
    ,trainingset = []
    ,test = 'mongodb://localhost:27017/commevents'
    ,trainingSetPercentage = 0
    ,traininSetSize = 0
    ,tweets = []
    ,validatieSetSize = 0
    ,dbtmp = []
    ,natural = require('natural')




exports.BuildSentimentModel = function (req, res, next) {
    console.info('BuildSentimentModel')
    console.info('TrainingsetSize: ' + req.body.trainingSetSize)
    trainingSetPercentage = req.body.trainingSetSize

    mongo.connect(test, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [
            // Load Tweets from table
            function (callback) {
                db.collection('STG_LEADS_AUTOSCHADE').find({}).toArray(function (err, tweets) {
                    if (err) return callback(err);
                    locals.tweets = tweets;
                    callback();
                });
            },
            function (callback) {
                db.collection('tmp').find({}).toArray(function (err, dbtmp) {
                    if (err) return callback(err);
                    locals.dbtmp = dbtmp;
                    callback();
                });
            }
        ];
        console.info('--------------- START ASYNC ------------------------')
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            tweets = locals.tweets
            dbtmp = locals.dbtmp
            traininSetSize = Math.floor(tweets.length / 100 * trainingSetPercentage)
            validatieSetSize = tweets.length - traininSetSize

            console.info('traininSetSize: ' + traininSetSize)
            console.info('validatieSetSize: ' + validatieSetSize)

            console.info('BuildingTrainingSet ....')
            dbtrainingset.remove({})
            trainingset = []
            for (var i = 0; i < traininSetSize; i++){
                //console.info('---Tweet: ' + i + '----------------------------------------------')
                tokens = tokenizeTekst(tweets[i].text, tweets[i]._id)
                var score = searchSentiment(tokens, dbtmp)

                dbtrainingset.insert({tekst: tweets[i].text, score: score, _id: tweets[i]._id})
                trainingset.push({tekst: tweets[i].text, score: score, _id: tweets[i]._id})
            }
            console.info(trainingset.length)
            res.status(200).json(trainingset)
        })
    })

}

function tokenizeTekst(tweet, tweetid) {
    var tweetArray = []
    tweetArray = tweet.split(' ')

    tweetArray.forEach(function (item) {
        var patt1 = /[,!:]/g
        item.replace(patt1,'')

    })

    return tweetArray
}

function searchSentiment (tokens, sentimentlist){
    var totalScore = 0

    tokens.forEach(function (token) {
        sentimentlist.forEach(function (sentiment) {
            if(token.toLowerCase() == sentiment.woord.toLowerCase()){
                totalScore =+ Number(sentiment.score)
            }
        })
    })

    return totalScore
}

exports.updateTrainingSet = function (req, res, next) {
    var key =  req.body.updateKey, value = req.body.updateValue, column = req.body.updateColumn, updateSet = {}

    console.info('updateTrainingSet')
    console.info('updateValue: ' + value)
    console.info('updateKey: ' + key)
    console.info('updateColumn: ' + column )
    updateSet[column] =  value
    console.info(updateSet)

    dbtrainingset.update({_id: key}, {$set: updateSet}, false, true)

    mongo.connect(test, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [
            // Load Tweets from table
            function (callback) {
                db.collection('trainingset').find({}).toArray(function (err, trainingset) {
                    if (err) return callback(err);
                    locals.trainingset = trainingset;
                    callback();
                });
            }
        ];
        console.info('--------------- START ASYNC ------------------------')
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            trainingset = []

            locals.trainingset.forEach(function (row) {
                trainingset.push({_id: row._id, tekst: row.tekst, score: row.score })
            })




            res.status(200).json(trainingset)
        })
    })
}


exports.deleteRowTrainingsSet = function (req, res, next) {
    var id = req.body.deleteKey
    console.info('deleteRowTrainingsSet: ' + id )
    dbtrainingset.remove({_id: id})

    mongo.connect(test, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [
            // Load Tweets from table
            function (callback) {
                db.collection('trainingset').find({}).toArray(function (err, trainingset) {
                    if (err) return callback(err);
                    locals.trainingset = trainingset;
                    callback();
                });
            }
        ];
        console.info('--------------- START ASYNC ------------------------')
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            trainingset = []

            locals.trainingset.forEach(function (row) {
                trainingset.push({_id: row._id, tekst: row.tekst, score: row.score })
            })
            res.status(200).json(trainingset)
        })
    })
}

exports.model = function (req, res, next) {
    console.info('Building model.....')
    classifier = new natural.BayesClasifier()

    mongo.connect(test, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [
            // Load Tweets from table
            function (callback) {
                db.collection('trainingset').find({}).toArray(function (err, trainingset) {
                    if (err) return callback(err);
                    locals.trainingset = trainingset;
                    callback();
                });
            }
        ];
        console.info('--------------- START ASYNC ------------------------')
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            trainingset = []

            locals.trainingset.forEach(function (row) {
                //trainingset.push({_id: row._id, tekst: row.tekst, score: row.score })
                classifier.addDocument(row.text, row.score)
            })

            classifier.train()



            res.status(200).json('ModelTraind')
        })
    })



}


exports.showBusinessRules = function (req, res, next) {

    console.info('Building model.....')
    var businessrules = []


    mongo.connect(test, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [
            // Load Tweets from table
            function (callback) {
                db.collection('businessrules').find({}).toArray(function (err, businessrules) {
                    if (err) return callback(err);
                    locals.businessrules = businessrules;
                    callback();
                });
            }
        ];
        console.info('--------------- START ASYNC ------------------------')
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();

            res.status(200).json(locals.businessrules)
        })
    })



}