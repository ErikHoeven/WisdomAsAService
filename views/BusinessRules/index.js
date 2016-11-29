'use strict';
var cheerio = require("cheerio");
var request = require("request");
var openkvk = require ('overheid.io') ({
    apikey: '5b140874e1a7b22794b68bfa3464036bc8ad371fa2f50cf5396137ab0fb3ac19',
    dataset: 'kvk'
});
var mongo = require('mongodb');
var db = require('monk')('localhost/commevents');
var companies =  db.get('companyresults');


exports.find = function(req, res, next){
    console.log("find");
    req.query.lookupValue = req.query.lookupValue ? req.query.lookupValue : '';
    req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
    req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
    req.query.sort = req.query.sort ? req.query.sort : '_id';

    var filters = {};
    if (req.query.lookupValue) {
        filters.lookupValue = new RegExp('^.*?'+ req.query.lookupValue +'.*$', 'i');
    }

    req.app.db.models.BusinessRules.pagedFind({
        filters: filters,
        keys: 'lookupValue  tagCattegory  tagScore  typeBusinessRule cattegorycolor  _id',
        limit: req.query.limit,
        page: req.query.page,
        sort: req.query.sort
    }, function(err, results) {
        if (err) {
            return next(err);
        }

        if (req.xhr) {
            res.header("Cache-Control", "no-cache, no-store, must-revalidate");
            results.filters = req.query;
            console.log("Results XHR ");
            res.send(results);
            res.json(results);
        }
        else {
            results.filters = req.query;
            //res.json(results);
            console.log("Results No XHR ");
            //console.log(results);
            res.render('BusinessRules/index', { data: results.data });


        }

    });
};

exports.read = function(req, res, next){
    req.app.db.models.BusinessRules.findById(req.params.id).exec(function(err, BusinessRules) {
        if (err) {
            return next(err);
        }

        if (req.xhr) {
            res.send(BusinessRules);
        }
        else {
            res.render('BusinessRules/details', { BusinessRules: BusinessRules });
        }
    });
};

exports.add = function(req, res){
    res.render('BusinessRules/add');
};

