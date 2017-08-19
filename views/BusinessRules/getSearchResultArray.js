/**
 * Created by erik on 8/19/17.
 */
var  async = require('async')
    ,mongo = require('mongodb')
    ,db = require('monk')('localhost/commevents')
    ,dbm = require('mongodb').MongoClient
    ,d3 = require('d3')
    ,tmp = db.get('tmp')
    ,businessRules = db.get('businessrules')
    ,trainingset = []
    ,test = 'mongodb://localhost:27017/commevents'
    ,trainingSetPercentage = 0
    ,traininSetSize = 0
    ,tweets = []
    ,validatieSetSize = 0
    ,dbtmp = []
    ,natural = require('natural')


exports.getSearchResultArray = function (req, res, next) {
    console.info('getSearchResultArray')
    var id = req.body.id, column = req.body.column
    businessRules.find({_id: id}, function (err,doc) {
            console.info(doc[0][column])
            res.status(200).json(doc[0][column])

    })





}