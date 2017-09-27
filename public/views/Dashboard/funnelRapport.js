/**
 * Created by erik on 9/12/17.
 */

function createfunnelRepport(ds, div, filter){
    console.info()
    var dataset = _.where(ds,filter)
    var columns = Object.keys(ds[0])
    var rows = []
    var row = []
    columns = _.without(columns, '_id'
                                , '', 'count'
                                , 'EPS - CPF_Count'
                                , 'aggGrain'
                                ,'Customer Reference'
                                ,'Reason for waiting'
                                ,'Planned Date / Time'
                                ,'Customer Free Text'
                                , 'EPS - Cognos_Count'
                                , 'EPS - SRL_Count'
                                , 'Responsible User'
    )
    var dataset2 = []
    console.info(columns)
    ds.forEach(function (r) {
        columns.forEach(function (c) {
        })

    })

    console.info('----------  DATASET --------------------')
    console.info(dataset[0])

    dataset.forEach(function (r) {
        var keys = Object.keys(r)
        // (1) Loop trhoug keys of the rows from the dataset
        keys.forEach(function (k) {
            // (a) Loop throug the columns
            columns.forEach(function (c) {
                // (c) Compare the keys with the columsn if matched then add to row
                if (k == c){
                    row.push(r[k].toString())
                }

            })
        })
        //console.info(row)
        rows.push(row)
        row = []
    })

    console.info('-------------------  ROWS ---------------')
    console.info(rows)
    var dataNew = new google.visualization.DataTable()

    columns.forEach(function (c) {
        dataNew.addColumn('string', c)
    })

    dataNew.addRows(rows)
    var table = new google.visualization.Table(document.getElementById('ticketsList'));

    table.draw(dataNew, {showRowNumber: true, width: '100%', height: '100%'});


}

// Tickets per User
//google.charts.setOnLoadCallback(ticketsPerUser);
function ticketsPerUser(ds) {
    console.info('Start tickets created per enduser')
    console.info(ds)
    // (A)Define column headers
    var dataNew = new google.visualization.DataTable()
    dataNew.addColumn('string', 'User');
    dataNew.addColumn('number', 'Tickets');


    // (2.A)Define table rows
    var rowsSolved = []

    //(2.B) Group ds on Last Change
    ds.forEach(function (r) {
        rowsSolved.push([r.user, r.countTickets])
    })

    dataNew.addRows(rowsSolved)

    //(3) Set graph options
    var options = {
        title: 'Tickets created per User',
        hAxis: {
            title: 'User'
        },
        vAxis: {
            title: 'Tickets'
        },
        width:550,
        height:300,
    };

    //(4) Draw Graph
    var chart = new google.visualization.ColumnChart(
        document.getElementById('ticketsPerUser'));
    chart.draw(dataNew, options);
}



