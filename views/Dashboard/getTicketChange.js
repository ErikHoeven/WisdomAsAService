'use strict';

var  request = require("request")
    ,async = require('async')
    ,mongo = require('mongodb')
    ,d3 = require('d3')
    ,uri = 'mongodb://localhost:27017/commevents'
    ,moment = require('moment')
    ,underscore = require('underscore')
    ,actWeek = actualWeek()
    ,actMonth =  actualMonth()
    ,ftlrGroup = []
    ,fltrState = []
    ,compareWordGroup = null
    ,compareWordState = null
    ,locals = {}

exports.getTicketsChange = function (req, res, next) {

    console.info('-------------------Get Tickets --------------------------------------------------------')
    var filter = req.body.filter


    mongo.connect(uri, function (err, db) {
        console.info('MONGODB START CHECK COLLECTIONS')
        var tasks = [   // Load businessrules
            function (callback) {
                db.collection('businessrules').find({typeBusinessRule: 'SpiderGraphExeption'}).toArray(function (err, businessrules) {
                    if (err) return callback(err);
                    locals.businessrules = businessrules;
                    callback();
                });
            },
            // Load stgOmniTracker
            function (callback) {
                db.collection('stgOmniTracker').find({filter}).toArray(function (err, tickets) {
                    if (err) return callback(err);
                    locals.tickets = tickets;
                    callback();
                });
            }
        ];
        console.info('--------------- START ASYNC ------------------------')
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            var businessrules = locals.businessrules, tickets = locals.tickets, resultSet = {}, aggCountsPerDayCattegory = [], group = locals.group
            db.close()

            tickets.forEach(function (ticket) {
                ticket.snapshotDate = moment(ticket.snapshotDate).format("DD-MM-YYYY")

            })

            console.info('----------------------------------------------')
            ftlrGroup.push('All')
            var groupList = []

            tickets.forEach(function (t) {
                groupList.push(t['Responsible Group'])
            })

            underscore.uniq(groupList).forEach(function (t) {
                ftlrGroup.push(t)
            })


            // Aggegrate to Group
            var titleList = []
            var legenda = []
            var aggTicketsGroup = d3.nest()
                .key(function (d) {
                    return d['Responsible Group'];
                })
                .entries(tickets);


            // -------------------------- snapshots ------------------------------------------------------
            var snapshots = [], snapshotDate

            tickets.forEach(function (ticket) {
                snapshots.push(ticket.snapshotDate)
            })


            snapshots = underscore.sortBy(snapshots,function (node) {
                return + (moment(node,'DD-MM-YYYY'))

            })

            snapshots = Array.from(new Set(snapshots))

            res.status(200).json({

                fltrGroup: ftlrGroup,
                dataSpider: titleList,
                legendaSpider: legenda,
                snapshots: snapshots,
                perSnapshot:  filterSnapshot(tickets)
            })
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

function daydiff(first, second) {
    return Math.round((second-first)/(1000*60*60*24));
}




exports.updateGeneric = function (req, res, next) {
    var  parameters = req.body.updateSet
        ,collection = parameters.collection
        ,id = parameters.id
        ,pars = Object.keys(parameters)
        ,updateSet = []
        ,updateObject = {}
        ,connection = db.get(collection)
        ,returnSet = []

    // Filter the id and collection
    pars.forEach(function (par) {
        if (par != 'id' && par != 'collection' ){
            updateObject[par] = parameters[par]
        }
    })

    connection.update({_id: id}, {$set: updateObject}, false, true)

    mongo.connect(test, function (err, db) {
        var locals = {}, tokens = []
        var tasks = [
            // Load Tweets from table
            function (callback) {
                db.collection(collection).find({}).toArray(function (err, collection) {
                    if (err) return callback(err);
                    locals.collection = collection;
                    callback();
                });
            }
        ];
        //console.info('--------------- START ASYNC ------------------------')
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();

            res.status(200).json(locals.collection)
        })
    })
}



function filterSnapshot(dataset){
    var returnSet = []


    var perSnapshot = d3.nest()
        .key(function (d) {
            return d.snapshotDate
        })
        .entries(dataset)

    var snapshotDetails = [], AggCountPerDay = [],  AggCountPerDayPerUser = [], DataSpider = [], snapshots = [], snapshotObject  ={} , valueObject = {}, measureObject = {}, measureSet = []


    console.info('----------PER SNAPSHOT-------')
    perSnapshot.forEach(function (s) {
        snapshotObject = {}
        measureSet = []
        snapshotObject.snapshot = s.key
        snapshotObject.snapshotDetails = []
        snapshotObject.aggCountsPerDayCattegory = []
        snapshotObject.totActualTickets = {}
        snapshotObject.totActualTickets.columns = []
        snapshotObject.totActualTickets.values = []
        snapshotObject.totActualTickets.title = ""
        snapshotObject.totActualTickets.underTitle = ""
        // CREATED
        snapshotObject.totCreateTicketsperWeek = {}
        snapshotObject.totCreateTicketsperWeek.title = 'Trend running year created tickets per week'
        snapshotObject.totCreateTicketsperWeek.columns = ['Week', 'CreatedTickets']

        snapshotObject.totCreateTicketsperWeekSRL = {}
        snapshotObject.totCreateTicketsperWeekSRL.title = 'Trend running year created tickets per week SRL'
        snapshotObject.totCreateTicketsperWeekSRL.columns = ['Week', 'CreatedTickets']

        snapshotObject.totCreateTicketsperWeekCPF = {}
        snapshotObject.totCreateTicketsperWeekCPF.title = 'Trend running year created tickets per week SRL'
        snapshotObject.totCreateTicketsperWeekCPF.columns = ['Week', 'CreatedTickets']
        //SOLVED
        snapshotObject.totSolvedTicketsperWeek = {}
        snapshotObject.totSolvedTicketsperWeek.title = 'Trend running year solved tickets per week'
        snapshotObject.totSolvedTicketsperWeek.columns = ['Week', 'SolvedTickets']

        snapshotObject.totSolvedTicketsperWeekSRL = {}
        snapshotObject.totSolvedTicketsperWeekSRL.title = 'Trend running year solved tickets per week SRL'
        snapshotObject.totSolvedTicketsperWeekSRL.columns = ['Week', 'SolvedTickets']

        snapshotObject.totSolvedTicketsperWeekCPF = {}
        snapshotObject.totSolvedTicketsperWeekCPF.title = 'Trend running year solved tickets per week SRL'
        snapshotObject.totSolvedTicketsperWeekCPF.columns = ['Week', 'SolvedTickets']

        snapshotObject.mDashboardTickets = []






        // values per snapshot
        s.values.forEach(function (v) {
            valueObject = {}

            // Dimensions
            valueObject.number = v.Number
            valueObject.title = v.title
            valueObject.state = v.State
            valueObject.ResponsibleUser = v['Responsible User']
            valueObject.ticketType = v.ticketType
            valueObject.lastChange = v.lastChange
            valueObject.creationDate =  v['Creation Date']
            valueObject.responsibleGroup = v['Responsible Group']
            valueObject.affectedUser = v['Affected Person ']
            valueObject.count = v.count
            valueObject.openDays = Number(v['Nr Of Open Calendar Days'])

            snapshotDetails.push(valueObject)
        })

        snapshotDetails =  underscore.uniq(snapshotDetails)
        snapshotObject.snapshotDetails = snapshotDetails

        snapshotDetails.forEach(function (v) {
            // Measures
            measureObject = {}
            measureObject.key = moment(snapshotObject.snapshot,'DD-MM-YYYY').week()

            if ((v['Responsible Group'] == 'EPS - CPF' || v['responsibleGroup'] == 'EPS - CPF') && moment().week() == moment(v.creationDate,"DD/MM/YYYY").week() ) {
                measureObject.cpf = v.count
            }
            if ( (v['Responsible Group'] == 'EPS - E-Soft' || v['responsibleGroup'] == 'EPS - E-Soft') && moment().week() == moment(v.creationDate,"DD/MM/YYYY").week()) {
                measureObject.esoft = v.count
            }
            if ( (v['Responsible Group'] == 'EPS - SRL' || v['responsibleGroup'] == 'EPS - SRL')&& moment().week() == moment(v.creationDate,"DD/MM/YYYY").week() ) {
                measureObject.srl = v.count
            }
            if ((v['Responsible Group'] == 'Service desk 1st line' || v['responsibleGroup'] == 'Service desk 1st line') && moment().week() == moment(v.creationDate,"DD/MM/YYYY").week()) {
                measureObject.firstLine = v.count
            }
            if ((v['Responsible Group'] == 'EPS Apps 2nd line' || v['responsibleGroup'] == 'EPS Apps 2nd line') && moment().week() == moment(v.creationDate,"DD/MM/YYYY").week()) {
                measureObject.secondLineApps = v.count
            }
            if ((v['Responsible Group'] == 'EPS - Cognos' || v['responsibleGroup'] == 'EPS - Cognos') && moment().week() == moment(v.creationDate,"DD/MM/YYYY").week()) {
                measureObject.cognos = v.count
            }
            if ((v['Responsible Group'] == 'EPS - Infra' || v['responsibleGroup'] == 'EPS - Infra') && moment().week() == moment(v.creationDate,"DD/MM/YYYY").week()) {
                measureObject.infra = v.count
            }
            if ((v['Responsible Group'] == 'Desktop Virtualisation 2nd line' || v['responsibleGroup'] == 'Desktop Virtualisation 2nd line')&& moment().week() == moment(v.creationDate,"DD/MM/YYYY").week()) {
                measureObject.desktopVirtualisatie = v.count
            }
            if ((v['Responsible Group'] == "EPS - DWH" || v['responsibleGroup'] == "EPS - DWH")&& moment().week() == moment(v.creationDate,"DD/MM/YYYY").week()) {
                measureObject.dwh = v.count
            }

            measureSet.push(measureObject)
        })

        // Aggegrate to state per snapshot
        snapshotObject.aggCountsPerDayCattegory = d3.nest()
            .key(function (d) {
                return d.key
            })
            .rollup(function (v) {
                return {
                    'cpf': d3.sum(v, function (d) {
                        return d.cpf
                    }),
                    'esoft': d3.sum(v, function (d) {
                        return d.esoft
                    }),
                    'firstLine': d3.sum(v, function (d) {
                        return d.firstLine;
                    }),
                    'srl': d3.sum(v, function (d) {
                        return d.srl;
                    }),
                    'secondLineApps': d3.sum(v, function (d) {
                        return d.secondLineApps;
                    }),
                    'infra': d3.sum(v, function (d) {
                        return d.infra;
                    }),
                    'cognos': d3.sum(v, function (d) {
                        return d.cognos;
                    }),
                    'dwh': d3.sum(v, function (d) {
                        return d.dwh;
                    })
                };
            })
            .entries(measureSet)


        snapshotObject.totActualTickets.columns.push('Weeknumber')
        var colls = Object.keys(snapshotObject.aggCountsPerDayCattegory[0].values)
        colls.forEach(function (c) {
            snapshotObject.totActualTickets.columns.push(c)
        })

        snapshotObject.totActualTickets.values.push(measureObject.key)
        colls.forEach(function (c) {
            snapshotObject.totActualTickets.values.push(snapshotObject.aggCountsPerDayCattegory[0].values[c])
        })

        snapshotObject.totActualTickets.title = "Total Actual tickets week" + measureObject.key
        snapshotObject.totActualTickets.underTitle = "Europool System BI & DM Team"


        //Tickets created total
        snapshotObject.totCreateTicketsperWeek.Data = datasetsCreatedPerWeekSubject(snapshotObject.snapshotDetails, 'All')
        //Tickets created SRL
        snapshotObject.totCreateTicketsperWeekSRL.Data = datasetsCreatedPerWeekSubject(snapshotObject.snapshotDetails, 'EPS - SRL')
        //Tickets created CPF
        snapshotObject.totCreateTicketsperWeekCPF.Data = datasetsCreatedPerWeekSubject(snapshotObject.snapshotDetails, 'EPS - CPF')

        //Tickets Solved total
        snapshotObject.totSolvedTicketsperWeek.Data = datasetsSolvedPerWeekSubject(snapshotObject.snapshotDetails, 'All')
        //Tickets Solved SRL
        snapshotObject.totSolvedTicketsperWeekSRL.Data = datasetsSolvedPerWeekSubject(snapshotObject.snapshotDetails, 'EPS - SRL')
        //Tickets Solved CPF
        snapshotObject.totSolvedTicketsperWeekCPF.Data = datasetsSolvedPerWeekSubject(snapshotObject.snapshotDetails, 'EPS - CPF')

        var ObjectDashboardTickets = {}, mDashboardTickets = [], snapshotweek = moment(s.key, "DD-MM-YYYY").week()
        snapshotObject.snapshotDetails.forEach(function (v) {

            v.creationWeek = moment(v.creationDate, "DD/MM/YYYY").week()
            v.creationMonth = moment(v.creationDate, "DD/MM/YYYY").month()
            v.creationYear = moment(v.creationDate, "DD/MM/YYYY").year()
            v.lastChangeWeek = moment(v.lastChange, "YYYY-MM-DD").week()
            v.lastChangeMonth = moment(v.lastChange, "YYYY-MM-DD").month()
            v.lastChangeYear  =moment(v.lastChange, "YYYY-MM-DD").year()

            // If the creation week is the same as the snapshot week then count all the tickets in this week
            // as created
            if (v.creationWeek == snapshotweek) {
                v.IndCreated = 1
                v.IndSolved = 0
                v.IndProgress = 0
                v.IndStock = 0
                v.IndSpider = 1

                if (v.state == "In Progress") {
                    v.IndProgress = 1
                }

                if (v.state == "Closed" || v.state == "Solved") {
                    v.IndSolved = 1
                }
            }
            // If the creation week is less then same as the snapshot week then count all the tickets in previous weeks
            // as stock
            if (v.creationWeek < snapshotweek) {
                v.IndCreated = 0
                v.IndSolved = 0
                v.IndProgress = 0
                v.IndStock = 1
                v.IndSpider = 0

                if (v.state == "In Progress") {
                    v.IndProgress = 1
                }

                if (v.state == "Closed" || v.state == "Solved") {
                    v.IndSolved = 1
                }

                if(v.creationWeek == snapshotweek){
                    v.IndSpider = 1
                }
            }
        })
        snapshotObject.mDashboardTickets = mDashboardTickets
        returnSet.push(snapshotObject)
    })
    return returnSet
}


// ------------------------------------------   FUNCTIONS ----------------------------------------------------------------------------
function datasetsCreatedPerWeekSubject(ds,group ) {
    var mObjectTotCreatedTickets = {}, mTotCreatedTickets = [], totCreatedTickets = [], totCreateTicketsperWeek = [], currentYear = Number(moment().year()) - 1
    //CreatedTicketsPerWeek

    if ( group == 'All') {
        ds.forEach(function (v) {
            if (v.creationYear == currentYear) {
                //console.info(v.creationDate )
                //console.info()
                mObjectTotCreatedTickets.count = v.count
                mObjectTotCreatedTickets.week = v.creationWeek
                mTotCreatedTickets.push(mObjectTotCreatedTickets)
                mObjectTotCreatedTickets = {}
            }
        })
    }
    else {
        ds.forEach(function (v) {
            if (v.creationYear == currentYear && v.responsibleGroup == group) {
                //console.info(v.creationDate )
                //console.info()
                mObjectTotCreatedTickets.count = v.count
                mObjectTotCreatedTickets.week = v.creationWeek
                mObjectTotCreatedTickets.month = v.creationMonth
                mTotCreatedTickets.push(mObjectTotCreatedTickets)
                mObjectTotCreatedTickets = {}
            }
        })
    }

    totCreatedTickets = d3.nest()
        .key(function (d) {
            return d.week
        })
        .rollup(function (v) {
            return {
                'count': d3.sum(v, function (d) {
                    return d.count
                })
            };
        })
        .entries(mTotCreatedTickets)

    totCreatedTickets.forEach(function (k) {
        totCreateTicketsperWeek.push([Number(k.key), k.values.count])
    })

    totCreateTicketsperWeek = totCreateTicketsperWeek.sort(function (a, b) {
        return a[0] - b[0]
    })

    return totCreateTicketsperWeek
}

// ------------- datasetsSolvedPerWeekSubject --------------------------------------------------------
function datasetsSolvedPerWeekSubject(ds,group ) {
    var mObjectTotCreatedTickets = {}, mTotCreatedTickets = [], totCreatedTickets = [], totCreateTicketsperWeek = [], currentYear = Number(moment().year()) - 1
    //CreatedTicketsPerWeek

    if ( group == 'All') {
        ds.forEach(function (v) {
            if (v.lastChangeYear == currentYear && ( v.state == "Solved" || v.state == "Closed")) {
                //console.info(v.creationDate )
                //console.info()
                mObjectTotCreatedTickets.count = v.count
                mObjectTotCreatedTickets.week =  v.lastChangeWeek
                mObjectTotCreatedTickets.month = v.lastChangeMonth
                mTotCreatedTickets.push(mObjectTotCreatedTickets)
                mObjectTotCreatedTickets = {}
            }
        })
    }
    else {
        ds.forEach(function (v) {
            if (v.lastChangeYear == currentYear && v.responsibleGroup == group && ( v.state == "Solved" || v.state == "Closed")) {
                //console.info(v.creationDate )
                //console.info()
                mObjectTotCreatedTickets.count = v.count
                mObjectTotCreatedTickets.week = v.lastChangeWeek
                mObjectTotCreatedTickets.month = v.lastChangeMonth
                mTotCreatedTickets.push(mObjectTotCreatedTickets)
                mObjectTotCreatedTickets = {}
            }
        })
    }

    totCreatedTickets = d3.nest()
        .key(function (d) {
            return d.week
        })
        .rollup(function (v) {
            return {
                'count': d3.sum(v, function (d) {
                    return d.count
                })
            };
        })
        .entries(mTotCreatedTickets)

    totCreatedTickets.forEach(function (k) {
        totCreateTicketsperWeek.push([Number(k.key), k.values.count])
    })

    totCreateTicketsperWeek = totCreateTicketsperWeek.sort(function (a, b) {
        return a[0] - b[0]
    })

    return totCreateTicketsperWeek
}

/**
 * Created by erik on 1/27/18.
 */
