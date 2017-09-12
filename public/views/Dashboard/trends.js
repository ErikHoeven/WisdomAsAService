/**
 * Created by erik on 9/5/17.
 */
// Initialize modules
//google.charts.load('current', {packages: ['corechart', 'bar', 'table']});

// (1) --- ticketsCreatedPerWeek -------------------------------------------------------------------------------------------------------------
google.charts.setOnLoadCallback(ticketsCreatedPerWeek);
function ticketsCreatedPerWeek(ds) {
    console.info('ticketsCreatedPerWeek')
    //Define column headers

    var data = new google.visualization.DataTable()
    data.addColumn('number', 'Weeknumber');
    data.addColumn('number', 'Tickets');

    ////Define table rows
    var tableRows = []
    var countsPerWeek = d3.nest()
        .key(function (d) {
            return moment(d.CreationDate,"DD-MM-YYYY").week()
        })
        .rollup(function (v) {
            return {
                'TicketsCreated': d3.sum(v, function (d) {
                    return d['count']
                }),
            };
        })
        .entries(ds);


    countsPerWeek.forEach(function (r) {
        tableRows.push([Number(r.key),r.value.TicketsCreated])
    })
    //Sort table rows
    var tableRows = tableRows.sort(Comparator)

    console.info(tableRows)
    data.addRows(tableRows)

    var options = {
        title: 'Tickets created per week',
        hAxis: {
            title: 'Weeknumber'
        },
        vAxis: {
            title: 'Tickets'
        },
        trendlines: {
            0: {
                type: 'polynomial',
                degree: 3,
                visibleInLegend: true,
                pointSize: 20, // Set the size of the trendline dots.
                opacity: 0.1
            }
        },
        width:550,
        height:300,
    };


    var chart = new google.visualization.ColumnChart(
        document.getElementById('ticketsCreatedPerWeek'));

    chart.draw(data, options);


}
// (2) --- ticketsSolvedPerWeek -------------------------------------------------------------------------------------------------------------
google.charts.setOnLoadCallback(ticketsSolvedPerWeek);
function ticketsSolvedPerWeek(ds) {
    console.info('Start ticketsSolvedPerWeek')

    //(A) Format DATE & TIME to DATE
    ds.forEach(function (row) {
        row['Last Change'] = moment(row['Last Change'],'DD/MM/YYYY').format('DD/MM/YYYY')
    })

    //(B) Format DATE to Week
    ds.forEach(function (row) {
        row['Last Change'] = moment(row['Last Change'],'DD/MM/YYYY').week()
    })

    //(C) Filter tickets to only Solved
    ds = _.where(ds,{'State':'Solved'})

    // (1)Define column headers
    var dataNew = new google.visualization.DataTable()
    dataNew.addColumn('number', 'Weeknumber');
    dataNew.addColumn('number', 'Tickets');

    // (2.A)Define table rows
    var rowsSolved = []

    //(2.B) Group ds on Last Change
       var countsPerWeek = d3.nest()
            .key(function (d) {
                return d['Last Change']
            })
            .rollup(function (v) {
                return {
                    'TicketsSolved': d3.sum(v, function (d) {
                        return d['count']
                    }),
                };
            })
            .entries(ds);

    //(2.C) Convert char weeknumber to number
    countsPerWeek.forEach(function (r) {
        rowsSolved.push([Number(r.key),Number(r.value.TicketsSolved)])
    })


    //console.info(rowsSolved)
    //(2.D) Sort table rows
    var rowsSolvedSorted = rowsSolved.sort(Comparator)
    // (2.E) Add table rows to table
    dataNew.addRows(rowsSolvedSorted)

    //(3) Set graph options
    var options = {
        title: 'Tickets Solved per week',
        hAxis: {
            title: 'Weeknumber'
        },
        vAxis: {
            title: 'Tickets'
        },
        trendlines: {
            0: {
                type: 'polynomial',
                degree: 3,
                visibleInLegend: true,
                pointSize: 20, // Set the size of the trendline dots.
                opacity: 0.1
            }
        },
        width:550,
        height:300,
    };

    //(4) Draw Graph
    var chart = new google.visualization.ColumnChart(
        document.getElementById('ticketsSolvedPerWeek'));

    chart.draw(dataNew, options);

}

