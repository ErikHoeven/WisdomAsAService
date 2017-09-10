/**
 * Created by erik on 9/10/17.
 */

'use strict';

var  cheerio = require("cheerio")
    ,request = require("request")
    ,async = require('async')
    ,mongo = require('mongodb')
    ,db = require('monk')('localhost/commevents')
    ,dbm = require('mongodb').MongoClient
    ,companies =  db.get('companyresults')
    ,corpus = db.get('corpus')
    ,url = db.get('url')
    ,d3 = require('d3')
    ,score = db.get('businessrules')
    ,tmp = db.get('tmp')
    ,uri = 'mongodb://localhost:27017/commevents'
    ,tableDefinition = {}
    ,businessrules = db.get('businessrules')

exports.addSpiderException = function(req, res, next) {
    console.info('addSpiderException:')
    console.info(req.body.expection)

    businessrules.insert({typeBusinessRule: 'SpiderGraphExeption' , lookupValue: req.body.expection })

    res.status(200).json({message: 'Succesfull updated'})



}
