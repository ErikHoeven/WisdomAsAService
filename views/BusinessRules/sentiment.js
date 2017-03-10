/**
 * Created by erik on 3/6/17.
 */
'use strict';
var cheerio = require("cheerio")
    ,request = require("request")
    ,async = require('async')
    ,mongo = require('mongodb')
    ,db = require('monk')('localhost/commevents')
    ,companies =  db.get('companyresults')
    ,corpus = db.get('corpus')
    ,url = db.get('url')
    ,d3 = require('d3');


exports.saveBijvoegelijkeNaamwoorden = function (req, res, next){
    console.info('saveBijvoegelijkeNaamwoorden')

    // A.1 Set the time out to give the database time tot store the URL in the database
        console.info('---------------------- Zelfstandig naamwoorden ----------------------------------------');
        var znsite = 'https://nl.wiktionary.org/wiki/Categorie:Bijvoeglijk-naamwoordsvorm_in_het_Nederlands';
        var znurl = znsite;
        url.remove({})
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
                        typeWoord: 'Bijvoegelijknaamwoord',
                        URL: insURL
                    };
                    url.insert(fieldsToSet)
                })

                //A.2 START Get all words
                var test = 'mongodb://localhost:27017/commevents'
                mongo.connect(test,function (err, db) {
                    console.info('MONGODB')
                    var locals = {}
                    var tasks = [
                        // Load corpus
                        function (callback) {
                            db.collection('corpus').find({typeBusinessRule: "Bijvoegelijknaamwoord"}).toArray(function (err, corpus) {
                                if (err) return callback(err);
                                locals.corpus = corpus;
                                callback();
                            })
                        },
                        // Load CSV from table
                        function (callback) {
                            db.collection('url').find({}).toArray(function (err, url) {
                                if (err) return callback(err);
                                locals.url = url;
                                callback();
                            });
                        }
                    ];
                    console.info('--------------- START ASYNC ------------------------')
                    async.parallel(tasks, function (err) {
                        if (err) return next(err);
                        var url = [], corpus = []
                        console.info('dafadsfsafadfas')
                        db.close();
                        url = locals.url
                        corpus = locals.corpus
                        console.info(url[0])
                        insertWordsToCorpus(url[0].URL)
                        //res.status(201).json(restult)
                        console.info('--------------- EINDE ASYNC ------------------------')

                    })
                })
                //A.2 EINDE Get all words
            }
        })

}



function insertWordsToCorpus(url){
        console.info('insertWordsToCorpus:' + url)
        //B.1.1 GET WEBPAGE FROM URL
        request(url, function (error, response, html) {
            if (!error) {
                // B.1.1.1 GET CONTENT FROM URL
                var $ = cheerio.load(html),  wordSet = [];
                $('.mw-content-ltr li a').each(function (i, el) {
                    var bijvoegelijknaamwoord = $(this).text();

                    // B.1.1.2 WRITE CONTENT TO JSON

                    var fieldsToSet = {
                        volledigWerkwoord: '',
                        werkwoordInVerledentijd: '',
                        voltooiddeelwoord: '',
                        typeWoord: 'Bijvoegelijknaamwoord',
                        zelfstandignaamwoord: bijvoegelijknaamwoord,
                        volgLetter: bijvoegelijknaamwoord.substring(0, 1),
                        URL: url
                    };

                    // B.1.1.2 WRITE CONTENT TO JSON
                    //wordSet.push(fieldsToSet)
                    //corpus.insert(fieldsToSet)

                })
                console.info('-----------WORDSET--------------------')
                //console.info(wordSet)
                console.info('-----------WORDSET--------------------')
            }
            else {
                console.log("We’ve encountered an error: " + error + ': statuscode: ')

            }
        })
}






