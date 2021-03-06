'use strict';
var cheerio = require("cheerio");
var request = require("request");
var openkvk = require ('overheid.io') ({
    apikey: '5b140874e1a7b22794b68bfa3464036bc8ad371fa2f50cf5396137ab0fb3ac19',
    dataset: 'kvk'
});
var async = require('async');
var mongo = require('mongodb');
var db = require('monk')('localhost/commevents');
var companies =  db.get('companyresults');
var corpus = db.get('corpus');
var dbGraph = db.get('graph')
var d3 = require('d3')


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
            var user = {}
            user = req.user||{}
            res.render('BusinessRules/index', { data: results.data, user: user });


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
            var user = {}
            user = req.user||{}
            res.render('BusinessRules/details', { BusinessRules: BusinessRules, user:user });
        }
    });
};

exports.add = function(req, res){
    var user = {}
    user = req.user||{}
    res.render('BusinessRules/add',{user:user});
};

exports.create = function(req, res, next) {
    console.log('START POST: ');

    var workflow = req.app.utility.workflow(req, res);

    workflow.on('validate', function() {
        console.log('START POST(1) IF FORM CHECK: ');
        console.info(req.body.lstTypeBusinessRule)
        if (!req.body.lstTypeBusinessRule) {
            workflow.outcome.errors.push('Please enter a TypeBusinessRule.');
            console.log('TypeBusinessRule niet gevuld');
            return workflow.emit('response');
        }

        //Workflow Zoekwaarde
        if(req.body.lstTypeBusinessRule == 'Zoekwaarde' || req.body.lstTypeBusinessRule == 'WordCloudExceptions'){
            workflow.emit('createLookupValue');
        }
        //Workflow createCattegorie
        if(req.body.lstTypeBusinessRule == 'Cattegorie' ||
           req.body.lstTypeBusinessRule == 'Google zoekwaarde' ||
           req.body.lstTypeBusinessRule == 'Scrape Strategy' ||
           req.body.lstTypeBusinessRule == 'Kamer van Koophandel' ||
           req.body.lstTypeBusinessRule == 'Dictionary' ||
           req.body.lstTypeBusinessRule == 'BuildGraph' ||
           req.body.lstTypeBusinessRule == 'Upload'
        ){
            console.log('createCattegorie -- Google Zoekwaarde or Scrape Strategy');
            workflow.emit('createCattegorie');
        }

        //Workflow score
        if(req.body.lstTypeBusinessRule == 'Score') {
            workflow.emit('createScore');
        }

        if(req.body.lstTypeBusinessRule == 'maintenanceAssignment') {
            workflow.emit('maintenanceAssignment');
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


        if (req.body.lstTypeBusinessRule == 'Google zoekwaarde') {
            var url = 'https://www.google.nl/search?q=' + req.body.txtLookupValue;
            var linkContent = [];
            var lstTypeBusinessRule = req.body.lstTypeBusinessRule;

            request(url, function (error, res, body) {
                if (!error) {
                    var $ = cheerio.load(body),
                        links = $('.srg').find('.g').length;
                    console.info(lstTypeBusinessRule);
                    console.info('---- START SEARCHING ELEMENTS ------------');
                    var rank = 0;
                    $('.g').each(function () {
                        var rawLink = $(this).find('a').attr('href');
                        var patern = new RegExp(/(url\?q=https:\/\/www.)/);

                        if (patern.test(rawLink) == true) {
                            var rawLink = $(this).find('a').attr('href');
                            rawLink = rawLink.replace(/(url\?q=https:\/\/www.)/, '');
                            rawLink = rawLink.substring(1, rawLink.indexOf('.'));
                        }
                        else {
                            var rawLink = $(this).find('a').attr('href');
                            rawLink = rawLink.replace(/(url\?q=http:\/\/www.)/, '');
                            rawLink = rawLink.substring(1, rawLink.indexOf('.'));
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
                    req.app.db.models.googlesearch.create(fieldsToSet, function (err, BusinessRule) {
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

        if (req.body.lstTypeBusinessRule == 'Kamer van Koophandel') {
            console.info('Kamer van Koophandel');

            var zoekBedrijf = req.body.txtZoekBedrijf;
            console.info(zoekBedrijf);


            var site = 'https://openkvk.nl/zoeken/';
            var SiteParemeter = zoekBedrijf;
            var maxPages = req.body.txtAantalPaginas;

            for (var actPage = 0; actPage < maxPages; actPage++) {

                //  setTimeout(function () {

                var url = site + SiteParemeter + '?page=' + actPage;

                request(url, function (error, response, html) {
                    if (!error) {


                        console.info('url: ' + url + ' is approved ');
                        var $ = cheerio.load(html);

                        $('ul#kvkResults.list-group a').each(function (index, value) {

                            var naam = $('.list-group-item-heading', this).text();
                            var adres = $('.address', this).text();
                            var postcode = $('.zipCode', this).text();
                            var plaats = $('.city', this).text();
                            var companyNumber = $('.companyNumber', this).text();

                            var fieldsToSet = {};


                            fieldsToSet = {
                                companyNumber: companyNumber,
                                naam: naam,
                                adres: adres,
                                postcode: postcode,
                                plaats: plaats,
                                pageNumber: actPage - 1,
                                categorie: SiteParemeter,
                                creationDate: Date()
                            };

                            console.info('');
                            console.info('--------------- start fieldsToSet---------------------------');
                            console.info(fieldsToSet);
                            console.info('--------------- einde fieldsToSet---------------------------');
                            console.info('');


                            console.info('--------------- INSERT OBJECT TO MONGO ---------------------------');
                            req.app.db.models.companyResults.create(fieldsToSet, function (err, companyResults) {
                                if (err) {
                                    console.info(err)
                                }
                                workflow.outcome.record = companyResults;
                            })

                        });
                        console.info('--------------- INSERT OBJECT TO MONGO ---------------------------')
                    }
                    else {
                        console.log("We’ve encountered an error: " + error + ': statuscode: ' + response.statusCode)
                    }
                })
            }
        }

        if (req.body.lstTypeBusinessRule == 'Dictionary') {
            console.info('---------------------- ' + req.body.lstTypeBusinessRule + ' ----------------------------------------');

            //A. Automatisch zoeken
            if (req.body.lstActie == 'Zoeken') {

                // A.1 Set the time out to give the database time tot store the URL in the database
                setTimeout(function () {
                    console.info('---------------------- Zelfstandig naamwoorden ----------------------------------------');
                    var znsite = 'https://nl.wiktionary.org/wiki/Categorie:Zelfstandig-naamwoordsvorm_in_het_Nederlands';
                    var znurl = znsite;

                    // A.1.1 Request for the website and fetch URL to the function
                    request(znurl, function (error, response, html) {
                        if (!error) {
                            console.info(znsite + ': is aproved');
                            var $ = cheerio.load(html);

                            //A.1.1.1 CATCH URLS CONTENT
                            $('table a').each(function (i, el) {
                                var insURL = $(this).attr('href')
                                insURL = insURL.substring(2)
                                insURL = 'https://' + insURL

                                //A.1.1.2 Write content to JSON
                                var fieldsToSet = {
                                    volledigWerkwoord: '',
                                    werkwoordInVerledentijd: '',
                                    voltooiddeelwoord: '',
                                    typeWoord: '',
                                    zelfstandignaamwoord: '',
                                    URL: insURL
                                };

                                // A.1.1.3 Write JSON to MongoDB
                                corpus.insert(fieldsToSet);
                            })

                        }

                        else {
                            console.log("We’ve encountered an error: " + error + ': statuscode: ' + response.statusCode)
                        }
                    })
                }, 5000);

                // B SET TIMEOUT TO GIVE THE DATABASE TIME TO STORE DATA
                setTimeout(function () {
                    // B.1 Find URLS in MongoDb
                    corpus.find({}, {fields: {URL: 1}}).then((docs) => {
                        console.info('Aantal URLS is: ' + docs.length);

                    //B.1.1 LOOP THROUGH URL
                    for (var i = 0; i < docs.length; i++) {
                        var znwURL = docs[i].URL;

                        //B.1.1 GET WEBPAGE FROM URL
                        request(znwURL, function (error, response, html) {
                            if (!error) {
                                // B.1.1.1 GET CONTENT FROM URL
                                var $ = cheerio.load(html);
                                $('.mw-content-ltr li a').each(function (i, el) {
                                    var zelfstandNaamWoord = $(this).text();

                                    // B.1.1.2 WRITE CONTENT TO JSON

                                    var fieldsToSet = {
                                        volledigWerkwoord: '',
                                        werkwoordInVerledentijd: '',
                                        voltooiddeelwoord: '',
                                        typeWoord: 'ZelfstandNaamWoord',
                                        woord: zelfstandNaamWoord,
                                        volgLetter: zelfstandNaamWoord.substring(0, 1),
                                        URL: znwURL
                                    };

                                    // B.1.1.2 WRITE CONTENT TO JSON
                                    corpus.insert(fieldsToSet)

                                })
                                //B.1.2 REMOVE URLS from the Corpus
                                corpus.remove({'typeWoord': ""})
                            }
                            else {
                                console.log("We’ve encountered an error: " + error + ': statuscode: ')

                            }
                        })
                    }
                })
                }, 10000)
            }
            // C HANDMATIG TOEVOEGEN VAN WOORDVORMEN
            if (req.body.lstActie == 'handmatig toevoegen') {
                var txtWoord = req.body.txtWoord
                var lstWoordvorm = req.body.lstWoordvorm
                var fieldToSet = {}


                if (lstWoordvorm == 'ZelfstandigNaamWoord') {
                    var fieldsToSet = {
                        volledigWerkwoord: '',
                        werkwoordInVerledentijd: '',
                        voltooiddeelwoord: '',
                        typeWoord: 'ZelfstandNaamWoord',
                        woord: txtWoord,
                        volgLetter: txtWoord.substring(0, 1),
                        URL: 'handmatig'
                    }
                }

                if (lstWoordvorm == 'BijvoegelijkNaamWoord') {
                    var fieldsToSet = {
                        volledigWerkwoord: '',
                        werkwoordInVerledentijd: '',
                        voltooiddeelwoord: '',
                        typeWoord: 'Bijvoegelijknaamwoord',
                        woord: txtWoord,
                        volgLetter: txtWoord.substring(0, 1),
                        URL: 'handmatig'
                    }
                }

                if (lstWoordvorm == 'Volledig werkwoord') {
                    var fieldsToSet = {
                        volledigWerkwoord: txtWoord,
                        werkwoordInVerledentijd: '',
                        voltooiddeelwoord: '',
                        typeWoord: 'Volledig werkwoord',
                        volgLetter: txtWoord.substring(0, 1),
                        woord: '',
                        URL: 'handmatig'
                    }
                }

                if (lstWoordvorm == 'Verledentijd') {
                    var fieldsToSet = {
                        volledigWerkwoord: '',
                        werkwoordInVerledentijd: txtWoord,
                        voltooiddeelwoord: '',
                        typeWoord: 'Verledentijd',
                        woord: '',
                        volgLetter: txtWoord.substring(0, 1),
                        URL: 'handmatig'
                    }
                }

                if (lstWoordvorm == 'VoltooidDeelWoord') {
                    var fieldsToSet = {
                        volledigWerkwoord: '',
                        werkwoordInVerledentijd: txtWoord,
                        voltooiddeelwoord: '',
                        typeWoord: 'VoltooidDeelWoord',
                        woord: '',
                        volgLetter: txtWoord.substring(0, 1),
                        URL: 'handmatig'
                    }
                }

                corpus.insert(fieldsToSet)
            }
        }


        // BuildGraph
        if (req.body.lstTypeBusinessRule == 'BuildGraph') {

            console.info('--------------------------  START ASYNC ------------------------------------');

            var url = 'mongodb://localhost:27017/commevents'
            mongo.connect(url, function (err, db) {

                var locals = {};

                var tasks = [   // Load tweets
                    function (callback) {
                        db.collection('STG_LEADS_AUTOSCHADE').find({}).toArray(function (err, tweets) {
                            if (err) return callback(err);
                            locals.tweets = tweets;
                            callback();
                        });
                    },
                    // Load corpus
                    function (callback) {
                        db.collection('corpus').find({typeWoord: "ZelfstandNaamWoord" }).toArray(function (err, corpus) {
                            if (err) return callback(err);
                            locals.corpus = corpus;
                            callback();
                        });
                    },
                    // Load business rules
                    function (callback) {
                        db.collection('businessrules').find({ typeBusinessRule: "Cattegorie"}).toArray(function (err, businessrules) {
                            if (err) return callback(err);
                            locals.businessrules = businessrules;
                            callback();
                        });
                    },

                ];
                console.info('--------------- EINDE ASYNC ------------------------')
                async.parallel(tasks, function (err) {
                    if (err) return next(err);
                    db.close();

                    var stgGraph = []
                    var max_tweet  =  locals.tweets.length
                    var dmNodeGraph = []
                    var dmLinkGraph = []
                    var dmGraph = {}
                    var pFilterZNW = []
                    //var dmNodeChildCount = []
                    var dmLinkChildCount = []
                    var invalidEntriesChild = 0

                    dbGraph.remove({})
                    //stgGraph.push(tokenizeTekst(locals.tweets[i].text, locals.corpus, locals.businessrules, 0 ))

                    // 1. Loopt throug tweets and tokenize text
                    for (var i = 0; i < max_tweet; i++ ){
                        stgGraph.push(tokenizeTekst(locals.tweets[i].text, locals.corpus, locals.businessrules, i))
                    }

                    // 2. Add Master and parents Node to dmNodeGraph
                    var stgNodeGraph = stgGraph[0].nodes
                    stgNodeGraph.forEach(function (item) {
                            dmNodeGraph.push(item)
                    })

                    // 3.A Add Children Nodes
                    var AantalNodes
                    for (var i = 1 ; i < stgGraph.length; i++){
                        var nodes =stgGraph[i].nodes
                        nodes.forEach(function (item) {
                            if (item.type == 'child'){
                                dmNodeGraph.push(item)
                                //dmNodeChildCount.push(item)
                            }
                        })
                    }

                    // 3.B Group by Id and Value and count appereance
                    var groupByNode =  d3.nest()
                        .key(function(d) { return d.id + '|' + d.group  + '|' + d.type + '|' + d.color})
                        .rollup(function(v) { return v.length; })
                        .entries(dmNodeGraph);


                    // 3.C Clear origninal node structure
                    dmNodeGraph = []

                    console.info(groupByNode)

                    // 3.D loop through Node and recreate Nodestructure
                    var index = 0
                    groupByNode.forEach(function (item) {
                       var groupKeys = item.key.split('|')
                       var id = groupKeys[0]
                       var group = groupKeys[1]
                       var type = groupKeys[2]
                       var color = groupKeys[3]
                       var aantal = item.values

                        dmNodeGraph.push({id: id, group: group, type: type, color: color})
                       //}

                    })

                    // 4. Add Master and parents links to dmLinkGraph
                    var stgLinksGraph = stgGraph[0].links
                    stgLinksGraph.forEach(function (item) {
                        dmLinkGraph.push(item)

                    })

                    // 3. Add Children links to dmLinkGraph
                    for (var i = 1 ; i < stgGraph.length; i++){
                        var links = stgGraph[i].links
                        links.forEach(function (item) {
                            if (item.type == 'child'){
                                dmLinkGraph.push(item)
                                dmLinkChildCount.push(item)
                            }
                        })
                    }

                    // 4 Group and count the prevents
                    var groupByLink =  d3.nest()
                        .key(function(d) { return d.source + '|' + d.target + '|' + d.value; })
                        .rollup(function(v) { return v.length; })
                        .entries(dmLinkChildCount);

                    var groupByParentLink =  d3.nest()
                        .key(function(d) { return d.target + '|' + d.value; })
                        .rollup(function(v) { return v.length; })
                        .entries(dmLinkChildCount);


                    //5. Loop trough groupsets and set value to aantal

                    console.info('--------------Group and Count ----------------------')
                    //4.A.1 Loop through nodes

                    // 5.A Per Child
                    for (var i = 0; i < dmNodeGraph.length; i++){
                        var id  = dmNodeGraph[i].id
                        var group = dmNodeGraph[i].group
                        var value = 0;

                        // 4.A.1.A Loop per Node through the grouped links
                        for (var gl = 0 ; gl < groupByLink.length ; gl++){
                            var keys = groupByLink[gl].key.split('|');
                            if (keys[0] == id && keys[2] == group){
                                value = groupByLink[gl].values
                            }
                        }
                        dmNodeGraph[i].aantal = value
                    }

                    // 5.B  Per Parent
                    for (var i = 0; i < dmNodeGraph.length; i++){
                        var id  = dmNodeGraph[i].id
                        var group = dmNodeGraph[i].group
                        var value= dmNodeGraph[i].aantal
                         // 5.B.1 Loop per Node through the grouped links
                        for (var gl = 0 ; gl < groupByParentLink.length ; gl++){
                            var keys = groupByParentLink[gl].key.split('|');
                            if (keys[0] == id && keys[1] == group && dmNodeGraph[i].aantal == 0){
                                value = groupByParentLink[gl].values
                            }

                        }
                        dmNodeGraph[i].aantal = value
                    }

                    // 5.C  Per master
                    var masterSet = []

                    groupByParentLink.forEach(function (group) {
                        var keys = group.key.split('|')
                        var target = keys[1]

                        masterSet.push({target: target, value: group.values})
                    })

                   var groupbyMaster = d3.nest()
                        .key(function(d) { return d.target  })
                        .rollup(function(v) { return d3.sum(v, function(d) { return d.value; }) })
                        .entries(masterSet);

                    console.info('groupbyMaster:')
                    console.info(groupbyMaster)

                    for (var i = 0; i < dmNodeGraph.length; i++){
                        var group = dmNodeGraph[i].group
                        var value = dmNodeGraph[i].aantal
                        var type  = dmNodeGraph[i].type
                        // 5.B.1 Loop per Node through the grouped links
                        for (var gl = 0 ; gl < groupbyMaster.length ; gl++){
                            var keys = groupbyMaster[gl].key

                            if (keys == group && type == 'master'){
                                value = groupbyMaster[gl].values
                            }

                        }
                        dmNodeGraph[i].aantal = value
                    }

                    dmGraph.nodes = dmNodeGraph
                    dmGraph.links = dmLinkGraph
                    
                    setTimeout(function () {
                        dbGraph.insert(dmGraph)
                    },10000)

                    console.info('--------------Group and count ----------------------')
                })

            })
        }

        //Upload file
        if(req.body.lstTypeBusinessRule == 'Upload'){
            console.info('Upload!!!')
            var router = express.Router()

        }


        if(req.body.lstTypeBusinessRule != 'Dictionary'
            && req.body.lstTypeBusinessRule != 'BuildGraph'
            && req.body.lstTypeBusinessRule != 'Kamer van Koophandel'
            && req.body.lstTypeBusinessRule != 'Google zoekwaarde'
            && req.body.lstTypeBusinessRule != 'Upload'
        ) {
            console.info('Else Push:');
            console.info(req.body.catValue);

            var fieldsToSet = {
                    typeBusinessRule: req.body.lstTypeBusinessRule,
                    tagCattegory: req.body.txtTagCattegory,
                    cattegoryValue: JSON.parse(req.body.catValue),
                    cattegorycolor: req.body.kleur,
                    creationDate: Date()
                }


            req.app.db.models.BusinessRules.create(fieldsToSet, function (err, BusinessRule) {
                if (err) {
                    return workflow.emit('exception', err);
                }

                workflow.outcome.record = BusinessRule;
                // req.flash('success','BusinessRule Added');
            });
        }

        res.location('/BusinessRules');
        res.redirect('/BusinessRules');


    })

workflow.emit('validate');
}

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
                    }}, // replacement, replaces only the field
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

    };

exports.updateCattValues = function(req, res, next) {
    console.info('test');
    console.info(req.body.lstTypeBusinessRule);
    console.info(req.body.txtTagCattegory);
    console.info(req.body.CatValue);
};


function tokenizeWerkwoord(sentence) {
    var sentenceNumber = 0;
    var volledigWerkwoord = '';
    var werkwoordInVerledentijd = '';
    var voltooiddeelwoord = '';
    var sentenceJSON = {};
    var typeWerkwoord = '';

    sentence = sentence.replace('ALLE betekenissen van dit woord:(', '');


    if (sentence.indexOf('overgankelijk')) {
        typeWerkwoord = 'overgankelijk werkwoord';
        sentence = sentence.replace('overgankelijk werkwoord;', '')

    }
    if (sentence.indexOf('(werkwoord;')) {
        typeWerkwoord = 'werkwoord';
        sentence = sentence.replace('(werkwoord;', '')

    }


    else {
        typeWerkwoord = 'onovergankelijk werkwoord';
        sentence = sentence.replace('onovergankelijk werkwoord', '')

    }

    sentence = sentence.replace(':(;', '');
    sentence = sentence.replace(':(werkwoord;', '');
    sentence = sentence.replace(':(werkwoord;', '');
    sentence = sentence.replace(')1', '');
    sentence = sentence.replace(':(on', '');
    sentence = sentence.replace('werkwoord', '');
    sentence = sentence.replace(';', '');
    sentence = sentence.replace(',', '');

    var tokenSentence = sentence.split(' ');
    var isVolWerkwoord = 0;
    var isverLededenWoord1 = 0;
    var isVerledenWoord2 = 0;
    var isVolDeelWoord = 2;
    var volDeelWoordCount = 0;


    for (var i = 0; i < tokenSentence.length; i++) {
        // Voledig werkwoord
        if (i == 0) {

            if (tokenSentence[i].substring(tokenSentence[i].length - 2, tokenSentence[i].length) == 'on') {
                volledigWerkwoord = tokenSentence[i].substring(0, tokenSentence[i].length - 2);
                isVolWerkwoord = i
            }
            else {
                volledigWerkwoord = tokenSentence[i];
                isVolWerkwoord = i
            }

        }
        // Verledentijd met 1 woord
        if (i > isVolWerkwoord && (i == 1 && (tokenSentence[i] != 'heeft' && tokenSentence[i] != 'is' && tokenSentence[i] != 'reed'))) {
            werkwoordInVerledentijd = tokenSentence[i];
            isverLededenWoord1 = i
        }

        // Verledentijd met 2 woorden
        if (isverLededenWoord1 == 0 && (i > isVolWerkwoord && (tokenSentence[i] == 'heeft' || tokenSentence[i] == 'is' || tokenSentence[i] == 'reed') ) && i < 3) {
            werkwoordInVerledentijd = werkwoordInVerledentijd + ' ' + tokenSentence[i];
            isVerledenWoord2 = i
        }

        // Voltooiddeelwoord
        if (i >= isVolDeelWoord && volDeelWoordCount < 2 && (i > isverLededenWoord1 || i > isVerledenWoord2 ) && ( i < isverLededenWoord1 | +2 || i < isVerledenWoord2 + 2 )) {
            volDeelWoordCount++;
            voltooiddeelwoord = voltooiddeelwoord + ' ' + tokenSentence[i];
            isVolDeelWoord = i
        }

    }

    var fieldsToSet = {
        volledigWerkwoord: volledigWerkwoord,
        werkwoordInVerledentijd: werkwoordInVerledentijd,
        voltooiddeelwoord: voltooiddeelwoord,
        typeWoord: typeWerkwoord,
        zelfstandignaamwoord: '',
        volgLetter: volledigWerkwoord.substring(0, 1),
        URL: ''
    };

    corpus.insert(fieldsToSet);

    return {
        volledigWerkwoord: volledigWerkwoord,
        werkwoordInVerledentijd: werkwoordInVerledentijd,
        voltooiddeelwoord: voltooiddeelwoord,
        typeWoord: typeWerkwoord,
        zelfstandignaamwoord: '',
        volgLetter: volledigWerkwoord.substring(0, 1),
        URL: ''

    }
}

function tokenizeTekst(tweet, corpus, businessrules, tweetid) {
    var tweetArray = tweet.split(' ')
    var zelfstandigNaamwoord
    var jsonNodeStructure = []
    var jsonLinkStructure = []
    var countCattegories = 0
    var countZelfstandigNaamwoord = 0
    var matchZNW = []
    var matchZNWFILTER = []
    var parentGroup
    var parentGroupValue
    var parentColor
    var masterGroup
    var masterColor
    var masterGroupValue
    var countGroups = 0
    var invalidEntries = 0
    var output

    // A. Nodestructure based on the BusinessRules cattegories (Master and Parent)
    for (var b = 0; b < businessrules.length; b++) {
        var patt = /[,!:@;.#]/g
        //MASTER
        jsonNodeStructure.push({id: businessrules[b].tagCattegory, group: b + 1, type: 'master', color: businessrules[b].cattegorycolor })

        // A.1 CattegorieValues in NodeStructure and LinkStructure
        var id =  businessrules[b].tagCattegory.toLowerCase().replace(patt,'')
        if (businessrules[b].cattegoryValue.length > 0){

            businessrules[b].cattegoryValue.forEach(function (item) {
                var catValue = item.toLowerCase().replace(patt,'')
                if (catValue != id){
                    //PARENT
                    jsonNodeStructure.push({id: catValue, group: b + 1, type: 'parent', color: businessrules[b].cattegorycolor })
                    //LINK
                    jsonLinkStructure.push({source: catValue, target: businessrules[b].tagCattegory, value: b + 1, type: 'parent'})
                }
            })


        }
    }
    // CHILD DETERMINING --> TweetArray is the tokenized tweet text

    //B. vullen van matchZNW
    tweetArray.forEach(function (item) {
        var patt1 = /[,!:]/g
        var inputItem = item.replace(patt1,'')

        matchZNW.push(wordInCorpus(inputItem,corpus))
    })

    //B.1 Filter ZNW
    var filterZNW = matchZNW.filter(filterById)


    //C.1 Bepalen van aantal matchende groepen
    tweetArray.forEach(function (item) {
        var check = wordInCattegory(item, jsonNodeStructure )
        if (check.group != null && masterGroup == null){
            countCattegories++
            parentGroup = check.group
            parentGroupValue = check.id
            parentColor = check.color
        }
    })

    // C.2 MASTER GROUP toevoegen aan de filter group
    var maxBusinessRuleId  =  jsonNodeStructure.length

    filterZNW.forEach(function (item) {
        maxBusinessRuleId++
        item.group =  parentGroup
        item.type =  'child'
        item.color = parentColor
        item.tweetID = tweetid
        item.filter = 1
    })

    jsonNodeStructure = jsonNodeStructure.concat(filterZNW)

    //D CREER LINK STRUCTUUR
    filterZNW.forEach(function (item) {
        jsonLinkStructure.push({source: item.id, target: parentGroupValue, value: parentGroup, type: 'child',  aantal:1})
    })

    // FILTEREN VAN TWEETS ZONDER CATTEGORIE
    jsonNodeStructure = jsonNodeStructure.filter(filterByGroup)
    jsonLinkStructure = jsonLinkStructure.filter(filterByTarget)

    output = {nodes : jsonNodeStructure, links: jsonLinkStructure, lstZNW: filterZNW  }

    function filterById(obj) {
        if ('id' in obj ) {
            return true

            if (obj.id.length == 1 ){
                return false
            }

            if (obj.id.length > 1 ){
                return true
            }

        }
        else {
            invalidEntries++
            return false
        }
    }

    function filterByTarget(obj) {
        if ('target' in obj && obj.target != null) {
            return true
        }
        else {
            invalidEntries++
            return false
        }
    }

    function filterByGroup(obj) {
        if ('group' in obj && obj.group != null) {
            return true
        }
        else {
            invalidEntries++
            return false
        }
    }


    return output

}

function wordInCorpus(word,corpus) {
    var output = {}

    corpus.forEach(function (item){
        if(word.toLowerCase().replace('@','') == item.woord.toLowerCase()){
            output = { id: item.woord}

        }
    })
   return output
}

function wordInCattegory(word, cattegory ) {
    var output = {}
    var patt = /[,!:@;.#]/g
    var cleanWord = word.replace(patt,'')
    cattegory.forEach(function (item) {
        //console.info( cleanWord.toLowerCase() + ' == ' + item.id.toLowerCase() )
        if (cleanWord.toLowerCase() == item.id.toLowerCase()){
            output = {id: item.id, group: item.group, color: item.color}
        }
    })
    return output
}

function filterByChildNode(obj) {
    if (obj.type == 'child' && obj.aantal >= 3) {
        return true
    }
    else {
        invalidEntriesChild++
        return false
    }
}