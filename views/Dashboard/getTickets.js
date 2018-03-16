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

exports.getTickets = function (req, res, next) {

        console.info('-------------------Start Tickets Parameters--------------------------------------------------------')
         var snapshot = moment(req.body.snapshot) //--> add as filter to the queries except the trends.
         console.info(snapshot)
         var snapshotweek = moment(req.body.snapshot,'YYYY-MM-DD').week()
         console.info(snapshotweek)
        if(req.body.filter){
            var filter = req.body.filter
        }

        console.info('-------------------End Tickets Parameters--------------------------------------------------------')

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
            // Load stgOmniTracker - prepare measureSet
            function (callback) {
                db.collection('stgOmniTracker').find({$and:[{creationWeek: {$lte: snapshotweek}},{creationYear:moment().year()},{snapshotDate:new Date(snapshot)}]}).toArray(function (err, rawMeasureSet) {
                    if (err) return callback(err);
                    locals.rawMeasureSet = rawMeasureSet;
                    callback();
                });
            },
            // Load stgOmniTracker - prepare measureSet rawtotCreatedPerWeek
            function (callback) {
                db.collection('stgOmniTracker').aggregate([ { $group: {_id: {creationWeek: "$creationWeek", creationYear: "$creationYear"},totalCount: { $sum: "$count" }} }]).toArray(function (err, rawtotCreatedPerWeek) {
                    if (err) return callback(err);
                    locals.rawtotCreatedPerWeek = rawtotCreatedPerWeek;
                    callback();
                });
            },
            // Load stgOmniTracker - prepare measureSet rawtotSolvedPerWeek
            function (callback) {
                db.collection('stgOmniTracker').aggregate([{ $match: {State:"Closed" }},{ $group: {_id: {lastChangeWeek: "$lastChangeWeek", lastChangeYear: "$lastChangeYear"},totalCount: { $sum: "$count" }}}]) .toArray(function (err, rawtotSolvedPerWeek) {
                    if (err) return callback(err);
                    locals.rawtotSolvedPerWeek = rawtotSolvedPerWeek;
                    callback();
                });
            },
            // Load stgOmniTracker - prepare measureSet rawtotSolvedPerWeekSRL
            function (callback) {
                db.collection('stgOmniTracker').aggregate([{ $match:{$and: [ {State:"Closed"},{"Responsible Group": "EPS - SRL"}]}},{ $group: {_id: {lastChangeWeek: "$lastChangeWeek", lastChangeYear: "$lastChangeYear"},totalCount: { $sum: "$count" }}}]).toArray(function (err, rawtotSolvedPerWeekSRL) {
                    if (err) return callback(err);
                    locals.rawtotSolvedPerWeekSRL = rawtotSolvedPerWeekSRL;
                    callback();
                });
            },
            // Load stgOmniTracker - prepare measureSet rawtotCreatedPerWeekSRL
            function (callback) {
                db.collection('stgOmniTracker').aggregate([{ $match: {"Responsible Group": "EPS - SRL" }},{ $group: {_id: {creationWeek: "$creationWeek", creationYear: "$creationYear"},totalCount: { $sum: "$count" }}}]).toArray(function (err, rawtotCreatedPerWeekSRL) {
                    if (err) return callback(err);
                    locals.rawtotCreatedPerWeekSRL = rawtotCreatedPerWeekSRL;
                    callback();
                });
            },
            // Load stgOmniTracker - prepare measureSet rawtotSolvedPerWeekCPF
            function (callback) {
                db.collection('stgOmniTracker').aggregate([{ $match:{$and: [ {State:"Closed" },{"Responsible Group": "EPS - CPF"}]}},{ $group: {_id: {lastChangeWeek: "$lastChangeWeek", lastChangeYear: "$lastChangeYear"},totalCount: { $sum: "$count" }}}]).toArray(function (err, rawtotSolvedPerWeekCPF) {
                    if (err) return callback(err);
                    locals.rawtotSolvedPerWeekCPF = rawtotSolvedPerWeekCPF;
                    callback();
                });
            },
            // Load stgOmniTracker - prepare measureSet rawtotCreatedPerWeekCPF
            function (callback) {
                db.collection('stgOmniTracker').aggregate([{ $match: {"Responsible Group": "EPS - CPF" } },{ $group: {_id: {creationWeek: "$creationWeek", creationYear: "$creationYear"},totalCount: { $sum: "$count" }}}]).toArray(function (err, rawtotCreatedPerWeekCPF) {
                    if (err) return callback(err);
                    locals.rawtotCreatedPerWeekCPF = rawtotCreatedPerWeekCPF;
                    callback();
                });
            },
            // Load stgOmniTracker - prepare measureSet rawtotSolvedPerWeekCognos
            function (callback) {
                db.collection('stgOmniTracker').aggregate([{ $match:{$and: [ {State:"Closed" },{"Responsible Group": "EPS - Cognos"}]}},{ $group: {_id: {lastChangeWeek: "$lastChangeWeek", lastChangeYear: "$lastChangeYear"},totalCount: { $sum: "$count" }}}]).toArray(function (err, rawtotSolvedPerWeekCognos) {
                    if (err) return callback(err);
                    locals.rawtotSolvedPerWeekCognos = rawtotSolvedPerWeekCognos;
                    callback();
                });
            },
            // Load stgOmniTracker - prepare measureSet rawtotCreatedPerWeekCognos
            function (callback) {
                db.collection('stgOmniTracker').aggregate([{ $match: {"Responsible Group": "EPS - Cognos" } },{ $group: {_id: {creationWeek: "$creationWeek", creationYear: "$creationYear"},totalCount: { $sum: "$count" }}}]).toArray(function (err, rawtotCreatedPerWeekCognos) {
                    if (err) return callback(err);
                    locals.rawtotCreatedPerWeekCognos = rawtotCreatedPerWeekCognos;
                    callback();
                });
            },
            // Load stgOmniTracker - prepare measureSet rawtotSolvedPerWeekDWH
            function (callback) {
                db.collection('stgOmniTracker').aggregate([{ $match:{$and: [ {State:"Closed" },{"Responsible Group": "EPS - DWH"}]}},{ $group: {_id: {lastChangeWeek: "$lastChangeWeek", lastChangeYear: "$lastChangeYear"},totalCount: { $sum: "$count" }}}]).toArray(function (err, rawtotSolvedPerWeekDWH) {
                    if (err) return callback(err);
                    locals.rawtotSolvedPerWeekDWH = rawtotSolvedPerWeekDWH;
                    callback();
                });
            },
            // Load stgOmniTracker - prepare measureSet rawtotCreatedPerWeekDWH
            function (callback) {
                db.collection('stgOmniTracker').aggregate([{ $match: {"Responsible Group": "EPS - DWH" } },{ $group: {_id: {creationWeek: "$creationWeek", creationYear: "$creationYear"},totalCount: { $sum: "$count" }}}]).toArray(function (err, rawtotCreatedPerWeekDWH) {
                    if (err) return callback(err);
                    locals.rawtotCreatedPerWeekDWH = rawtotCreatedPerWeekDWH;
                    callback();
                });
            },
            // Load stgOmniTracker - prepare measureSet rawtotSolvedPerWeekDWH
            function (callback) {
                db.collection('stgOmniTracker').aggregate([{ $match:{$and: [ {State:"Closed" },{"Responsible Group": "EPS - E-Soft"}]}},{ $group: {_id: {lastChangeWeek: "$lastChangeWeek", lastChangeYear: "$lastChangeYear"},totalCount: { $sum: "$count" }}}]).toArray(function (err, rawtotSolvedPerWeekESOFT) {
                    if (err) return callback(err);
                    locals.rawtotSolvedPerWeekESOFT = rawtotSolvedPerWeekESOFT;
                    callback();
                });
            },
            // Load stgOmniTracker - prepare measureSet rawtotCreatedPerWeekDWH
            function (callback) {
                db.collection('stgOmniTracker').aggregate([{ $match: {"Responsible Group": "EPS - E-Soft" } },{ $group: {_id: {creationWeek: "$creationWeek", creationYear: "$creationYear"},totalCount: { $sum: "$count" }}}]).toArray(function (err, rawtotCreatedPerWeekESOFT) {
                    if (err) return callback(err);
                    locals.rawtotCreatedPerWeekESOFT = rawtotCreatedPerWeekESOFT;
                    callback();
                });
            },
            // Load stgOmniTracker - prepare measureSet perUser
            function (callback) {
                db.collection('stgOmniTracker').aggregate([{$match: {"creationYear": moment().year()}}, {
                    $group: {
                        _id: {
                            creationWeek: "$creationWeek",
                            "Affected Person": "$Affected Person",
                            "Responsible Group" : "$Responsible Group"
                        }, totalCount: {$sum: "$count"}
                    }
                }]).toArray(function (err, rawtotCreatedPerWeekUsers) {
                    if (err) return callback(err);
                    locals.rawtotCreatedPerWeekUsers = rawtotCreatedPerWeekUsers;
                    callback();
                });

            }
        ];
        console.info('--------------- START ASYNC ------------------------')
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            var   businessrules = locals.businessrules
                , rawMeasureSet = locals.rawMeasureSet
                , resultSet = {}
                , aggCountsPerDayCattegory = []
                , group = locals.group
            db.close()
            console.info('---------------------CLOSE ASYNC-------------------------')

            rawMeasureSet.forEach(function (ticket) {
                ticket.snapshotDate = moment(ticket.snapshotDate).format("DD-MM-YYYY")

            })

            console.info('----------------------------------------------')
            // --------------------------FLTR Responsible Group ------------------------------------------------------
            ftlrGroup.push('All')
            var groupList = []

            rawMeasureSet.forEach(function (t) {
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
                .entries(rawMeasureSet);

            // -------------------------- Snapshots ------------------------------------------------------
            var snapshots = [], snapshotDate

            rawMeasureSet.forEach(function (ticket) {
                snapshots.push(ticket.snapshotDate)
            })

            snapshots = underscore.sortBy(snapshots,function (node) {
                return + (moment(node,'DD-MM-YYYY'))
            })

            snapshots = Array.from(new Set(snapshots))

            //------------------------ Send Data to Client ------------------------------------------------
            res.status(200).json({
                fltrGroup: ftlrGroup,
                dataSpider: titleList,
                legendaSpider: legenda,
                snapshots: snapshots,
                perSnapshot:  filterSnapshot(locals,snapshot,filter)
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
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            db.close();

            res.status(200).json(locals.collection)
        })
    })
}

