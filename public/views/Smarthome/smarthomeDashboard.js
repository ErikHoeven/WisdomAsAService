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


function getMeterstanden(week, dag, col) {
    console.info('haal meterstanden op')

    if (dag == null || !dag)
    {
    $.ajax({
        url: '/smarthome/getMeterStanden',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({weekvanjaar: week-1}),
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
                    standenPerDag.push(Number(data.LaatsteStandenPerDag[i].LaatsteDagStandPiek) / 1000)
                    standenPerDag.push(Number(data.LaatsteStandenPerDag[i].LaatsteDagStandPiekTerug) / 1000)
                    standenPerDag.push(Number(data.LaatsteStandenPerDag[i].LaatsteDagStandDal) / 1000)
                    standenPerDag.push(Number(data.LaatsteStandenPerDag[i].LaatsteDagStandDalTerug) / 1000)
                    standPerWeekArray.push(standenPerDag)
                }
            }


            console.info(standPerWeekArray)
            GrafiekStandenPerWeek(standPerWeekArray)
        }})
    }
    else{
        $.ajax({
            url: '/smarthome/getMeterStandenDagVerloop',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({dagvanMaand: dag}),
            success: function (data) {
                console.info('succes getMeterStandenPerUur')
                console.info(data)
                GrafiekStandenPerUur(data,col)

            }})
    }
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
            title: 'KWH * 1000',
            minValue: 0
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
        var selection = chart.getSelection();
        var message = '';

        console.info(selection)
        for (var i = 0; i < selection.length; i++) {
            var item = selection[i];
            if (item.row != null && item.column != null) {
                var str = data.getFormattedValue(item.row, item.column);
                var strNew = data.getFormattedValue(item.row, 0);
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
        console.info(message)
        console.info(strNew)
        console.info(item.column)
        getMeterstanden(null,strNew,item.column)
    }
}

function GrafiekStandenPerUur(ds,col) {
    console.info('GrafiekStandenPerUur')
    console.info('ColumnNr: ' + col)
    var data = new google.visualization.DataTable()
    var dataset =  ds.LaatsteUurStand
    var standPerUurArray = []
    var standenPerUur = []

    if(col == 4) {
        data.addColumn('number', 'Uur');
        data.addColumn('number', 'DalTerug');

        if (Array.isArray(dataset) == true) {
            for (var i = 0; i < dataset.length; i++) {
                standenPerUur = []
                standenPerUur.push(Number(dataset[i]._id.UurvanDag))
                standenPerUur.push(Number(dataset[i].LaatsteUurStandDalTerug) / 1000)
                standPerUurArray.push(standenPerUur)
            }
        }
    }

    if(col == 3) {
        data.addColumn('number', 'Uur');
        data.addColumn('number', 'Dal');

        if (Array.isArray(dataset) == true) {
            for (var i = 0; i < dataset.length; i++) {
                standenPerUur = []
                standenPerUur.push(Number(dataset[i]._id.UurvanDag))
                standenPerUur.push(Number(dataset[i].LaatsteUurStandDal)/ 1000)
                standPerUurArray.push(standenPerUur)
            }
        }
    }

    if(col == 2) {
        data.addColumn('number', 'Uur');
        data.addColumn('number', 'PiekTerug');
        var yas = [0,2, 4, 6, 8, 10, 12]
        var yasTitle = 'KWH +  5380'
        if (Array.isArray(dataset) == true) {
            for (var i = 0; i < dataset.length; i++) {
                standenPerUur = []
                standenPerUur.push(Number(dataset[i]._id.UurvanDag))
                standenPerUur.push(Number(dataset[i].LaatsteUurStabndPiekTerug) - 5380)
                standPerUurArray.push(standenPerUur)
            }
        }
    }
    if(col == 1) {

        data.addColumn('number', 'Uur');
        data.addColumn('number', 'Piek');
        var yas = [0,2, 4, 6, 8, 10, 12]
        var yasTitle = 'KWH +  9670'
        if (Array.isArray(dataset) == true) {
            for (var i = 0; i < dataset.length; i++) {
                standenPerUur = []
                standenPerUur.push(Number(dataset[i]._id.UurvanDag))
                standenPerUur.push(Number(dataset[i].LaatsteUurStandPiek)-9670)
                standPerUurArray.push(standenPerUur)
            }
        }
    }
    console.info(standPerUurArray)
    data.addRows(standPerUurArray)

    var options = {
        title: 'Stroomverbruik per Uur',
        hAxis: {
            title: 'Uur in de dag',
            ticks: data.getDistinctValues(0)
        },
        vAxis: {
            title: yasTitle,
            minValue: 0,
            ticks: yas
        },
        width:600,
        height:600,
    };
    var GraphStroomGebruikPerUur = new google.visualization.ColumnChart(
        document.getElementById('ticketChart'));

    GraphStroomGebruikPerUur.draw(data, options);
}