// (3) --- ticketsCreatedSRL -------------------------------------------------------------------------------------------------------------
google.charts.setOnLoadCallback(ticketsCreatedSRL);
function ticketsCreatedSRL(ds) {
    console.info('Start ticketsCreatedSRL')

    var data = new google.visualization.DataTable()
    data.addColumn('number', 'Weeknumber');
    data.addColumn('number', 'Tickets');

    //(A) Filter tickets to only for SRL
    ds = _.where(ds,{'Group':'EPS - SRL'})


    console.info(ds)

    var tableRows = []
    var countsPerWeek = d3.nest()
        .key(function (d) {
            return moment(d.CreationDate,"DD-MM-YYYY").week()
        })
        .rollup(function (v) {
            return {
                'TicketsCreatedSRL': d3.sum(v, function (d) {
                    return d['count']
                }),
            };
        })
        .entries(ds);

    countsPerWeek.forEach(function (r) {
        tableRows.push([Number(r.key),r.value.TicketsCreatedSRL])
    })
    //Sort table rows
    var tableRows = tableRows.sort(Comparator)

    console.info(tableRows)
    data.addRows(tableRows)
    console.info('Data Added')


    var options = {
        title: 'Tickets created per week SRL',
        hAxis: {
            title: 'Weeknumber'
        },
        vAxis: {
            title: 'Tickets'
        },
        trendlines: {
            0: {
                type: 'polynomial',
                degree: 3,
                visibleInLegend: true,
                pointSize: 20, // Set the size of the trendline dots.
                opacity: 0.1
            }
        },
        width:550,
        height:300,
    };
    console.info('options is set')

    var chart = new google.visualization.ColumnChart(
        document.getElementById('ticketsCreatedSRL'));

    chart.draw(data, options);

}

// (4) --- ticketsSolvedSRL -------------------------------------------------------------------------------------------------------------
google.charts.setOnLoadCallback(ticketsSolvedSRL);
function ticketsSolvedSRL(ds){
    console.info('Start ticketsSolvedPerWeek SRL')
    // (A)Define column headers
    var dataNew = new google.visualization.DataTable()
    dataNew.addColumn('number', 'Weeknumber');
    dataNew.addColumn('number', 'Tickets');


    //(D) Filter tickets to only Solved
    ds = _.where(ds,{'State':'Solved'})
    ds = _.where(ds,{'Responsible Group':'EPS - SRL'})

    console.info(ds)
    // (2.A)Define table rows
    var rowsSolved = []

    //(2.B) Group ds on Last Change
    var countsPerWeek = d3.nest()
        .key(function (d) {
            return d['Last Change']
        })
        .rollup(function (v) {
            return {
                'TicketsSolved': d3.sum(v, function (d) {
                    return d['count']
                }),
            };
        })
        .entries(ds);

    console.info(countsPerWeek)
    //(2.C) Convert char weeknumber to number
    countsPerWeek.forEach(function (r) {
        rowsSolved.push([Number(r.key),Number(r.value.TicketsSolved)])
    })

    //(2.D) Sort table rows
    var rowsSolvedSorted = rowsSolved.sort(Comparator)
    // (2.E) Add table rows to table
    dataNew.addRows(rowsSolvedSorted)
    console.info(rowsSolvedSorted)
    //(3) Set graph options
    var options = {
        title: 'Tickets Solved per week SRL',
        hAxis: {
            title: 'Weeknumber'
        },
        vAxis: {
            title: 'Tickets'
        },
        trendlines: {
            0: {
                type: 'polynomial',
                degree: 3,
                visibleInLegend: true,
                pointSize: 20, // Set the size of the trendline dots.
                opacity: 0.1
            }
        },
        width:550,
        height:300,
    };

    //(4) Draw Graph
    var chart = new google.visualization.ColumnChart(
        document.getElementById('ticketsSolvedSRL'));

    chart.draw(dataNew, options);
}

