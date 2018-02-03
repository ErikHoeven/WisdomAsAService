// Initialize modules
//google.charts.setOnLoadCallback(d3GraphPlot);
function d3GraphPlot(div, ds) {

    var   tableCols = []
        , tableData = []
        , curentDate = moment().toISOString()
        , currentWeek = moment(curentDate,"YYYY-MM-DD").week()
        , setTable = []



    //tableData.push(currentWeek -1)

 /*   allCols.forEach(function (row) {
        if(ds[0].value[row] > 0){
            tableCols.push(row)
            tableData.push(ds[0].value[row])
        }
    })*/

    setTable.push(ds.columns)
    setTable.push(ds.values)

    console.info('--------------setTable ----------------------')
    console.info(setTable)

    var data = google.visualization.arrayToDataTable(setTable)


    var options = {
        chart: {
            title: ds.title,
            subtitle: ds.underTitle,
        },
        width:550,
        height:300,
    };

    var chart = new google.charts.Bar(document.getElementById('ticketChart2'));
    chart.draw(data, google.charts.Bar.convertOptions(options));

    //var chart = new google.visualization.ColumnChart(document.getElementById('ticketChart2'));
    //chart.draw(data, options)
}






