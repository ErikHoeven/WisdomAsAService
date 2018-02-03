/**
 * Created by erik on 2/3/18.
 */
var  request = require("request")
    ,async = require('async')
    ,mongo = require('mongodb')
    ,d3 = require('d3')
    ,uri = 'mongodb://localhost:27017/commevents'
    ,moment = require('moment')
    ,underscore = require('underscore')
    ,locals = {}

exports.getSnapshot = function (req, res, next) {
    var actualYear = moment().year()
    mongo.connect(uri, function (err, db) {
        console.info('MONGODB START CHECK COLLECTIONS')
        var tasks = [  // Load stgOmniTracker
            function (callback) {
                db.collection('stgOmniTracker').find({$and: [{creationYear: actualYear}, {creationWeek: {$gte: 2}}]}).toArray(function (err, tickets) {
                    if (err) return callback(err);
                    locals.tickets = tickets;
                    callback();
                });
            }
        ];

        async.parallel(tasks, function (err) {
            if (err) return next(err);
            var tickets = locals.tickets, snapshotList = [], actSnapshot, cleanList = []
            db.close()

            tickets.forEach(function (v) {
                snapshotList.push(moment(v.snapshotDate,"DD-MM-YYYY").format("DD-MM-YYYY"))
            })

            //snapshotList.push(moment().format("DD-MM-YYYY"))
            snapshotList =  snapshotList.filter( onlyUnique )

            snapshotList.forEach(function (d) {
                cleanList.push(moment(d,"DD-MM-YYYY").toDate())
            })

            console.info(getMax(cleanList,"NA"))

            res.status(200).json({ snapshot: getMax(cleanList,"NA"), snapshotlist: snapshotList})

        })
    })
}



function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function getMax(dateArray, filler) {
    filler= filler?filler:"";
    if (!dateArray.length) {
        return filler;
    }
    var max = "";
    dateArray.forEach(function(date) {
        if (date) {
            var d = new Date(date);
            if (max && d.valueOf()>max.valueOf()) {
                max = d;
            } else if (!max) {
                max = d;
            }
        }
    });
    return max;
};