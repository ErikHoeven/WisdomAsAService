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


exports.saveBijvoegelijkeNaamwoorden = function (req, res, next) {
    console.info('saveBijvoegelijkeNaamwoorden')
    var result = {}, dbUrl = [], dbCorpus = [], dbTweets = [], test = 'mongodb://localhost:27017/commevents', message = [], token = [], lstBvnToken = [], lstBvN =[]

    mongo.connect(test, function (err, db) {
        console.info('MONGODB START CHECK COLLECTIONS')
        var locals = {}
        var tasks = [
            // Load corpus
            function (callback) {
                db.collection('corpus').find({typeWoord:'Bijvoegelijknaamwoord'}).toArray(function (err, corpus) {
                    if (err) return callback(err);
                    locals.corpus = corpus;
                    callback();
                })
            },
             // Load Tweets from table
            function (callback) {
                db.collection('STG_LEADS_AUTOSCHADE').find({}).toArray(function (err, tweets) {
                    if (err) return callback(err);
                    locals.tweets = tweets;
                    callback();
                });
            }
        ];
        console.info('--------------- START ASYNC ------------------------')
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            dbCorpus = locals.corpus
            dbTweets = locals.tweets

            console.info('Bijvoegelijkenaamwoorden: ' + dbCorpus.length)
            console.info('tweets: ' + dbTweets.length)

            // A Corpus is gevuld met Bijvoegelijkenaamwoorden, ga verder met tokenizen van de tweet zinnen.
            if (dbCorpus.length > 0) {
                console.info('Bijvoegelijknaamwoord aanwezig')
                var i = 0, totaalSentimentWoorden = []
                //token = tokenizeTekst(dbTweets[529].text)
                //lstBvnToken = searchBijvoegelijknaamwoordInToken(token, dbCorpus)
                //console.info(dbTweets[529].text)
                //console.info(lstBvnToken)
                dbTweets.forEach(function (tweet) {
                    token = tokenizeTekst(tweet.text)
                    lstBvnToken = searchBijvoegelijknaamwoordInToken(token, dbCorpus)
                    if (lstBvnToken.length > 0){
                        //console.info({nr: i ,lstBvnToken: lstBvnToken})

                        lstBvnToken.forEach(function (woord) {
                            totaalSentimentWoorden.push({woord:woord})
                        })
                    }

                    i++
                })
                console.info(totaalSentimentWoorden)



            }

            // B Corpus is niet gevuld met Bijvoegelijknaamwoorden, vul de corpus met de Bijvoegelijke naamwoorden
            else {

                url.remove({})
                corpus.remove({})

                // B.1 Vul de URL tabel
                var znsite = 'https://nl.wiktionary.org/wiki/Categorie:Bijvoeglijk-naamwoordsvorm_in_het_Nederlands';
                var znurl = znsite;
                request(znurl, function (error, response, html) {
                    if (!error) {
                        console.info(znsite + ': is aproved');
                        var $ = cheerio.load(html);

                        //B.1 CATCH URLS CONTENT
                        $('table a').each(function (i, el) {
                            var insURL = $(this).attr('href')
                            insURL = insURL.substring(2)
                            insURL = 'https://' + insURL

                            //B.1.1 Write content to JSON
                            var fieldsToSet = {
                                typeWoord: 'Bijvoegelijknaamwoord',
                                URL: insURL
                            };
                            url.insert(fieldsToSet)
                        })

                        //B.2 Vul de BijvoegelijkNaamwoorden
                        url.find({}).then((u) => {
                            u.forEach(function (s) {
                            insertWordsToCorpus(s.URL)
                            })
                        })

                    }
                })
            }
        })
    })
}


function insertWordsToCorpus(url){
        //console.info('insertWordsToCorpus:' + url)
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
                        woord: bijvoegelijknaamwoord,
                        volgLetter: bijvoegelijknaamwoord.substring(0, 1),
                        URL: url
                    };

                    // B.1.1.2 WRITE CONTENT TO JSON
                    //wordSet.push(fieldsToSet)
                    corpus.insert(fieldsToSet)

                })

            }
            else {
                console.log("We’ve encountered an error: " + error + ': statuscode: ')

            }
        })
}

function searchBijvoegelijknaamwoordInToken (token, bijvoegelijknaamwoorden) {
    var lstBnw = []
    var bnw
    token.forEach(function (tk) {
        bnw = ''
        var tkc = tk.toLowerCase()
        bijvoegelijknaamwoorden.forEach(function(bvn){
            if ((tkc.indexOf(bvn.woord) == 0 && bvn.woord != bnw) ||( bvn.woord == tkc && bvn.woord != bnw) ){
                bnw = tkc
            }
        })
        if (bnw != ''){
            lstBnw.push(bnw)
        }

    })
    return lstBnw
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






