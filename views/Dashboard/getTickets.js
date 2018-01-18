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

        console.info('-------------------Get Tickets --------------------------------------------------------')

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
                db.collection('stgOmniTracker').find({}).toArray(function (err, tickets) {
                    if (err) return callback(err);
                    locals.tickets = tickets;
                    callback();
                });
            }
        ];
        console.info('--------------- START ASYNC ------------------------')
        async.parallel(tasks, function (err) {
            if (err) return next(err);
            var businessrules = locals.businessrules, tickets = locals.tickets, resultSet = {}, aggCountsPerDayCattegory = []
            db.close()

            tickets.forEach(function (ticket) {
                ticket.snapshotDate = moment(ticket.snapshotDate).format("DD-MM-YYYY")

            })

            var persnapshot = filterSnapshot(tickets)

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



            var countsPerUser = d3.nest()
                .key(function (d) {
                    return d['Affected Person']
                })
                .rollup(function (v) {
                    return {
                        count: d3.sum(v, function (d) {
                            return d.count;
                        }),
                    };
                })
                .entries(tickets)




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
                    snapshotDate = moment(snapshot, 'DD-MM-YYYY').toDate(),
                    lastChange = moment(key[5]).format('DD-MM-YYYY'),
                    lastChangeDate = moment(lastChange, 'DD-MM-YYYY').toDate(),
                    cpf = row.values['EPS-CPF'],
                    esoft = row.values['EPS-E-Soft'],
                    firstLine = row.values['Service desk 1st line'],
                    srl = row.values['EPS-SRL'],
                    secondLineApps = row.values['EPS Apps 2nd line'],
                    cognos = row.values['EPS-Cognos'],
                    infra = row.values['EPS-Infra'],
                    desktopVirtualisatie = row.values['Desktop Virtualisation 2nd line'],
                    leadTime,
                    pushObject = {}
                pushObject.CreationDate = moment(CreationDate).toDate()
                pushObject.Group = Group
                pushObject.State = State


                if (State == 'Classification') {
                    countCreatedTickets = count
                    leadTime = daydiff(moment(CreationDate).toDate(), snapshotDate)
                }

                if (State == 'In progress') {
                    countOpenTickets = count
                    leadTime = daydiff(moment(CreationDate).toDate(), snapshotDate)
                }

                if (State == 'Classification') {
                    leadTime = daydiff(moment(CreationDate).toDate(), snapshotDate)
                }

                if (State == 'Waiting') {
                    countOpenTickets = count
                    leadTime = daydiff(moment(CreationDate).toDate(), snapshotDate)
                }

                if (State == 'Solved') {
                    countSolvedTickets = count
                    leadTime = daydiff(moment(CreationDate).toDate(), lastChangeDate)
                }


                pushObject.count = row.values.count
                pushObject.countOpenTickets = countOpenTickets
                pushObject.countCreatedTickets = countCreatedTickets
                pushObject.countSolvedTickets = countSolvedTickets
                pushObject.snapshotDate = snapshotDate
                pushObject.leadTime = leadTime

                // "Service desk 2nd line",
                // "EPS Infra 2nd line",
                // "Operating Systems 2nd line",
                // "Realdolmen Apps 2nd line",
                // "Operations 1st line",
                // "EPS - DWH",
                // "Field Back End HW 2nd line",
                //"Realdolmen Infra 2nd Line"

                if (key[1] == 'EPS - CPF') {
                    pushObject.cpf = row.values.count
                }
                if (key[1] == 'EPS - E-Soft') {
                    pushObject.esoft = row.values.count
                }
                if (key[1] == 'EPS - SRL') {
                    pushObject.srl = row.values.count
                }
                if (key[1] == 'Service desk 1st line') {
                    pushObject.firstLine = row.values.count
                }
                if (key[1] == 'EPS Apps 2nd line') {
                    pushObject.secondLineApps = row.values.count
                }
                if (key[1] == 'EPS - Cognos') {
                    pushObject.cognos = row.values.count
                }
                if (key[1] == 'EPS - Infra') {
                    pushObject.infra = row.values.count
                }
                if (key[1] == 'Desktop Virtualisation 2nd line') {
                    pushObject.desktopVirtualisatie = row.values.count
                }

                aggCountsPerDayCattegory.push(pushObject)

            });

            console.info('----------------------------------------------')
            ftlrGroup.push('All')
            fltrState.push('All')

            aggCountsPerDayCattegory.forEach(function (row) {
                if (row.Group != compareWordGroup) {
                    ftlrGroup.push(row.Group)
                    compareWordGroup = row.Group
                }
                if (row.State != compareWordState) {
                    fltrState.push(row.State)
                    compareWordState = row.State
                }
            })

            ftlrGroup = underscore.uniq(ftlrGroup)
            fltrState = underscore.uniq(fltrState)


            // Aggegrate to Group
            var titleList = []
            var legenda = []
            var aggTicketsGroup = d3.nest()
                .key(function (d) {
                    return d['Responsible Group'];
                })
                .entries(tickets);

            var exceptions = [' - ','q','fk','','fw','is','not','working','-','any','from','info','/','bij','get','match','Day','Wrong'], temp = []

            businessrules.forEach(function (row) {
                exceptions.push(row.lookupValue)
            })

            aggTicketsGroup.forEach(function (group) {
                var values = group.values, innerArray = []
                values.forEach(function (value) {

                    var titleWords = value.Title.split(' ')
                    titleWords.forEach(function (word) {
                        innerArray.push(word)
                    })
                });

                var wordList = fltrWordCountList(innerArray,3, null)
                var fltrWordList = wordList.filter(function( o) {
                    return exceptions.indexOf(o.word) == -1;
                })
                temp = []

                if (fltrWordList.length > 0){
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
                    row.value =  Math.round((row.value / max) * 100) / 100
                })
            })

            var snapshots = [], snapshotDate

            tickets.forEach(function (ticket) {
                snapshots.push(ticket.snapshotDate)
            })


            snapshots = underscore.sortBy(snapshots,function (node) {
                return + (moment(node,'DD-MM-YYYY'))

            })



            var aggCountTicketsPerUser = []

            countsPerUser.forEach(function (r) {
                if (r.values.count > 4){
                    aggCountTicketsPerUser.push({user: r.key, countTickets: r.values.count})
                }
            })

            snapshots = Array.from(new Set(snapshots))

            res.status(200).json({
                aggCountsPerDayCattegory: aggCountsPerDayCattegory,
                fltrGroup: ftlrGroup,
                fltrState: fltrState,
                dataSpider: titleList,
                legendaSpider: legenda,
                allTickets: tickets,
                snapshots: snapshots,
                ticketsPerUser: aggCountTicketsPerUser,
                perSnapshot:  persnapshot


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


    //console.info(updateObject)


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
        snapshotDetails.mTotCreatedTickets = []



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

            snapshotDetails.push(valueObject)
        })

        snapshotDetails =  underscore.uniq(snapshotDetails)
        snapshotObject.snapshotDetails = snapshotDetails

        snapshotDetails.forEach(function (v) {
            // Measures
            measureObject = {}
            measureObject.key = moment(snapshotObject.snapshot,'DD-MM-YYYY').week()

             if (v['Responsible Group'] == 'EPS - CPF') {
             measureObject.cpf = v.count
             }
             if (v['Responsible Group'] == 'EPS - E-Soft') {
             measureObject.esoft = v.count
             }
             if (v['Responsible Group'] == 'EPS - SRL') {
             measureObject.srl = v.count
             }
             if (v['Responsible Group'] == 'Service desk 1st line') {
             measureObject.firstLine = v.count
             }
             if (v['Responsible Group'] == 'EPS Apps 2nd line') {
             measureObject.secondLineApps = v.count
             }
             if (v['Responsible Group'] == 'EPS - Cognos') {
             measureObject.cognos = v.count
             }
             if (v['Responsible Group'] == 'EPS - Infra') {
             measureObject.infra = v.count
             }
             if (v['Responsible Group'] == 'Desktop Virtualisation 2nd line') {
             measureObject.desktopVirtualisatie = v.count
             }
             if (v['Responsible Group'] == "EPS - DWH") {
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


        returnSet.push(snapshotObject)
        //Tickets created total
        var mTotCreatedTickets = [], mObjectTotCreatedTickets = {}
        snapshotDetails.forEach(function (v) {
            if (v.state == 'Classification') {
                mObjectTotCreatedTickets.count = v.count
                mObjectTotCreatedTickets.week = moment(v.creationDate,'YYYY-MM-DD').week()
                mObjectTotCreatedTickets.creationDate = v.creationDate
                mTotCreatedTickets.push(mObjectTotCreatedTickets)
            }
        })

        snapshotObject.mTotCreatedTickets = mTotCreatedTickets
        snapshotObject.totCreatedTickets = d3.nest()
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
    })

    //snapshotObject.totCreatedTickets = mTotCreatedTickets

    return returnSet
}