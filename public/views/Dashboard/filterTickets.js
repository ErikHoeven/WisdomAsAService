/**
 * Created by erik on 9/12/17.
 */
function filterTickets(value, dataset) {
    var returnArray = [], returnObject = {}
    if (value != 'All'){
        returnArray = _.where(dataset,{Group: value})

        var countsPerDay = d3.nest()
            .key(function (d) {
                return d.snapshotDate
            })
            .rollup(function (v) {
                return {
                    'cpf': d3.sum(v, function (d) {
                        return d['cpf']
                    }),
                    'esoft': d3.sum(v, function (d) {
                        return d['esoft'];
                    }),
                    'firstLine': d3.sum(v, function (d) {
                        return d['firstLine'];
                    }),
                    'infra': d3.sum(v, function (d) {
                        return d['infra'];
                    }),
                    'secondLineApps': d3.sum(v, function (d) {
                        return d['secondLineApps'];
                    }),
                    'cognos': d3.sum(v, function (d) {
                        return d['cognos'];
                    }),
                    'desktopVirtualisatie': d3.sum(v, function (d) {
                        return d['desktopVirtualisatie'];
                    }),
                    'srl': d3.sum(v, function (d) {
                        return d['srl'];
                    }),
                };
            })
            .entries(dataset)

    }
    else{
        returnArray = dataset

        console.info('returnArray')

        var countsPerDay = d3.nest()
            .key(function (d) {
                return d.snapshotDate
            })
            .rollup(function (v) {
                return {
                    'cpf': d3.sum(v, function (d) {
                        return d['cpf']
                    }),
                    'esoft': d3.sum(v, function (d) {
                        return d['esoft'];
                    }),
                    'firstLine': d3.sum(v, function (d) {
                        return d['firstLine'];
                    }),
                    'infra': d3.sum(v, function (d) {
                        return d['infra'];
                    }),
                    'secondLineApps': d3.sum(v, function (d) {
                        return d['secondLineApps'];
                    }),
                    'infra': d3.sum(v, function (d) {
                        return d['infra'];
                    }),
                    'cognos': d3.sum(v, function (d) {
                        return d['cognos'];
                    }),
                    'desktopVirtualisatie': d3.sum(v, function (d) {
                        return d['desktopVirtualisatie'];
                    }),
                    'srl': d3.sum(v, function (d) {
                        return d['srl'];
                    }),
                };
            })
            .entries(returnArray)
        var labels = Object.keys(countsPerDay[0].value)
            ,labelData = []
        labels.forEach(function (label) {
            labelData.push(countsPerDay[0].value[label])
        })
    }

    var aggCountsPerDayCattegory = returnArray
    console.info('aggCountsPerDayCattegory')
    console.info(aggCountsPerDayCattegory)

    var countsPerDayCattegory = d3.nest()
        .key(function (d) {
            return d.snapshotDate
        })
        .rollup(function (v) {
            return {
                countCreatedTickets: d3.sum(v, function (d) {
                    return d.countCreatedTickets;
                }),
                countOpenTickets: d3.sum(v, function (d) {
                    return d.countOpenTickets;
                }),
                countSolvedTickets: d3.sum(v, function (d) {
                    return d.countSolvedTickets;
                }),
            };
        })
        .entries(aggCountsPerDayCattegory)

    console.info(countsPerDayCattegory)

    var createdTickets = countsPerDayCattegory[countsPerDayCattegory.length-1].value.countCreatedTickets,
        openTickets = countsPerDayCattegory[countsPerDayCattegory.length-1].value.countOpenTickets,
        solvedTickets = countsPerDayCattegory[countsPerDayCattegory.length-1].value.countSolvedTickets


    returnArray.forEach(function (r) {
        var d = moment(r.CreationDate).format('DD-MM-YYYY')
        r.CreationDate = d
    })

    returnObject.createdTickets = createdTickets
    returnObject.openTickets = openTickets
    returnObject.solvedTickets = solvedTickets
    returnObject.fltrData = returnArray
    returnObject.countPerDay = countsPerDay

    console.info('returnObject')
    console.info(aggCountsPerDayCattegory)
    return returnObject
}