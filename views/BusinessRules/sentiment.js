/**
 * Created by erik on 3/6/17.
 */
'use strict';
var cheerio = require("cheerio")
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


exports.saveBijvoegelijkeNaamwoorden = function (req, res, next) {
    console.info('saveBijvoegelijkeNaamwoorden')
    tmp.remove({})
    var result = {}, dbUrl = [], dbCorpus = [], dbTweets = [], test = 'mongodb://localhost:27017/commevents', message = [], token = [], lstBvnToken = [], lstBvN = [], scoreResultaten = []

    mongo.connect(test, function (err, db) {
        console.info('MONGODB START CHECK COLLECTIONS')
        var locals = {}
        var tasks = [
            // Load corpus
            function (callback) {
                db.collection('corpus').find({typeWoord: 'Bijvoegelijknaamwoord'}).toArray(function (err, corpus) {
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
                // A.1 Loop door de tweets heen en Tokenize de tweets (Van zinnen losse woorden in een tabel)
                //dbTweets.length
                for (var i = 0 ; i <  500; i++) {
                    console.info(dbTweets[i].text)
                    token = tokenizeTekst(dbTweets[i].text)


                    //A.1.1 Per Token de Bijvoegelijknaamwoord zoeken in de corpus.
                    lstBvnToken = searchBijvoegelijknaamwoordInToken(token, dbCorpus)
                    if (lstBvnToken.length > 0) {
                        //console.info({nr: i ,lstBvnToken: lstBvnToken})

                        lstBvnToken.forEach(function (woord) {
                            totaalSentimentWoorden.push({woord: woord})
                        })
                    }

                    i++
                }
                // A.2 Toon het totaal aan bijvoegelijknaamwoorden welke gevonden zijn in de Tweets
                //console.info(totaalSentimentWoorden)
                var wordCount = d3.nest()
                    .key(function (d) {
                        return d.woord;
                    })
                    .rollup(function (v) {
                        return v.length;
                    })
                    .entries(totaalSentimentWoorden)

                console.info(wordCount)
                var scoreResultaten = [], fieldToSet = {}, insert = 0

                wordCount.forEach(function (word) {
                    fieldToSet = {}
                    if(word.values > 1 ){
                        fieldToSet.woord = word.key
                        fieldToSet.score = ''

                        tmp.insert(fieldToSet)
                    }

                })

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
    setTimeout(function () {
        console.info('TEMP')

        mongo.connect(test, function (err, db) {
            console.info('MONGODB START CHECK COLLECTIONS')
            var locals = {}
            var tmp = []
            var tasks = [
                // Load corpus
                function (callback) {
                    db.collection('tmp').find({}).toArray(function (err, tmp) {
                        if (err) return callback(err);
                        locals.tmp = tmp;
                        callback();
                    })
                }]
            async.parallel(tasks, function (err) {
                if (err) return next(err);
                db.close();
                tmp = locals.tmp
                console.info('Read tmp')
                console.info('tmp: ' + tmp.length)
                console.info(tmp)
                res.status(200).json(tmp)

            })
        })

    }, 3000)
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


// UPDATE van Sentiment tagger in de tempory collection
exports.updSentiment = function (req, res, next) {
    var updateSet = req.body.updateSet, uri = 'mongodb://localhost:27017/commevents'
    console.info('Update Set')

    // update set
    updateSet.forEach(function (row) {
        tmp.update({_id: row.id}, {$set: {score: row.score}}, false, true)

    })

    // remove
    updateSet.forEach(function (row) {
        if (row.score == '') {
            console.info('remove: ' + row.id + ' score: ' + row.score)
            tmp.remove({_id: row.id})
        }
        else{
            console.info('not removed: ' + row.id + ' score: ' + row.score)
        }

    })




    mongo.connect(uri, function (err, db) {
        console.info('MONGODB START CHECK COLLECTIONS')
        var locals = {}, tasks = [
                                    // Load tmp
                                    function (callback) {
                                        db.collection('tmp').find({}).toArray(function (err, tmp) {
                                            if (err) return callback(err);
                                            locals.tmp = tmp;
                                            callback();
                                        })
                                    }
                                  ];
        console.info('--------------- START ASYNC ------------------------')
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            var dbtmp = []
            db.close()
            dbtmp = locals.tmp
            console.info(dbtmp)


            res.status(200).json({berich: 'Succesvol gewijzigd', result: dbtmp})

        })
    })
}