// (5) --- ticketsCreatedCPF -------------------------------------------------------------------------------------------------------------
google.charts.setOnLoadCallback(ticketsCreatedCPF);
function ticketsCreatedCPF(ds) {
    console.info('Start ticketsCreatedCPF')

    var data = new google.visualization.DataTable()
    data.addColumn('number', 'Weeknumber');
    data.addColumn('number', 'Tickets');

    //(A) Filter tickets to only for SRL
    ds = _.where(ds,{'Group':'EPS - CPF'})


    console.info(ds)

    var tableRows = []
    var countsPerWeek = d3.nest()
        .key(function (d) {
            return moment(d.CreationDate,"DD-MM-YYYY").week()
        })
        .rollup(function (v) {
            return {
                'TicketsCreatedCPF': d3.sum(v, function (d) {
                    return d['count']
                }),
            };
        })
        .entries(ds);

    countsPerWeek.forEach(function (r) {
        tableRows.push([Number(r.key),r.value.TicketsCreatedCPF])
    })
    //Sort table rows
    var tableRows = tableRows.sort(Comparator)

    console.info(tableRows)
    data.addRows(tableRows)
    console.info('Data Added')


    var options = {
        title: 'Tickets created per week CPF',
        hAxis: {
            title: 'Weeknumber'
        },
        vAxis: {
            title: 'Tickets'
        },
        trendlines: {
            0: {
                type: 'polynomial',
                degree: 3,
                visibleInLegend: true,
                pointSize: 20, // Set the size of the trendline dots.
                opacity: 0.1
            }
        },
        width:550,
        height:300,
    };
    console.info('options is set')

    var chart = new google.visualization.ColumnChart(
        document.getElementById('ticketsCreatedCPF'));

    chart.draw(data, options);
}

// (6) --- ticketsSolvedCPF -------------------------------------------------------------------------------------------------------------
google.charts.setOnLoadCallback(ticketsSolvedCPF);
function ticketsSolvedCPF(ds){
    console.info('Start ticketsSolvedPerWeek CPF')
    // (A)Define column headers
    var dataNew = new google.visualization.DataTable()
    dataNew.addColumn('number', 'Weeknumber');
    dataNew.addColumn('number', 'Tickets');


    //(D) Filter tickets to only Solved
    ds = _.where(ds,{'State':'Solved'})
    ds = _.where(ds,{'Responsible Group':'EPS - CPF'})

    console.info(ds)
    // (2.A)Define table rows
    var rowsSolved = []

    //(2.B) Group ds on Last Change
    var countsPerWeek = d3.nest()
        .key(function (d) {
            return d['Last Change']
        })
        .rollup(function (v) {
            return {
                'TicketsSolved': d3.sum(v, function (d) {
                    return d['count']
                }),
            };
        })
        .entries(ds);

    console.info(countsPerWeek)
    //(2.C) Convert char weeknumber to number
    countsPerWeek.forEach(function (r) {
        rowsSolved.push([Number(r.key),Number(r.value.TicketsSolved)])
    })

    //(2.D) Sort table rows
    var rowsSolvedSorted = rowsSolved.sort(Comparator)
    // (2.E) Add table rows to table
    dataNew.addRows(rowsSolvedSorted)
    console.info(rowsSolvedSorted)
    //(3) Set graph options
    var options = {
        title: 'Tickets Solved per week CPF',
        hAxis: {
            title: 'Weeknumber'
        },
        vAxis: {
            title: 'Tickets'
        },
        trendlines: {
            0: {
                type: 'polynomial',
                degree: 3,
                visibleInLegend: true,
                pointSize: 20, // Set the size of the trendline dots.
                opacity: 0.1
            }
        },
        width:550,
        height:300,
    };

    //(4) Draw Graph
    var chart = new google.visualization.ColumnChart(
        document.getElementById('ticketsSolvedCPF'));
    chart.draw(dataNew, options);
}

