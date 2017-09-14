// Initialize modules
google.charts.setOnLoadCallback(d3GraphPlot);
function d3GraphPlot(div, ds) {

    var   allCols = Object.keys(ds[0].value)
        , tableCols = []
        , tableData = []
        , curentDate = moment().toISOString()
        , currentWeek = moment(curentDate,"YYYY-MM-DD").week()
        , setTable = []


    tableCols.push('Weeknumber')
    tableData.push(currentWeek -1)

    allCols.forEach(function (row) {
        if(ds[0].value[row] > 0){
            tableCols.push(row)
            tableData.push(ds[0].value[row])
        }
    })
    setTable.push(tableCols)
    setTable.push(tableData)

    var data = google.visualization.arrayToDataTable(setTable)


    var options = {
        chart: {
            title: 'Total actual tickets',
            subtitle: 'Europool System BI & DM team',
        },
        width:550,
        height:300,
    };

    var chart = new google.charts.Bar(document.getElementById('ticketChart2'));
    chart.draw(data, google.charts.Bar.convertOptions(options));

    //var chart = new google.visualization.ColumnChart(document.getElementById('ticketChart2'));
    //chart.draw(data, options)
}