exports.create = function(req, res, next) {
    console.log('START POST: ');

    var workflow = req.app.utility.workflow(req, res);

    workflow.on('validate', function() {
        console.log('START POST(1) IF FORM CHECK: ');
        if (!req.body.lstTypeBusinessRule) {
            workflow.outcome.errors.push('Please enter a TypeBusinessRule.');
            console.log('TypeBusinessRule niet gevuld');
            return workflow.emit('response');
        }

        if(req.body.lstTypeBusinessRule == 'Zoekwaarde'){
            workflow.emit('createLookupValue');
        }
        if(req.body.lstTypeBusinessRule == 'Cattegorie' || req.body.lstTypeBusinessRule == 'Google zoekwaarde' || req.body.lstTypeBusinessRule == 'Scrape Strategy' || req.body.lstTypeBusinessRule == 'Kamer van Koophandel' ){
            console.log('createCattegorie -- Google Zoekwaarde or Scrape Strategy');
            workflow.emit('createCattegorie');
        }
        if(req.body.lstTypeBusinessRule == 'Score') {
            workflow.emit('createScore');
        }


    });

    workflow.on('createLookupValue', function () {
        console.log('STAR POST (2):createLookupValue:');
        var fieldsToSet = {
            typeBusinessRule: req.body.lstTypeBusinessRule,
            lookupValue: req.body.txtLookupValue,
        };
        console.log(fieldsToSet);

        req.app.db.models.BusinessRules.create(fieldsToSet, function (err, BusinessRule) {
            if (err) {
                return workflow.emit('exception', err);
            }

            workflow.outcome.record = BusinessRule;
            // req.flash('success','BusinessRule Added');
            res.location('/BusinessRules');
            res.redirect('/BusinessRules');

        });
    });

    workflow.on('createCattegorie', function () {
            console.log('STAR POST (4):createCattegorie:');



            if ( req.body.lstTypeBusinessRule == 'Google zoekwaarde') {
                var url = 'https://www.google.nl/search?q=' + req.body.txtLookupValue ;
                var linkContent = [];
                var lstTypeBusinessRule = req.body.lstTypeBusinessRule;

                request(url, function (error, res, body ) {
                    if (!error) {
                        var $ = cheerio.load(body),
                            links = $('.srg').find('.g').length;
                            console.info(lstTypeBusinessRule);
                        console.info('---- START SEARCHING ELEMENTS ------------');
                        var rank = 0;
                        $('.g').each(function(){
                            var rawLink = $(this).find('a').attr('href');
                            var patern = new RegExp(/(url\?q=https:\/\/www.)/);

                            if (patern.test(rawLink) == true){
                             var rawLink = $(this).find('a').attr('href');
                             rawLink = rawLink.replace(/(url\?q=https:\/\/www.)/,'');
                             rawLink = rawLink.substring(1,rawLink.indexOf('.'));
                            }
                            else{
                                var rawLink = $(this).find('a').attr('href');
                                rawLink = rawLink.replace(/(url\?q=http:\/\/www.)/,'');
                                rawLink = rawLink.substring(1,rawLink.indexOf('.'));
                            }
                            var content = $(this).find('.st').text();
                            linkContent.push({Link: rawLink, Content: content})


                        });

                        var fieldsToSet = {
                            searchValue: req.body.txtLookupValue,
                            resultValue: linkContent,
                            creationDate: Date()
                        };
                        console.log(fieldsToSet);
                        req.app.db.models.googlesearch.create(fieldsToSet, function(err, BusinessRule) {
                            if (err) {
                                return workflow.emit('exception', err);
                            }
                            workflow.outcome.record = BusinessRule;
                            // req.flash('success','BusinessRule Added');

                        });
                    } else {
                        console.log("We’ve encountered an error: " + error);
                    }
                });

            }

        if ( req.body.lstTypeBusinessRule == 'Kamer van Koophandel') {
            console.info('Kamer van Koophandel')

            var zoekBedrijf = req.body.txtZoekBedrijf
            console.info(zoekBedrijf)


            var site = 'https://openkvk.nl/zoeken/'
            var SiteParemeter = zoekBedrijf
            var maxPages = req.body.txtAantalPaginas

            for (var actPage = 0 ;actPage < maxPages; actPage++) {

                //  setTimeout(function () {

                var url = site + SiteParemeter + '?page=' + actPage

                request(url, function (error, response, html) {
                    if (!error) {


                        console.info('url: '  +  url +  ' is approved ')
                        var $ = cheerio.load(html);

                        $('ul#kvkResults.list-group a').each(function (index, value) {

                            var naam = $('.list-group-item-heading', this).text()
                            var adres = $('.address', this).text()
                            var postcode = $('.zipCode', this).text()
                            var plaats = $('.city', this).text()
                            var companyNumber = $('.companyNumber', this).text()

                            var fieldsToSet = {}


                            fieldsToSet = {
                                companyNumber: companyNumber,
                                naam: naam,
                                adres: adres,
                                postcode: postcode,
                                plaats: plaats,
                                pageNumber: actPage -1,
                                categorie : SiteParemeter,
                                creationDate: Date()
                            };

                            console.info('')
                            console.info('--------------- start fieldsToSet---------------------------')
                            console.info(fieldsToSet)
                            console.info('--------------- einde fieldsToSet---------------------------')
                            console.info('')



                            console.info('--------------- INSERT OBJECT TO MONGO ---------------------------')
                             req.app.db.models.companyResults.create(fieldsToSet, function (err, companyResults) {
                                if (err) {
                                    console.info(err)
                                }
                                workflow.outcome.record = companyResults;
                             })

                        })
                        console.info('--------------- INSERT OBJECT TO MONGO ---------------------------')
                    }
                    else {
                        console.log("We’ve encountered an error: " + error + ': statuscode: ' + response.statusCode)
                    }
                })
            }
              //  }, 6000)

        }
        else {
                console.info('Else Push:');
                console.info(req.body.catValue);

                var fieldsToSet = {
                    typeBusinessRule: req.body.lstTypeBusinessRule,
                    tagCattegory: req.body.txtTagCattegory,
                    cattegoryValue: JSON.parse(req.body.catValue),
                    cattegorycolor: req.body.kleur,
                    creationDate: Date()
                };

                console.log(fieldsToSet);

                req.app.db.models.BusinessRules.create(fieldsToSet, function(err, BusinessRule) {
                    if (err) {
                        return workflow.emit('exception', err);
                    }

                    workflow.outcome.record = BusinessRule;
                    // req.flash('success','BusinessRule Added');
                });
            }
        res.location('/BusinessRules');
        res.redirect('/BusinessRules');
        });

    workflow.emit('validate');
};

