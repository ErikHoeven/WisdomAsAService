/**
 * Created by erik on 8/27/17.
 */
function plotGraph (div, ds) {
    console.info('plotGraph...')
// ------------------Data ---------------------------------------------------
    var label = moment(ds[0].key).format('YYYY-MM-DD')
        , rest = ds[0].value
        ,labels = Object.keys(rest)
        , dsArray = []
    labels.forEach(function (label) {
        dsArray.push({label: label, y: ds[0].value[label]})
    })

// ------------------Build Grapph ---------------------------------------------------
    var chart = new CanvasJS.Chart(div, {
        theme: "theme2",//theme1
        title:{
            text: "Tickets per Group"
        },
        animationEnabled: true,   // change to true
        data: [
            {
                // Change type to "bar", "area", "spline", "pie",etc.
                type: "column",
                dataPoints: dsArray
            }
        ]
    });
    chart.render();

}


// Initialize modules
google.charts.load('current', {packages: ['corechart', 'bar', 'table']});
// (1) --- ticketsCreatedPerWeek -------------------------------------------------------------------------------------------------------------
google.charts.setOnLoadCallback(d3GraphPlot);
function d3GraphPlot(div, ds) {

    console.info('d3 opnieuw with Google')

    var   allCols = Object.keys(ds[0].value)
        , tableCols = []
        , tableData = []
        ,  data = new google.visualization.DataTable()
        , curentDate = moment().toISOString()
        , currentWeek = moment(curentDate,"YYYY-MM-DD").week()

    data.addColumn('number', 'Weeknumber')
    tableData.push(currentWeek -1)

    allCols.forEach(function (row) {
        if(ds[0].value[row] > 0){
            tableCols.push(row)
            tableData.push(ds[0].value[row])
        }
    })

    console.info(tableCols)
    console.info(tableData)


    tableCols.forEach(function (row) {
        data.addColumn('number', row)
    })

    data.addRows([tableData])

    var options = {
        title: 'Tickets actual',
        hAxis: {
            title: 'Weeknumber'
        },
        vAxis: {
            title: 'Tickets'
        },
        width:500,
        height:400,
    };

    var chart = new google.charts.Bar(document.getElementById(div));
    chart.draw(data, options);





}