function filterSnapshot(dataset, snapshot,filter) {

    var processHit = 0
    if (dataset.rawMeasureSet.length > 0 && ( filter == null || !filter)) {
        console.info('Datset is not null & filter does not exist')

            var tickets = dataset.rawMeasureSet
            , rawtotCreatedPerWeek = dataset.rawtotCreatedPerWeek
            , rawtotSolvedPerWeek = dataset.rawtotSolvedPerWeek
            , rawtotSolvedPerWeekSRL = dataset.rawtotSolvedPerWeekSRL
            , rawtotCreatedPerWeekSRL = dataset.rawtotCreatedPerWeekSRL
            , rawtotSolvedPerWeekCPF = dataset.rawtotSolvedPerWeekCPF
            , rawtotCreatedPerWeekCPF = dataset.rawtotCreatedPerWeekCPF
            , rawtotSolvedPerWeekCognos = dataset.rawtotSolvedPerWeekCognos
            , rawtotCreatedPerWeekCognos = dataset.rawtotCreatedPerWeekCognos
            , rawtotSolvedPerWeekDWH = dataset.rawtotSolvedPerWeekDWH
            , rawtotCreatedPerWeekDWH = dataset.rawtotCreatedPerWeekDWH
            , rawtotSolvedPerWeekESOFT = dataset.rawtotSolvedPerWeekESOFT
            , rawtotCreatedPerWeekESOFT = dataset.rawtotCreatedPerWeekESOFT
            , rawtotCreatedPerWeekUsers = []

            // (A)
            dataset.rawtotCreatedPerWeekUsers.forEach(function (r) {
                if (r.totalCount > 3 &&  r._id["Affected Person"] != 'Administration, Server'){
                    rawtotCreatedPerWeekUsers.push({User:r._id["Affected Person"], count: r.totalCount})
                }
            })

        console.info('DataSet Length: ' + tickets.length)
        var snapshotWeek = moment(snapshot,'YYYY-MM-DD').week()
        var dayinWeek = moment(snapshot,'YYYY-MM-DD').day()

        console.info('snapshotWeek: ' + snapshotWeek)
        console.info('dayinWeek: ' + dayinWeek)
        console.info(typeof 123)
        console.info(typeof dayinWeek)
        console.info(typeof snapshotWeek)

        if (dayinWeek == 1){
            console.info('dayinweek:1' )
            snapshotWeek = snapshotWeek -1
        }

        console.info('snapshotWeekAfter: ' + snapshotWeek)
        processHit = 1

    }
    if (dataset.rawMeasureSet.length > 0 && ( filter != null && filter)){
        console.info('Datset is not null & filter exist')
        var tickets = dataset.rawMeasureSet
            , rawtotCreatedPerWeek = dataset.rawtotCreatedPerWeek
            , rawtotSolvedPerWeek = dataset.rawtotSolvedPerWeek
            , rawtotSolvedPerWeekSRL = dataset.rawtotSolvedPerWeekSRL
            , rawtotCreatedPerWeekSRL = dataset.rawtotCreatedPerWeekSRL
            , rawtotSolvedPerWeekCPF = dataset.rawtotSolvedPerWeekCPF
            , rawtotCreatedPerWeekCPF = dataset.rawtotCreatedPerWeekCPF
            , rawtotSolvedPerWeekCognos = dataset.rawtotSolvedPerWeekCognos
            , rawtotCreatedPerWeekCognos = dataset.rawtotCreatedPerWeekCognos
            , rawtotSolvedPerWeekDWH = dataset.rawtotSolvedPerWeekDWH
            , rawtotCreatedPerWeekDWH = dataset.rawtotCreatedPerWeekDWH
            , rawtotSolvedPerWeekESOFT = dataset.rawtotSolvedPerWeekESOFT
            , rawtotCreatedPerWeekESOFT = dataset.rawtotCreatedPerWeekESOFT
            , rawtotCreatedPerWeekUsers = []


        dataset.rawtotCreatedPerWeekUsers.forEach(function (r) {
            if (r.totalCount > 3 && r._id["Responsible Group"] == filter && r._id["Affected Person"] != 'Administration, Server'){
                rawtotCreatedPerWeekUsers.push({User:r._id["Affected Person"], count: r.totalCount})
            }
        })




            console.info('DataSet Length: ' + tickets.length)
            var snapshotWeek = moment(snapshot,'YYYY-MM-DD').week()
            console.info('snapshotWeek: '+ snapshotWeek.toString() )
            if (filter != 'All'){
                tickets = underscore.filter(tickets,{"Responsible Group": filter})
            }
            var dayinWeek = moment(snapshot,'YYYY-MM-DD').day()
            console.info('dayinWeek: ' + dayinWeek)

            if (dayinWeek == 1){
                console.info('dayinweek:1' )
                snapshotWeek = snapshotWeek -1
            }

            console.info('snapshotWeekAfter: ' + snapshotWeek)
            processHit = 1
    }


    if ( processHit == 1 ){
        var returnSet = []
            , snapshotDetails = []
            , AggCountPerDay = []
            , AggCountPerDayPerUser = []
            , DataSpider = []
            , snapshots = []
            , snapshotObject = {}
            , valueObject = {}
            , measureObject = {}
            , measureSet = []
            , perSnapshot = []

        snapshotObject.snapshot = snapshot
        snapshotObject.snapshotDetails = []
        snapshotObject.totActualTickets = {}
        snapshotObject.totActualTickets.columns = []
        snapshotObject.totActualTickets.values = []
        snapshotObject.totActualTickets.title = ""
        snapshotObject.totActualTickets.underTitle = ""
        snapshotObject.countSLATicketsperWeek = {}
        snapshotObject.countSLATicketsperWeek.Data = []
        snapshotObject.countSLATicketsperWeek.Columns = ['Week','00','01','03','04','05']
        snapshotObject.countSLATicketsperWeek.title = "SRL Tickets against SLA per week " + moment().year()

        snapshotObject.totTicketsperWeek = {}
        snapshotObject.totTicketsperWeek.title = 'Trend running year tickets per week'
        snapshotObject.totTicketsperWeek.columns = ['Week', 'CreatedTickets', 'TicketsClosed']

        snapshotObject.totTicketsperWeekSRL = {}
        snapshotObject.totTicketsperWeekSRL.title = 'Trend running year tickets per week SRL'
        snapshotObject.totTicketsperWeekSRL.columns = ['Week', 'CreatedTickets', 'TicketsClosed']

        snapshotObject.totTicketsperWeekCPF = {}
        snapshotObject.totTicketsperWeekCPF.title = 'Trend running year created tickets per week CPF'
        snapshotObject.totTicketsperWeekCPF.columns = ['Week', 'CreatedTickets', 'TicketsClosed']

        snapshotObject.totTicketsperWeekCognos = {}
        snapshotObject.totTicketsperWeekCognos.title = 'Trend running year created tickets per week Cognos'
        snapshotObject.totTicketsperWeekCognos.columns = ['Week', 'CreatedTickets', 'TicketsClosed']

        snapshotObject.totTicketsperWeekDWH = {}
        snapshotObject.totTicketsperWeekDWH.title = 'Trend running year created tickets per week DWH'
        snapshotObject.totTicketsperWeekDWH.columns = ['Week', 'CreatedTickets', 'TicketsClosed']

        snapshotObject.totTicketsperWeekESOFT = {}
        snapshotObject.totTicketsperWeekESOFT.title = 'Trend running year created tickets per week ESOFT'
        snapshotObject.totTicketsperWeekESOFT.columns = ['Week', 'CreatedTickets', 'TicketsClosed']

        snapshotObject.mDashboardTickets = []

        // values per snapshot
        tickets.forEach(function (v) {
            valueObject = {}

            // Dimensions
            valueObject.number = v.Number
            valueObject.title = v.Title
            valueObject.state = v.State
            valueObject.ResponsibleUser = v['Responsible User']
            valueObject.ticketType = v.ticketType
            valueObject.lastChange = v.lastChange
            valueObject.lastChangeWeek = v.lastChangeWeek
            valueObject.lastChangeYear = v.lastChangeYear
            valueObject.creationWeek = v.creationWeek
            valueObject.creationYear = v.creationYear
            valueObject.creationDate = v['Creation Date']
            valueObject.responsibleGroup = v['Responsible Group']
            valueObject.affectedUser = v['Affected Person ']
            valueObject.count = v.count
            valueObject.openDays = Number(v['Nr Of Open Calendar Days'])

            snapshotDetails.push(valueObject)
        })

        snapshotDetails = underscore.uniq(snapshotDetails)
        snapshotObject.snapshotDetails = snapshotDetails

        console.info('tickets length before loop: ' + tickets.length)
        tickets.forEach(function (v) {
            // Measures
            measureObject = {}
            if( v.creationYear == moment().year() && v.creationWeek == snapshotWeek){
                if ((v['Responsible Group'] == 'EPS - CPF' || v['responsibleGroup'] == 'EPS - CPF')) {
                    measureObject.cpf = v.count
                }
                if ((v['Responsible Group'] == 'EPS - E-Soft' || v['responsibleGroup'] == 'EPS - E-Soft')) {
                    measureObject.esoft = v.count
                }
                if ((v['Responsible Group'] == 'EPS - SRL' || v['responsibleGroup'] == 'EPS - SRL')) {
                    measureObject.srl = v.count
                }
                if ((v['Responsible Group'] == 'Service desk 1st line' || v['responsibleGroup'] == 'Service desk 1st line')) {
                    measureObject.firstLine = v.count
                }
                if ((v['Responsible Group'] == 'EPS Apps 2nd line' || v['responsibleGroup'] == 'EPS Apps 2nd line')) {
                    measureObject.secondLineApps = v.count
                }
                if ((v['Responsible Group'] == 'EPS - Cognos' || v['responsibleGroup'] == 'EPS - Cognos')) {
                    measureObject.cognos = v.count
                }
                if ((v['Responsible Group'] == 'EPS - Infra' || v['responsibleGroup'] == 'EPS - Infra')) {
                    measureObject.infra = v.count
                }
                if ((v['Responsible Group'] == 'Desktop Virtualisation 2nd line' || v['responsibleGroup'] == 'Desktop Virtualisation 2nd line')) {
                    measureObject.desktopVirtualisatie = v.count
                }
                if ((v['Responsible Group'] == "EPS - DWH" || v['responsibleGroup'] == "EPS - DWH")) {
                    measureObject.dwh = v.count
                }
                measureSet.push(measureObject)
            }
        })


        var slaArray = []
        var filteredTickets =  underscore.where(tickets, { creationYear: moment(snapshot,'YYYY-MM-DD').year()})

        filteredTickets.forEach(function (v) {

            if (getSLA(v.Title) == '00'){
                slaArray.push({'00': v.count, creationWeek: v.creationWeek})
            }
            if (getSLA(v.Title) == '01'){
                slaArray.push({'01': v.count, creationWeek: v.creationWeek})
            }
            if (getSLA(v.Title) == '02'){
                slaArray.push({'02': v.count, creationWeek: v.creationWeek})
            }
            if (getSLA(v.Title) == '03'){
                slaArray.push({'03': v.count, creationWeek: v.creationWeek})
            }
            if (getSLA(v.Title) == '04'){
                slaArray.push({'04': v.count, creationWeek: v.creationWeek})
            }
            if (getSLA(v.Title) == '05'){
                slaArray.push({'05': v.count, creationWeek: v.creationWeek})
            }
        })

        var slaTicketsPerWeek = []
        slaTicketsPerWeek = d3.nest()
            .key(function (d) {
                return d.creationWeek
            })
            .rollup(function (v) {
                return {
                    '00': d3.sum(v, function (d) {
                        return d['00']
                    }),
                    '01': d3.sum(v, function (d) {
                        return d['01']
                    }),
                    '02': d3.sum(v, function (d) {
                        return d['02'];
                    }),
                    '03': d3.sum(v, function (d) {
                        return d['03'];
                    }),
                    '04': d3.sum(v, function (d) {
                        return d['04'];
                    }),
                    '05': d3.sum(v, function (d) {
                        return d['05'];
                    })
                };
            })
            .entries(slaArray)

        var countSLAItemsPerWeek = []
        var countSLAPerWeek = []
        slaTicketsPerWeek.forEach(function (i) {
            countSLAItemsPerWeek = []
            countSLAItemsPerWeek.push(Number(i.key))
            countSLAItemsPerWeek.push(i.values['00'])
            countSLAItemsPerWeek.push(i.values['01'])
            countSLAItemsPerWeek.push(i.values['02'])
            countSLAItemsPerWeek.push(i.values['03'])
            countSLAItemsPerWeek.push(i.values['04'])
            countSLAItemsPerWeek.push(i.values['05'])

            countSLAPerWeek.push(countSLAItemsPerWeek)
        })

        snapshotObject.countSLATicketsperWeek.Data = countSLAPerWeek

        console.info('MeasureSet: ' + measureSet.length)
        if (measureSet.length > 0 ) {
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

            snapshotObject.totActualTickets.title = "Total Actual tickets week " + moment().week()
            snapshotObject.totActualTickets.underTitle = "Europool System BI & DM Team"

            //Tickets total
            snapshotObject.totTicketsperWeek.Data = datasetsPerSubject(rawtotCreatedPerWeek, rawtotSolvedPerWeek)
            //Tickets created SRL
            snapshotObject.totTicketsperWeekSRL.Data = datasetsPerSubject(rawtotCreatedPerWeekSRL, rawtotSolvedPerWeekSRL)
            //Tickets created CPF
            snapshotObject.totTicketsperWeekCPF.Data = datasetsPerSubject(rawtotCreatedPerWeekCPF, rawtotSolvedPerWeekCPF)
            //Tickets created Cognos
            snapshotObject.totTicketsperWeekCognos.Data = datasetsPerSubject(rawtotCreatedPerWeekCognos, rawtotSolvedPerWeekCognos)
            //Tickets created DWH
            snapshotObject.totTicketsperWeekDWH.Data = datasetsPerSubject(rawtotCreatedPerWeekDWH, rawtotSolvedPerWeekDWH)
            //Tickets created ESOFT
            snapshotObject.totTicketsperWeekESOFT.Data = datasetsPerSubject(rawtotCreatedPerWeekESOFT, rawtotSolvedPerWeekESOFT)
            var ObjectDashboardTickets = {}
                , mDashboardTickets = [], snapshotweek = moment(snapshot, "DD-MM-YYYY").week()

            snapshotDetails.forEach(function (v) {
                // If the creation week is the same as the snapshot week then count all the tickets in this week
                // as created
                if (v.responsibleGroup == "EPS - CPF" ||
                    v.responsibleGroup == "EPS - SRL" ||
                    v.responsibleGroup == "EPS - Cognos" ||
                    v.responsibleGroup == "EPS - DWH" ||
                    v.responsibleGroup == "E-Soft") {
                    v.IndEPS = 1
                }
                if (v.creationWeek == snapshotWeek) {


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
                if (v.creationWeek < snapshotWeek && (v.state == "In Progress" || v.state == "Classification"  || v.state == "Acceptance")) {
                    v.IndCreated = 0
                    v.IndSolved = 0
                    v.IndProgress = 0
                    v.IndStock = 1
                    v.IndSpider = 0
                }

                if (v.creationWeek < snapshotWeek && (v.state == "Closed" || v.state == "Solved" )) {
                    v.IndCreated = 0
                    v.IndSolved = 0
                    v.IndProgress = 0
                    v.IndStock = 0
                    v.IndSpider = 0
                }
            })


            var aggTotCreatedPerWeekUsers = d3.nest()
                .key(function (d) {
                    return d.User
                })
                .rollup(function (v) {
                    return {
                        'count': d3.sum(v, function (d) {
                            return d.count
                        })
                    };
                })
                .entries(rawtotCreatedPerWeekUsers)

            var arrTotCreatedPerWeekData = []
            aggTotCreatedPerWeekUsers.forEach(function (r) {
                arrTotCreatedPerWeekData.push([r.key,r.values.count])
            })

            snapshotObject.totCreatedPerWeekUser = {}
            snapshotObject.totCreatedPerWeekUser.Data = arrTotCreatedPerWeekData
            snapshotObject.totCreatedPerWeekUser.title = 'Ticket per affected user ' + moment().year()

            var LocalUSerPerLocalOffice = [{user:"Juarez Martinez, Javier", office: "Local Office Spain"}
                                         , {user:"De Prins, Frank", office: "Local Office Belgium"}
                                         , {user:"Fraai, Juny", office: "Central Office"}
                                         , {user:"Angosto, Carmen", office: "Local Office Spain"}
                                         , {user:"Rien, Wolfgang", office: "Local Office Germany"}
                                         , {user:"Muenzberg, Simone", office: "Local Office Germany"}
                                         , {user: "Oláh, Barbara", office: "Local Office Budapest"}
                                         , {user: "Janssens, Jeroen", office: "Central Office"}
                                         , {user: "de Zeeuw, Lucia",  office: "Central Office"}
                                         , {user: "Van Dessel, Kenny", office: "Local Office Belgium"}
                                         , {user: "Rahn, Ruth", office: "Local Office Germany"}
                                         , {user: "van Alphen, Margit", office:"Central Office"}]


            var arrLocalOfficePerUser = []
            arrTotCreatedPerWeekData.forEach(function (r) {
                LocalUSerPerLocalOffice.forEach(function (u) {
                    if ( r[0] == u.user){
                        arrLocalOfficePerUser.push({office: u.office, count: r[1]})
                    }
                })
            })

            var aggTotCreatedPerWeekOffice = d3.nest()
                .key(function (d) {
                    return d.office
                })
                .rollup(function (v) {
                    return {
                        'count': d3.sum(v, function (d) {
                            return d.count
                        })
                    };
                })
                .entries(arrLocalOfficePerUser)

            var arrLocalOffice = []
            aggTotCreatedPerWeekOffice.forEach(function (r) {
                arrLocalOffice.push([r.key,r.values.count])
            })

            snapshotObject.totCreatedPerWeekOffice = {}
            snapshotObject.totCreatedPerWeekOffice.Data = arrLocalOffice
            snapshotObject.totCreatedPerWeekOffice.title = 'Ticket per Office ' + moment().year()
            snapshotObject.mDashboardTickets = mDashboardTickets
            returnSet.push(snapshotObject)
            return returnSet
        }
    }
else{
    returnSet = null
    }
}


// ------------------------------------------   GENERIC FUNCTIONS ----------------------------------------------------------------------------
function datasetsPerSubject(creat, closed ) {
    var currentYear = Number(moment().year())
       ,totTicketsperWeek =  joinAgg(closed,creat,currentYear)

    return totTicketsperWeek
}

function joinAgg(lookupTable, mainTable, fltrYear) {
    var  outputArray = []
    mainTable.forEach(function (m) {
        lookupTable.forEach(function (lkp) {
            if(lkp._id.lastChangeWeek == m._id.creationWeek && lkp._id.lastChangeYear == m._id.creationYear && m._id.creationYear == fltrYear ){
                outputArray.push([lkp._id.lastChangeWeek, m.totalCount, lkp.totalCount])
            }
        })
    })
    outputArray.sort(function(a,b) {
        return a[0] - b[0]})
    return outputArray
}


//  ------------------------------------  GET SRL PRIORITIES --------------------------------------------------------------------------------------
function getSLA(title) {
    var titleArray = title.split(' ')
    var returnString = ''


    titleArray.forEach(function (t) {
        if (t == '00' ){
            returnString = '00'
        }
        if (t == '01' ){
            returnString = '01'
        }
        if (t == '02' ) {
            returnString = '02'
        }
        if (t == '03' ){
            returnString = '03'
        }
        if (t == '04'  ) {
            returnString = '04'
        }
        if (t == '05'  ) {
            returnString = '05'
        }
    })

    return returnString
}