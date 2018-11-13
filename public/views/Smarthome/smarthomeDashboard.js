function setUserProfile(user) {
    console.info('setUserProfile')
    var url = user.profilePictureURI, username = user.username
    if (!url) {
        console.info('User unknown')
        url = '/images/users/img2.jpg'
    }

    $('#userProfile').append('' +
        '<div class="widget user-view-style-2">' +
        '<div class="widget-wrapper">' +
        '<div class="widget-content">' +
        '<div class="text-center user-profile bg-white">' +
        '<div class="header-cover bg-green">' +
        '</div>' +
        '<div class="user-profile-inner padding-top-17">' +
        '<img src="'+ url +'" class="img-circle profile-avatar" data-pin-nopin="true" height="100" width="175">' +
        '<h3  id="blockTitle" class="fg-gray font-bold"></h3></div></div></div></div></div>')
}


function getMeterstanden() {
    console.info('haal meterstanden op')
    $.ajax({
        url: '/smarthome/getMeterStanden',
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            console.info('succes getMeterStanden')

            console.info(data.LaatsteStandenPerDag)
            var standPerWeekArray = []
            var standenPerDag = []
            var standPerNewWeekArray = []

            if( Array.isArray(data.LaatsteStandenPerDag) == true){
                for (var i = 0; i < data.LaatsteStandenPerDag.length; i++){
                    standenPerDag = []
                    standenPerDag.push(Number(data.LaatsteStandenPerDag[i]._id.DagNummerVanMaand))
                    standenPerDag.push(Number(data.LaatsteStandenPerDag[i].LaatsteDagStandPiek))
                    standenPerDag.push(Number(data.LaatsteStandenPerDag[i].LaatsteDagStandPiekTerug))
                    standenPerDag.push(Number(data.LaatsteStandenPerDag[i].LaatsteDagStandDal))
                    standenPerDag.push(Number(data.LaatsteStandenPerDag[i].LaatsteDagStandDalTerug))
                    standPerWeekArray.push(standenPerDag)
                }
            }


            console.info(standPerWeekArray)
            GrafiekStandenPerWeek(standPerWeekArray)
        }})
}


function GrafiekStandenPerWeek(ds) {

    var data = new google.visualization.DataTable()
    data.addColumn('number', 'Dagnummer');
    data.addColumn('number', 'Piek');
    data.addColumn('number', 'PiekTerug');
    data.addColumn('number', 'Dal');
    data.addColumn('number', 'DalTerug');


    data.addRows(ds)

    var options = {
        title: 'Stroomverbruik per Week',
        hAxis: {
            title: 'Dagnummer',
            ticks: data.getDistinctValues(0)
        },
        vAxis: {
            title: 'KWH',
            minValue: 0,
            ticks: [0, 2, 2, 4, 6, 8, 10, 12, 14, 16, 18]
        },
        width:600,
        height:600,
    };
    var chart = new google.visualization.ColumnChart(
        document.getElementById('ticketChart2'));

    chart.draw(data, options);

    // Add our selection handler.
    google.visualization.events.addListener(chart, 'select', selectHandler);


    function selectHandler() {
        var selection = table.getSelection();
        var message = '';
        for (var i = 0; i < selection.length; i++) {
            var item = selection[i];
            if (item.row != null && item.column != null) {
                var str = data.getFormattedValue(item.row, item.column);
                message += '{row:' + item.row + ',column:' + item.column + '} = ' + str + '\n';
            } else if (item.row != null) {
                var str = data.getFormattedValue(item.row, 0);
                message += '{row:' + item.row + ', column:none}; value (col 0) = ' + str + '\n';
            } else if (item.column != null) {
                var str = data.getFormattedValue(0, item.column);
                message += '{row:none, column:' + item.column + '}; value (row 0) = ' + str + '\n';
            }
        }
        if (message == '') {
            message = 'nothing';
        }
        alert('You selected ' + message);
    }

}