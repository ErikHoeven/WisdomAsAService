
'use strict';
var async = require('async');
var mongo = require('mongodb');
var d3 = require('d3')
var url = 'mongodb://localhost:27017/commevents'

exports.findTweetPerNode = function(req, res, next) {
    console.info('findTweetPerNode:')
    var cattegorie = req.body.filterSet.cattegorie
    var corpus = req.body.filterSet.corpus
    var type = req.body.filterSet.type
    var links = req.body.links
    var filterSet = {cattegorie: cattegorie, corpus: corpus, type: type}
    var locals = {}

    console.info('--------------------------  START ASYNC ------------------------------------');


    mongo.connect(url, function (err, db) {

        var locals = {};

        var tasks = [
            function (callback) {
                db.collection('STG_LEADS_AUTOSCHADE').find({}).toArray(function (err, tweets) {
                    if (err) return callback(err);
                    locals.tweets = tweets;
                    callback();
                });
           }
        ]

        console.info('--------------- EINDE ASYNC ------------------------')

        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            var tweets = locals.tweets
            db.close()

            var graphTweets = filterTweetsOnWord(tweets, filterSet, links)

            res.status(201).json(graphTweets)



        })
    })
}


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
    console.info('filterTweetsOnWord')
    //console.info(linkstructure)
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

    // Loop throug all tweets and add only the text object to the array
    Tweets.forEach(function (tw) {
        var profile_banner_url = tw.user.profile_banner_ur

        if (profile_banner_url = null || !profile_banner_url){
            var profile_banner_url = '/avatar.png'
        }

        tweetText.push({ id : tw.id,
                         text: tw.text,
                         created_at: tw.created_at,
                         userProfileURL: tw.user.profile_image_url_https,
                         profile_banner_url: profile_banner_url,
                         screenname : tw.user.screen_name,
                         username : tw.user.name
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

            //Scenario: Child -> If the corpus exist (only with child node)
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


exports.filterNodesOnAantalTweets = function(req, res, next) {
    console.info('filterNodesOnAantalTweets: ' + req.body.aantalTweets)

    if (req.body.aantalTweets)
        var filterAantalNode = req.body.aantalTweets
    else
        var filterAantalNode = 0



    var filter = 0
    mongo.connect(url, function (err, db) {

        var locals = {};

        var tasks = [
            // Load graph
            function (callback) {
                db.collection('graph').find({}).toArray(function (err, graph) {
                    if (err) return callback(err);
                    locals.graph = graph;
                    callback();
                });
            }
        ];
        console.info('--------------- EINDE ASYNC ------------------------')

        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();
            var graph = locals.graph[0]
            //console.info(graph[0].nodes)
            var nodes = graph.nodes
            var links = graph.links
            var filterNodes = []
            var filterLinks = []

            if (filterAantalNode > 0 ){

                nodes.forEach(function(node){
                    if ((node.type == 'child' && node.aantal >= filterAantalNode) || node.type == 'master' || node.type == 'parent' ){
                         filterNodes.push(node)
                    }
                })

                filterNodes.forEach(function (node) {
                    var linkSource
                    links.forEach(function (link) {

                        if ((link.type == 'master' || link.source.type == 'parent') || ( node.id == link.source && linkSource != link.source )){
                            linkSource = link.source
                            filterLinks.push(link)
                        }
                    })

                })


                // empty variable
                graph = []
                nodes = []
                links = []

                // initialize variable

                nodes = filterNodes
                links = filterLinks
                graph.nodes = filterNodes
                graph.links = filterLinks


            }

            //console.info(graph)

            res.status(201).json({nodes:filterNodes, links: filterLinks})
        })
    })


}






function findLink (cleanToken, corpus, linkstructure ) {
    var BreakException = {}
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




