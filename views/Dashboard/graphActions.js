
'use strict';
var async = require('async');
var mongo = require('mongodb');
var d3 = require('d3')

exports.findTweetPerNode = function(req, res, next) {
    console.info('findTweetPerNode:')
    var cattegorie = req.body.cattegorie
    var corpus = req.body.corpus
    var type = req.body.type
    var filterSet = {cattegorie: cattegorie, corpus: corpus, type: type}
    var locals = {}

    console.info('--------------------------  START ASYNC ------------------------------------');

    var url = 'mongodb://localhost:27017/commevents'
    mongo.connect(url, function (err, db) {

    var locals = {};

    var tasks = [
        function (callback) {
            db.collection('STG_LEADS_AUTOSCHADE').find({}).toArray(function (err, tweets) {
                if (err) return callback(err);
                locals.tweets = tweets;
                callback();
            });
        },
        // Load corpus
        function (callback) {
            db.collection('graph').find({}).toArray(function (err, links) {
                if (err) return callback(err);
                locals.links = links;
                callback();
            });
        }
    ];
    console.info('--------------- EINDE ASYNC ------------------------')

    async.parallel(tasks, function (err) {
        if (err) return next(err);
        db.close();
        var tweets = locals.tweets
        var links = locals.links[0].links
        db.close()

        var graphTweets = filterTweetsOnWord(tweets, filterSet, links)

        res.status(201).json(graphTweets)



    })
    })
}

// Generik functions



// -------------------------------------------------------------------------------------------------------------------------
// PARAMETER 1 Tweets: from API
// PARAMETER 2 filterSet:  {cattegorie: [Catttegory], corpus: [word], type: [master/parent/child] }
// PARAMETER 3 linkStructure:  json array for lookingup the parentgroup name from the parent group
// Scenario 1:  Tweet is not empty and corpus is also not empty:
//   1. Token nize tweet text
//   2. filter tokens on special characters
//   3. loop throug tokens and identify if the tokens are hit by cattegory or corpus
//   4. filter all tweets wich does not match on cattegory and word
//---------------------------------------------------------------------------------------------------------------------------
function filterTweetsOnWord(Tweets, filterSet, linkstructure) {
    var outputTweets = []
        , isCorpusHit = 0
        , isCattegoryHit = 0
        , isOutPutTweet = []
        , tweetText = []
        , tokens = []
        , token
        , cleanToken = ''
        , patt = /[,!:@;.#]/g
        , corpusExist = 0
        , BreakException = {}

    // Loop throug all tweets and add only the text object to the array
    Tweets.forEach(function (tw) {
        var profile_banner_url = tw.user.profile_banner_ur

        if (profile_banner_url = null || !profile_banner_url){
            var profile_banner_url = '/avatar.png'
        }

        tweetText.push({text: tw.text,
                        created_at: tw.created_at,
                        userProfileURL: tw.user.profile_image_url_https,
                        profile_banner_url: profile_banner_url
                        //screenname : tw.entities.user_mentions[0].screen_name
                        //username : tw.entities.user_mentions[tw.entities.user_mentions.length].screen_name
        })
    })

    // Get only the text of a tweet
    tweetText.forEach(function (text) {
        isCattegoryHit = 0
        isCorpusHit = 0
        tokens = text.text.split(' ')

        // Loop through tokens
        tokens.forEach(function (tk) {
            token = tk
            cleanToken = token.replace(patt, '')

            //Scenario: Child -> If the corpus is exist (only with child node)
            if (filterSet.corpus != null && cleanToken == filterSet.corpus ) {
                var linkResult =  findLink(cleanToken,filterSet.corpus, linkstructure)
                isCattegoryHit = linkResult.isCattegoryHit
                isCorpusHit = linkResult.isCorpusHit
                filterSet.cattegorie = linkResult.cattegorie

            }
            //Scenario: Child -> compare cattegorie with token
            if (filterSet.type == 'parent' && filterSet.cattegorie == cleanToken) {
                isCattegoryHit = 1
            }
        })

        if (isCorpusHit == 1  || isCattegoryHit == 1) {
            outputTweets.push(text)
        }
    })

    return outputTweets

}



function findLink (cleanToken, corpus, linkstructure ) {

    // Look per token for the cattegory using the links and overwrite the cattegorie with the value of the attribute source of the link object

        var cattegorie
        try {
            linkstructure.forEach(function (link) {
                cattegorie = ""
                if (link.source.id == cleanToken) {
                    cattegorie = link.target.id
                    throw BreakException
                }
            })
        }
        catch (e) {
            if (e !== BreakException) throw e
        }

    return {isCattegoryHit: 1, isCorpusHit: 1, cattegorie: cattegorie}

}