exports.findApiData = function(req, res, next) {
    console.log('Start findAPIData: ');
    console.info(req.body._id);
    console.info(req.body.updateField);
    console.info(req.body.updateValue);
    var MongoClient = require('mongodb').MongoClient;
    var assert = require('assert');
    var ObjectId = require('mongodb').ObjectID;
    var url = 'mongodb://localhost:27017/commevents';
    var businesRule = {};


    //function updateBusinessRule(updateField, updateValue){
    var lookupValue;
    var typeBusinessRule;
    var tagCattegory;
    var creationDate;
    var lastUpdatedate;
    var tagScore;

    function setBusinessRule(doc){

        lookupValue = "";
        typeBusinessRule = "";
        tagCattegory = "";
        creationDate = Date();
        tagScore = "";
        lastUpdatedate =  Date();

        // (1)Check if the form values ar not empty
        // (1.a) If form value is empty and document(doc) value is not empty replace it with the doc value
        // (1.b) If form value and doc value is empty return empty string

        console.log("Zoeken op:" + req.body.updateField);

        // lookupValue
        if (req.body.updateField == "opzoekwaarde"){
            lookupValue = req.body.updateValue;

            if (doc.typeBusinessRule != null) { typeBusinessRule = doc.typeBusinessRule; }
            if (doc.tagCattegory != null) { tagCattegory = doc.tagCattegory; }
            if (doc.tagScore != null) { tagScore = doc.tagScore; }
            if (doc.creationDate != null) { creationDate = doc.creationDate; }
        }
        // tagCattegory
        if (req.body.updateField == "cattegorie"){
            tagCattegory = req.body.updateValue;

            if (doc.typeBusinessRule != null) { typeBusinessRule = doc.typeBusinessRule; }
            if (doc.lookupValue != null) { lookupValue = doc.lookupValue; }
            if (doc.tagScore != null) { tagScore = doc.tagScore; }
            if (doc.creationDate != null) { creationDate = doc.creationDate; }
        }

        // typeBusinessRule
        if (req.body.updateField == "typeBusinessRule"){
            console.log(" Is ..... typeBusinessRule. De waarde wordt: " + req.body.updateValue  );
            typeBusinessRule = req.body.updateValue;

            if (doc.tagCattegory != null) { tagCattegory = doc.tagCattegory; }
            if (doc.lookupValue != null) { lookupValue = doc.lookupValue; }
            if (doc.tagScore != null) { tagScore = doc.tagScore; }
            if (doc.creationDate != null) { creationDate = doc.creationDate; }
        }

        //creationDate
        if (doc.creationDate != null){
            creationDate = doc.creationDate;
        }

        // return businessrule as object
        businesRule.lookupValue = lookupValue;
        businesRule.typeBusinessRule = typeBusinessRule;
        businesRule.tagCattegory = tagCattegory;
        businesRule.tagScore = tagScore;
        businesRule.creationDate = creationDate;
        businesRule.lastUpdatedate = lastUpdatedate;

        console.log(businesRule);
        return businesRule
    }

    var findBusinessRule = function (db, callback) {
        var cursor = db.collection('businessrules').find({_id: ObjectId(req.body._id)});
        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc != null) {
                var updBusinessRule = setBusinessRule(doc);
                console.log(updBusinessRule);

                db.collection('businessrules').findAndModify(
                    {_id: ObjectId(req.body._id)}, // query
                    [['_id', 'asc']],  // sort order
                    {$set: {lookupValue: updBusinessRule.lookupValue
                          , typeBusinessRule: updBusinessRule.typeBusinessRule
                          , tagCattegory: updBusinessRule.tagCattegory
                    }}, // replacement, replaces only the field "hi"
                    {}, // options
                    function (err, object) {
                        if (err) {
                            console.warn(err.message);  // returns error if no matching object found
                        } else {
                            console.dir(object);
                        }
                    }
                );
            }
        });
      };

    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);

        findBusinessRule(db, function() {
            db.close();
        });
    });

    //res.redirect('/BusinessRules');

    };

exports.updateCattValues = function(req, res, next) {
    console.info('test');
    console.info(req.body.lstTypeBusinessRule);
    console.info(req.body.txtTagCattegory);
    console.info(req.body.CatValue);
};