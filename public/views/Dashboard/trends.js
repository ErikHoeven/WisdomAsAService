// (1) --- ticketSRL -------------------------------------------------------------------------------------------------------------
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
        document.getElementById('ticketsSRL'));

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
        document.getElementById('ticketsCPF'));

    chart.draw(data, options);
}


// (7) --- ticketsCreatedCognos -------------------------------------------------------------------------------------------------------------
//google.charts.setOnLoadCallback(ticketsCreatedCognos);
function ticketsCognos(ds) {
    console.info('Start ticketsCreatedCognos')

    var data = new google.visualization.DataTable()
    data.addColumn('number', 'Weeknumber');
    data.addColumn('number', 'TicketsCreated');
    data.addColumn('number', 'TicketsClosed');
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
        width:1000,
        height:500,
    };

    var chart = new google.visualization.ColumnChart(
        document.getElementById('ticketsCognos'));

    chart.draw(data, options);
}

// (8) --- ticketsSolvedCognos -------------------------------------------------------------------------------------------------------------
//google.charts.setOnLoadCallback(ticketsSolvedCognos);
function ticketsDWH(ds){
    console.info('Start ticketsSolvedPerWeek DWH')
    console.info(ds.Data)
    // (A)Define column headers
    var dataNew = new google.visualization.DataTable()
    dataNew.addColumn('number', 'Weeknumber');
    dataNew.addColumn('number', 'TicketsCreated');
    dataNew.addColumn('number', 'TicketsClosed');
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
        width:1000,
        height:500,
    };

    //(4) Draw Graph
    var chart = new google.visualization.ColumnChart(
        document.getElementById('ticketsDWH'));
    chart.draw(dataNew, options);
}


function ticketsESOFT(ds) {
    console.info('Start ticketsSolvedPerWeek ESOFT')
    console.info(ds.Data)
    // (A)Define column headers
    var dataNew = new google.visualization.DataTable()
    dataNew.addColumn('number', 'Weeknumber');
    dataNew.addColumn('number', 'TicketsCreated');
    dataNew.addColumn('number', 'TicketsClosed');
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
        width: 1000,
        height: 500,
    };

    //(4) Draw Graph
    var chart = new google.visualization.ColumnChart(
        document.getElementById('ticketsESOFT'));
}