// (7) --- ticketsCreatedCognos -------------------------------------------------------------------------------------------------------------
google.charts.setOnLoadCallback(ticketsCreatedCognos);
function ticketsCreatedCognos(ds) {
    console.info('Start ticketsCreatedCognos')

    var data = new google.visualization.DataTable()
    data.addColumn('number', 'Weeknumber');
    data.addColumn('number', 'Tickets');

    //(A) Filter tickets to only for SRL
    ds = _.where(ds,{'Group':'EPS - Cognos'})


    console.info(ds)

    var tableRows = []
    var countsPerWeek = d3.nest()
        .key(function (d) {
            return moment(d.CreationDate,"DD-MM-YYYY").week()
        })
        .rollup(function (v) {
            return {
                'ticketsCreatedCognos': d3.sum(v, function (d) {
                    return d['count']
                }),
            };
        })
        .entries(ds);
    console.info(countsPerWeek)
    countsPerWeek.forEach(function (r) {
        tableRows.push([Number(r.key),r.value.ticketsCreatedCognos])
    })
    //Sort table rows
    var tableRows = tableRows.sort(Comparator)

    console.info(tableRows)
    data.addRows(tableRows)
    console.info('Data Added')


    var options = {
        title: 'Tickets created per week Cognos',
        hAxis: {
            title: 'Weeknumber'
        },
        vAxis: {
            title: 'Tickets'
        },
        trendlines: {
            0: {
                type: 'polynomial',
                degree: 3,
                visibleInLegend: true,
                pointSize: 20, // Set the size of the trendline dots.
                opacity: 0.1
            }
        },
        width:550,
        height:300,
    };
    console.info('options is set')

    var chart = new google.visualization.ColumnChart(
        document.getElementById('ticketsCreatedCognos'));

    chart.draw(data, options);
}

// (8) --- ticketsSolvedCognos -------------------------------------------------------------------------------------------------------------
google.charts.setOnLoadCallback(ticketsSolvedCognos);
function ticketsSolvedCognos(ds){
    console.info('Start ticketsSolvedPerWeek Cognos')
    // (A)Define column headers
    var dataNew = new google.visualization.DataTable()
    dataNew.addColumn('number', 'Weeknumber');
    dataNew.addColumn('number', 'Tickets');


    //(D) Filter tickets to only Solved
    ds = _.where(ds,{'State':'Solved'})
    ds = _.where(ds,{'Responsible Group':'EPS - Cognos'})

    console.info(ds)
    // (2.A)Define table rows
    var rowsSolved = []

    //(2.B) Group ds on Last Change
    var countsPerWeek = d3.nest()
        .key(function (d) {
            return d['Last Change']
        })
        .rollup(function (v) {
            return {
                'TicketsSolved': d3.sum(v, function (d) {
                    return d['count']
                }),
            };
        })
        .entries(ds);

    console.info(countsPerWeek)
    //(2.C) Convert char weeknumber to number
    countsPerWeek.forEach(function (r) {
        rowsSolved.push([Number(r.key),Number(r.value.TicketsSolved)])
    })

    //(2.D) Sort table rows
    var rowsSolvedSorted = rowsSolved.sort(Comparator)
    // (2.E) Add table rows to table
    dataNew.addRows(rowsSolvedSorted)
    console.info(rowsSolvedSorted)
    //(3) Set graph options
    var options = {
        title: 'Tickets Solved per week Cognos',
        hAxis: {
            title: 'Weeknumber'
        },
        vAxis: {
            title: 'Tickets'
        },
        trendlines: {
            0: {
                type: 'polynomial',
                degree: 3,
                visibleInLegend: true,
                pointSize: 20, // Set the size of the trendline dots.
                opacity: 0.1
            }
        },
        width:550,
        height:300,
    };

    //(4) Draw Graph
    var chart = new google.visualization.ColumnChart(
        document.getElementById('ticketsSolvedCognos'));
    chart.draw(dataNew, options);
}



function Comparator(a, b) {
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
}