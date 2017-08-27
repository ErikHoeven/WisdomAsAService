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
    ,ftlrGroup = []
    ,fltrState = []
    ,compareWordGroup = null
    ,compareWordState = null

exports.getTickets = function (req, res, next) {

        console.info('-------------------Get Tickets --------------------------------------------------------')
    stgOmniTracker.find({},function (err, tickets) {


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
                        'cpf': d3.sum(v, function (d) {
                            return d['EPS - CPF_Count']
                        }),
                        'esoft': d3.sum(v, function (d) {
                            return d['EPS - E-Soft_Count'];
                        }),
                        'firstLine': d3.sum(v, function (d) {
                            return d['Service desk 1st line_Count'];
                        }),
                        'srl': d3.sum(v, function (d) {
                            return d['EPS - SRL_Count'];
                        }),
                        'secondLineApps': d3.sum(v, function (d) {
                            return d['EPS Apps 2nd line_Count'];
                        }),
                        'infra': d3.sum(v, function (d) {
                            return d['EPS - Infra_Count'];
                        }),
                        'cognos': d3.sum(v, function (d) {
                            return d['EPS - Cognos_Count'];
                        }),
                        'desktopVirtualisatie': d3.sum(v, function (d) {
                            return d['Desktop Virtualisation 2nd line_Count'];
                        }),

                    };
                })
                .entries(tickets)

            //console.info(countsPerDayCattegory)

            countsPerDayCattegory.forEach(function (row) {
                var key = row.key.split('|')
                var CreationDate = key[0],
                    Group = key[1],
                    State = key[2],
                    count = row.values.count,
                    countOpenTickets = 0,
                    countCreatedTickets = 0,
                    countSolvedTickets = 0,
                    snapshot = moment(key[3]).format('DD-MM-YYYY'),
                    snapshotDate = moment(snapshot,'DD-MM-YYYY').toDate(),
                    cpf = row.values['EPS-CPF'],
                    esoft = row.values['EPS-E-Soft'],
                    firstLine = row.values['Service desk 1st line'],
                    srl = row.values['EPS-SRL'],
                    secondLineApps = row.values['EPS Apps 2nd line'],
                    cognos = row.values['EPS-Cognos'],
                    infra = row.values['EPS-Infra'],
                    desktopVirtualisatie = row.values['Desktop Virtualisation 2nd line'],
                    pushObject = {}
                    pushObject.CreationDate = moment(CreationDate).toDate()
                    pushObject.Group = Group
                    pushObject.State = State


                    if (State == 'Classification'){
                      countCreatedTickets = count
                    }

                    if (State == 'In progress' || row.State == 'Classification' || row.State == 'Waiting'  ){
                        countOpenTickets = count
                    }

                    if (State == 'Solved'){
                        countSolvedTickets = count
                    }


                    pushObject.count = row.values.count
                    pushObject.countOpenTickets = countOpenTickets
                    pushObject.countCreatedTickets = countCreatedTickets
                    pushObject.snapshotDate = snapshotDate

                    // "Service desk 2nd line",
                    // "EPS Infra 2nd line",
                    // "Operating Systems 2nd line",
                    // "Realdolmen Apps 2nd line",
                    // "Operations 1st line",
                    // "EPS - DWH",
                    // "Field Back End HW 2nd line",
                    //"Realdolmen Infra 2nd Line"

                    if(key[1] == 'EPS - CPF'){
                        pushObject.cpf = row.values.count
                    }
                    if(key[1] == 'EPS - E-Soft'){
                    pushObject.esoft = row.values.count
                    }
                    if(key[1] == 'EPS - SRL'){
                        pushObject.srl = row.values.count
                    }
                    if(key[1] == 'Service desk 1st line'){
                        pushObject.firstLine = row.values.count
                    }
                    if(key[1] == 'EPS Apps 2nd line'){
                        pushObject.secondLineApps = row.values.count
                    }
                    if(key[1] == 'EPS - Cognos'){
                        pushObject.cognos = row.values.count
                    }
                    if(key[1] == 'EPS - Infra'){
                        pushObject.infra = row.values.count
                    }
                    if(key[1] == 'Desktop Virtualisation 2nd line'){
                        pushObject.desktopVirtualisatie = row.values.count
                    }
                    
                    //pushObject[]

                aggCountsPerDayCattegory.push(pushObject)






            });
            console.info('----------------------------------------------')


            //console.info(underscore.where(aggCountsPerDayCattegory,{Group:"EPS - CPF"}))


            ftlrGroup.push('All')
            fltrState.push('All')

            aggCountsPerDayCattegory.forEach(function (row) {
                if(row.Group != compareWordGroup){
                    ftlrGroup.push(row.Group)
                    compareWordGroup = row.Group
                }
                if(row.State != compareWordState){
                    fltrState.push(row.State)
                    compareWordState = row.State
                }
            })




            ftlrGroup = underscore.uniq(ftlrGroup)
            fltrState = underscore.uniq(fltrState)

            console.info(ftlrGroup)



            res.status(200).json({aggCountsPerDayCattegory: aggCountsPerDayCattegory, fltrGroup:ftlrGroup, fltrState: fltrState  })
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