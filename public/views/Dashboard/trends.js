
// (1) --- ticketsCreatedPerWeek -------------------------------------------------------------------------------------------------------------
//google.charts.setOnLoadCallback(ticketsCreatedPerWeek);
function ticketsPerWeek(ds) {
    //Define column headers

    var data = new google.visualization.DataTable()
    data.addColumn('number', 'Weeknumber');
    data.addColumn('number', 'TicketsCreated');
    data.addColumn('number', 'TicketsClosed');

    //Define table rows
    var tableRows = ds.Data

    data.addRows(tableRows)

    var options = {
        title: ds.title,
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
        width:1000,
        height:500,
    };


    var chart = new google.visualization.ColumnChart(
        document.getElementById('ticketsCreatedPerWeek'));

    chart.draw(data, options);


}


// (3) --- ticketSRL -------------------------------------------------------------------------------------------------------------
//google.charts.setOnLoadCallback(ticketsCreatedSRL);
function ticketsSRL(ds) {

    var data = new google.visualization.DataTable()
    data.addColumn('number', 'Weeknumber');
    data.addColumn('number', 'TicketsCreated');
    data.addColumn('number', 'TicketsClosed');
    data.addRows(ds.Data)

    var options = {
        title: ds.title,
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
        width:1000,
        height:500,
    };
    var chart = new google.visualization.ColumnChart(
        document.getElementById('ticketsCreatedSRL'));

    chart.draw(data, options);

}


// (5) --- ticketsCreatedCPF -------------------------------------------------------------------------------------------------------------
//google.charts.setOnLoadCallback(ticketsCreatedCPF);
function ticketsCPF(ds) {
    var data = new google.visualization.DataTable()
    data.addColumn('number', 'Weeknumber');
    data.addColumn('number', 'TicketsCreated');
    data.addColumn('number', 'TicketsClosed');
    data.addRows(ds.Data)

    var options = {
        title: ds.title,
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
        width:1000,
        height:500,
    };

    var chart = new google.visualization.ColumnChart(
        document.getElementById('ticketsCreatedCPF'));

    chart.draw(data, options);
}


// (7) --- ticketsCreatedCognos -------------------------------------------------------------------------------------------------------------
//google.charts.setOnLoadCallback(ticketsCreatedCognos);
function ticketsCreatedCognos(ds) {
    console.info('Start ticketsCreatedCognos')

    var data = new google.visualization.DataTable()
    data.addColumn('number', 'Weeknumber');
    data.addColumn('number', 'Tickets');
    data.addRows(ds.Data)
    console.info('Data Added')


    var options = {
        title: ds.title,
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
        document.getElementById('ticketsCreatedCognos'));

    chart.draw(data, options);
}

// (8) --- ticketsSolvedCognos -------------------------------------------------------------------------------------------------------------
//google.charts.setOnLoadCallback(ticketsSolvedCognos);
function ticketsSolvedCognos(ds){
    console.info('Start ticketsSolvedPerWeek Cognos')
    // (A)Define column headers
    var dataNew = new google.visualization.DataTable()
    dataNew.addColumn('number', 'Weeknumber');
    dataNew.addColumn('number', 'Tickets');
    dataNew.addRows(ds.Data)

    //(3) Set graph options
    var options = {
        title: ds.title,
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