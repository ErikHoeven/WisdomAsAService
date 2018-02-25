/**
 * Created by erik on 1/25/18.
 */

var  request = require("request")
    ,async = require('async')
    ,mongo = require('mongodb')
    ,d3 = require('d3')
    ,uri = 'mongodb://localhost:27017/commevents'
    ,moment = require('moment')
    ,underscore = require('underscore')
    ,ftlrGroup = []
    ,fltrState = []
    ,compareWordGroup = null
    ,compareWordState = null
    ,locals = {}

exports.getSpiderWords = function (req,res,next) {
    var data = req.body.data;
    console.info('getSpiderWords')
    console.info('data: ' + data.length)


    mongo.connect(uri, function (err, db) {
        console.info('MONGODB START CHECK COLLECTIONS')
        var tasks = [   // Load businessrules
            function (callback) {
                db.collection('businessrules').find({typeBusinessRule: 'SpiderGraphExeption'}).toArray(function (err, businessrules) {
                    if (err) return callback(err);
                    locals.businessrules = businessrules;
                    callback();
                });
            }
        ]
        console.info('--------------- START ASYNC ------------------------')
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            var businessrules = locals.businessrules
            db.close()


            //console.info(filterTitleList(data,businessrules))

            res.status(200).json(filterTitleList(data,businessrules))
        })
    })



}




function filterTitleList(tickets, businessRules) {
    // ------------------------------------  wordcloud ----------------------------------------------------------------------
    var exceptions = [' - ', 'q', 'fk', '', 'fw', 'is', 'not', 'working', '-', 'any', 'from', 'info', '/', 'bij', 'get', 'match', 'Day', 'Wrong']
        , temp = []
        , objectTicket = {}
        , arrayTickets = []
        , columns = []
        , titleList = []
        , legenda = []

    businessRules.forEach(function (row) {
        exceptions.push(row.lookupValue)
    })

    tickets.forEach(function (t) {
        objectTicket.Title = t.title
        objectTicket.Group = t.responsibleGroup
        columns.push(objectTicket)
        objectTicket = {}
    })

    var aggTicketsGroup = d3.nest()
        .key(function (d) {
            return d.Group;
        })
        .entries(columns);


    aggTicketsGroup.forEach(function (group) {
        var values = group.values, innerArray = []
        values.forEach(function (value) {

            var titleWords = value.Title.split(' ')
            titleWords.forEach(function (word) {
                innerArray.push(word)
            })
        });

        var wordList = fltrWordCountList(innerArray, 1, null)
        var fltrWordList = wordList.filter(function (o) {
            return exceptions.indexOf(o.word) == -1;
        })
        temp = []

        if (fltrWordList.length > 0) {
            fltrWordList.forEach(function (w) {
                temp.push({axis: w.word, value: w.count})
            })
            titleList.push(temp)
            legenda.push(group.key)
        }
    })

    temp = []
    titleList.forEach(function (t) {
        t.forEach(function (row) {
            temp.push(row.value)
        })

    })
    temp = underscore.uniq(temp)
    var max = d3.max(temp)

    temp = []
    titleList.forEach(function (set) {
        set.forEach(function (row) {
            row.value = Math.round((row.value / max) * 100) / 100
        })
    })

return {Data: titleList, Legenda: legenda }

}






function fltrWordCountList(wordCloud, filterCount, fltrList) {
    var returnList = [], wordCloudDef = [], compareWord = null, count = 0
    // (1) Sort the words
    wordCloud.sort();
    // (2) Count the words
    wordCloud.forEach(function (word) {

        if(word != compareWord && count == 0){
            compareWord = word
        }

        if(word == compareWord){
            if (count == 0){
                count++
            }
            else {
                count++
            }
        }

        if (word != compareWord && count > 0){
            wordCloudDef.push({word: word, count: count + 1})
            count = 0
            compareWord = word
        }
    })

    wordCloudDef.forEach(function (word) {
        if(word.count >= filterCount){
            returnList.push(word)
        }

    })

    wordCloud = [], compareWord = 0

    if (fltrList != null){
        returnList.forEach(function (rrl) {
            fltrList.forEach(function (frl) {
                //console.info(rrl.word + ' =! ' + frl.lookupValue)
                if (rrl.word != frl.lookupValue){
                    compareWord = 1
                }
            })
            if (compareWord == 1){
                wordCloud.push(rrl)
                compareWord = 0
                //console.info(rrl)
            }


        })
        return wordCloud
    }
    else {
        return returnList
    }
}