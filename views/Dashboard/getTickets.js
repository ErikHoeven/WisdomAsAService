/**
 * Created by erik on 8/24/17.
 */

'use strict';

var  cheerio = require("cheerio")
    ,request = require("request")
    ,async = require('async')
    ,mongo = require('mongodb')
    ,db = require('monk')('localhost/commevents')
    ,dbm = require('mongodb').MongoClient
    ,d3 = require('d3')
    ,uri = 'mongodb://localhost:27017/commevents'
    ,stgOmniTracker = db.get('stgOmniTracker')
    ,moment = require('moment')
    ,underscore = require('underscore')
    ,natural = require('natural')
    ,actWeek = actualWeek()
    ,actMonth =  actualMonth()

exports.getTickets = function (req, res, next) {

        console.info('-------------------Get Tickets --------------------------------------------------------')

    stgOmniTracker.find({'Creation Date':{$gt: actMonth.startMonth, $lt: actMonth.endMonth}},function (err, tickets) {
            var resultSet = {}, aggCountsPerDayCattegory = []

            var countsPerDay = d3.nest()
                .key(function (d) {
                    return d['Creation Date']
                })
                .rollup(function (v) {
                    return {
                        count: d3.sum(v, function (d) {
                            return d.count;
                        }),
                    };
                })
                .entries(tickets)

            var countsPerDayCattegory = d3.nest()
                .key(function (d) {
                    return d.aggGrain
                })
                .rollup(function (v) {
                    return {
                        count: d3.sum(v, function (d) {
                            return d.count;
                        }),
                    };
                })
                .entries(tickets)

            console.info(countsPerDayCattegory)
            countsPerDayCattegory.forEach(function (row) {
                var key = row.key.split('|')
                var CreationDate = key[0], Group = key[1], State = key[2], count = row.values.count
                aggCountsPerDayCattegory.push({CreationDate: moment(CreationDate).toDate(), Group: Group, State: State, count: row.values.count})
            });
            console.info('----------------------------------------------')
            console.info(aggCountsPerDayCattegory)

        res.status(200).json({countsPerDayCattegory:countsPerDayCattegory
            , aggCountsPerDayCattegory: aggCountsPerDayCattegory
        })

        })

}




function actualWeek() {
    var d = new Date();
    var nlWeekStartNumber = 1;
    var nlWeekEndNumber = 6;
    var DayCounter = d.getDay();
    var startWeekDay = d.getDate();
    var endWeekDay = d.getDate();
    var startWeekDate = new Date();
    var endWeekDate = new Date();

    for (DayCounter; DayCounter > nlWeekStartNumber; DayCounter--) {
        startWeekDay--;
    }

    for (DayCounter = d.getDay(); DayCounter < nlWeekEndNumber; DayCounter++) {
        endWeekDay++;
    }

    startWeekDate = new Date(startWeekDate.setDate(startWeekDay));
    endWeekDate = new Date(endWeekDate.setDate(endWeekDay + 1));


    return {
        'startWeekDay': startWeekDate
        , 'endWeekDay': endWeekDate
    }
}

function actualMonth() {
    //Is het aantal weken in een maand (met begin en eind datum)
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);


    return {
        'startMonth': firstDay
        , 'endMonth': lastDay
    }

}