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

            if( Array.isArray(data.LaatsteStandenPerDag) == true){
                console.info('Array')
                console.info(data.LaatsteStandenPerDag.length)
                for (var i = 0; i < data.LaatsteStandenPerDag.length; i++){

                    standenPerDag = []
                    standenPerDag.push(Number(data.LaatsteStandenPerDag[i]._id.DagNummerVanMaand))
                    standenPerDag.push( Number(data.LaatsteStandenPerDag[i].LaatsteDagStandPiek))
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
            ticks: [0, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000, 20000]
        },
        width:500,
        height:500,
    };
    var chart = new google.visualization.ColumnChart(
        document.getElementById('ticketChart2'));

    chart.draw(data, options);

}