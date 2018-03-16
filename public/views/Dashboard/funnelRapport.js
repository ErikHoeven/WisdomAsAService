/**
 * Created by erik on 9/12/17.
 */

function createfunnelRepportIncidents(ds, div, filter){
    filter.ticketType =  "Incident"
    console.info('createfunnelRepportIncidents')
    var dataset = _.where(ds,filter)
    var columns = Object.keys(ds[0])
    var rows = []
    var row = []
    console.info(filter)

    columns = _.without(columns,
        ''
        , 'IndCreated'
        , 'IndProgress'
        , 'IndSolved'
        , 'IndSpider'
        , 'IndStock'
        , 'ResponsibleUser'
        , 'count'
        , 'creationWeek'
        , 'lastChangeWeek'
        , 'lastChangeYear'
        , 'creationYear'
    )
    var dataset2 = []
    ds.forEach(function (r) {
        columns.forEach(function (c) {
        })
    })

    dataset.forEach(function (r) {
        var keys = Object.keys(r)
        // (1) Loop trhoug keys of the rows from the dataset
        keys.forEach(function (k) {
            // (a) Loop throug the columns
            columns.forEach(function (c) {
                // (c) Compare the keys with the columsn if matched then add to row
                if (k == c){

                    if (c = 'Creation Date'){
                        row.push(r[k].toString().substring(0,10))
                    }
                    else{
                        row.push(r[k].toString())
                    }
                }
            })
        })
        rows.push(row)
        row = []
    })


    rows = _.uniq(rows, function(x){
        return x[0];
    });

    var dataNew = new google.visualization.DataTable()

    columns.forEach(function (c) {
        dataNew.addColumn('string', c)
    })

    dataNew.addRows(rows)
    var table = new google.visualization.Table(document.getElementById('INCTicketList'));

    table.draw(dataNew, {showRowNumber: true, width: '100%', height: '100%'});
    $('#INCTicketListHeader').html('<h4>Incidents</h4>')

}

function createfunnelRepportSRQ(ds, div, filter){

    filter.ticketType =  "Service Request"
    var dataset = _.where(ds,filter)
    console.info(dataset)

    var columns = Object.keys(ds[0])
    var rows = []
    var row = []

    columns = _.without(columns
        , ''
        , 'IndCreated'
        , 'IndProgress'
        , 'IndSolved'
        , 'IndSpider'
        , 'IndStock'
        , 'ResponsibleUser'
        , 'count'
        , 'creationWeek'
        , 'lastChangeWeek'
        , 'lastChangeYear'
        , 'creationYear'
    )
    var dataset2 = []

    ds.forEach(function (r) {
        columns.forEach(function (c) {
        })
    })

    dataset.forEach(function (r) {
        var keys = Object.keys(r)
        // (1) Loop trhoug keys of the rows from the dataset
        keys.forEach(function (k) {
            // (a) Loop throug the columns
            columns.forEach(function (c) {
                // (c) Compare the keys with the columsn if matched then add to row
                if (k == c){
                    if (c = 'creationDate'){
                        row.push(r[k].toString().substring(0,10))
                    }
                    else{
                        row.push(r[k].toString())
                    }
                }
            })
        })
        rows.push(row)
        row = []
    })

    rows = _.uniq(rows, function(x){
        return x[0];
    });
    var dataNew = new google.visualization.DataTable()

    columns.forEach(function (c) {
        dataNew.addColumn('string', c)
    })

    dataNew.addRows(rows)

    var table = new google.visualization.Table(document.getElementById('SRQTicketList'));

    table.draw(dataNew, {showRowNumber: true, width: '100%', height: '100%'});
    $('#SRQTicketListHeader').html('<h4>Service Requests</h4>')

}

function createfunnelRepportChanges(ds, div, filter){
    console.info('createfunnelRepportChanges')
    filter.ticketType = "Change"
    console.info(ds)
    var dataset = _.where(ds,filter)
    console.info(dataset)

    var columns = Object.keys(ds[0])
    var rows = []
    var row = []

    columns = _.without(columns
        , ''
        , 'IndCreated'
        , 'IndProgress'
        , 'IndSolved'
        , 'IndSpider'
        , 'IndStock'
        , 'ResponsibleUser'
        , 'count'
        , 'creationWeek'
        , 'lastChangeWeek'
        , 'lastChangeYear'
        , 'creationYear'
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
                    if (c = 'creationDate'){
                        row.push(r[k].toString().substring(0,10))
                    }
                    else{
                        row.push(r[k].toString())
                    }
                }
            })
        })
        rows.push(row)
        row = []
    })

    rows = _.uniq(rows, function(x){
        return x[0];
    });
    console.info('-------------------  ROWS ---------------')
    console.info(rows)
    var dataNew = new google.visualization.DataTable()

    columns.forEach(function (c) {
        dataNew.addColumn('string', c)
    })

    dataNew.addRows(rows)

    var table = new google.visualization.Table(document.getElementById('ChangeTicketList'));

    table.draw(dataNew, {showRowNumber: true, width: '100%', height: '100%'});
    $('#ChangeTicketListHeader').html('<h4>Change Requests</h4>')

}



// Tickets per User
function ticketsPerUser(ds) {
    console.info('Start tickets created per enduser')
    console.info(ds)
    // (A)Define column headers
    var dataNew = new google.visualization.DataTable()
    dataNew.addColumn('string', 'User')
    dataNew.addColumn('number', 'amount of tickets')

    console.info(ds.Data)
    dataNew.addRows(ds.Data)

    //(3) Set graph options
    var options = {
        title: ds.title,
        hAxis: {
            title: 'User'
        },
        vAxis: {
            title: 'Tickets'
        },
        width:800,
        height:500,
    };


    //(4) Draw Graph
    var chart = new google.visualization.ColumnChart(
        document.getElementById('ticketsPerUser'));
    chart.draw(dataNew, options);
}


function ticketsPerReportingUser(ds) {
    console.info('Start tickets created per Reporting Person')
    console.info(ds)
    // (A)Define column headers
    var dataNew = new google.visualization.DataTable()
    dataNew.addColumn('string', 'User')
    dataNew.addColumn('number', 'amount of tickets')

    console.info(ds.Data)
    dataNew.addRows(ds.Data)

    //(3) Set graph options
    var options = {
        title: ds.title,
        hAxis: {
            title: 'User'
        },
        vAxis: {
            title: 'Tickets'
        },
        width:800,
        height:500,
    };


    //(4) Draw Graph
    var chart = new google.visualization.ColumnChart(
        document.getElementById('ticketsPerUser'));
    chart.draw(dataNew, options);
}
