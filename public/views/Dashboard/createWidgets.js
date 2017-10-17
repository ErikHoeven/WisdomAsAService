/**
 * Created by erik on 8/6/17.
 */

function setMachtingTweets(tweets, likes, retweets, uniqueUsers, div) {

    $(div).html('')

    $(div).append('<div class="col-md-6 bg-twitter padding-bottom-38 text-center"> ' +
        '<div class="text-center">' +
        '<p class="pull-left margin-top-20">' +
        '<i class="fa fa-twitter fa-4x"></i>' +
        '</p>' +
        '<div class="social-overview">' +
        '<span class="font-size-40 counter font-bold text-left">' + tweets + '</span>' +
        '<p class="margin-left-50 text-left">Tweets this month</p>' +
        '</div></div></div>')

    $(div).append('<div class="col-md-6 bg-twitter padding-bottom-38 text-center"> ' +
        '<div class="text-center">' +
        '<p class="pull-left margin-top-20">' +
        '<i class="fa fa-twitter fa-4x"></i>' +
        '</p>' +
        '<div class="social-overview">' +
        '<span class="font-size-40 counter font-bold text-left">' + likes + '</span>' +
        '<p class="margin-left-50 text-left">Likes this month</p>' +
        '</div></div></div>')

    $(div).append('<div class="col-md-6 bg-twitter padding-bottom-38 text-center"> ' +
        '<div class="text-center">' +
        '<p class="pull-left margin-top-20">' +
        '<i class="fa fa-twitter fa-4x"></i>' +
        '</p>' +
        '<div class="social-overview">' +
        '<span class="font-size-40 counter font-bold text-left">' + retweets + '</span>' +
        '<p class="margin-left-50 text-left">Retweets this month</p>' +
        '</div></div></div>')

    $(div).append('<div class="col-md-6 bg-twitter padding-bottom-38 text-center"> ' +
        '<div class="text-center">' +
        '<p class="pull-left margin-top-20">' +
        '<i class="fa fa-twitter fa-4x"></i>' +
        '</p>' +
        '<div class="social-overview">' +
        '<span class="font-size-40 counter font-bold text-left">' + uniqueUsers + '</span>' +
        '<p class="margin-left-50 text-left">Users this month</p>' +
        '</div></div></div>')
}

function setUserProfile(user) {
    console.info('setUserProfile')
    var url = user.profilePictureURI, username = user.username
    if (!url) {
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
        '<img src="'+ url +'" class="img-circle profile-avatar" data-pin-nopin="true">' +
        '<h4 class="fg-gray font-bold">'+ username + '</h4></div></div></div></div></div>')
}

function getTweets(){
    $.ajax({
        url: '/Dashboard/getTweets',
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            console.info('succes getTweets')
            var aantalTweets = data.tweets[0].values.count
            var likes = data.tweets[0].values.likesPerDay
            var retweetsPerDay = data.tweets[0].values.retweetsPerDay
            var dataPlot = data.graphArrayDayTweets
            var uniqueUsers = data.uniqueUsers
            var wordCloud = data.wordCloud
            setMachtingTweets(aantalTweets, likes, retweetsPerDay, uniqueUsers, '#social')
            //getWordCloud('#wordcloud', wordCloud)
       }
   })

}

function getTickets() {

    $.ajax({
        url: '/Dashboard/getTickets',
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            console.info('succes getTickets')

            // Intialize variables filters
            fltrGroup = data.fltrGroup
            fltrState = data.fltrState
            fltrGroupString = '<select class="selectpicker" id="selectFltrGroup">'
            fltrStateString = '<select class="selectpicker" id="selectFltrState">'


            fltrGroup.forEach(function (row) {
                fltrGroupString = fltrGroupString + '<option>' + row + '</option>'
            })
            fltrGroupString = fltrGroupString + '</select>'

            fltrState.forEach(function (row) {
                fltrStateString = fltrStateString + '<option>' + row + '</option>'
            })
            fltrStateString = fltrStateString + '</select>'

            $('#fltrListCattegory').html(fltrGroupString)

            // Calculate Stock
            var values = [], stock = 0, stockValues = {}
            values = filterTickets('All', data.aggCountsPerDayCattegory)

            console.info('-----------  Funnel values------------')
            stockValues = values.stockValues
            //console.info(stockValues)
            //console.info('-----------  Funnel values------------')
            //console.info(moment('06-10-2017','DD-MM-YYYY').format('DD-MM-YYYY'))
            var vandaag = moment('06-10-2017','DD-MM-YYYY').format('DD-MM-YYYY')


            $('#createdTickets').text(stockValues.createdTickets).click(function () {
                console.info('click createdTickets')
                createfunnelRepportIncidents(data.allTickets,'ticketsList', {State: 'Classification', snapshotDate: vandaag})
                createfunnelRepportSRQ(data.allTickets,'ticketsList', {State: 'Classification', snapshotDate: vandaag})
            })
            $('#openTickets').text(stockValues.openTickets).click(function () {
                console.info('click openTickets')
                createfunnelRepportIncidents(data.allTickets,'ticketsList', {State: 'In progress', snapshotDate: vandaag})
                createfunnelRepportSRQ(data.allTickets,'ticketsList', {State: 'In progress', snapshotDate: vandaag})

            })
            $('#closedTickets').text(stockValues.solvedTickets).click(function () {
                console.info('click SolvedTickets')
                createfunnelRepportIncidents(data.allTickets,'ticketsList', {State: 'Solved', snapshotDate: vandaag})
                createfunnelRepportSRQ(data.allTickets,'ticketsList', {State: 'Solved', snapshotDate: vandaag})
            })
            $('#stock').text(stockValues.ticketStock)


            //console.info('-------------Plot Graph-----------------------------')
            //plotGraph('ticketChart',newValues.countPerDay)
            d3GraphPlot('ticketChart2', values.countPerDay)

            setSpiderChart('ticketChart', data.dataSpider, data.legendaSpider)
            //console.info('-------------Plot Graph End-----------------------------')

            console.info('---------------START SPIDER UPDATE---------------------------')
            $('#removeWord').html('<input type="text" id="txtRemoveWord"></input>')
            $('#removeButton').html('<button type="button" class="btn btn-primary" id="cmdRemoveWord">Remove word</button>')
            // Add exception to wordspider
            $('#cmdRemoveWord').click(function () {
                console.info('cmdRemoveWord: ' + $('#txtRemoveWord').val())
                $.ajax({
                    url: '/Dashboard/removeWordfromSpider',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({expection: $('#txtRemoveWord').val()}),
                    success: function (response) {
                        //console.info('reload!!')
                        location.reload()
                    }
                });
            })
            console.info('---------------EINDE SPIDER UPDATE---------------------------')

            $('#selectFltrGroup').change(function () {
                var fltrValue = $('#selectFltrGroup option:selected').text(),
                    newvalues = filterTickets(fltrValue, data.aggCountsPerDayCattegory)

                    console.info('Funnel values Change')
                    stockValues = newvalues.stockValues
                    console.info(stockValues)

                    console.info('----- Change ----------')
                    $('#createdTickets').text(stockValues.createdTickets).click(function () {
                        console.info('click createdTickets')
                        createfunnelRepportIncidents(data.allTickets,'ticketsList', {State: 'Classification', 'Responsible Group': fltrValue, snapshotDate: vandaag})
                        createfunnelRepportSRQ(data.allTickets,'ticketsList', {State: 'Classification', 'Responsible Group': fltrValue, snapshotDate: vandaag})
                    })
                    $('#openTickets').text(stockValues.openTickets).click(function () {
                        console.info('click createdTickets')
                        createfunnelRepportIncidents(data.allTickets,'ticketsList', {State: 'Classification', 'In progress': fltrValue, snapshotDate: vandaag})
                        createfunnelRepportSRQ(data.allTickets,'ticketsList', {State: 'Classification', 'In progress': fltrValue, snapshotDate: vandaag})
                    })
                    $('#closedTickets').text(stockValues.solvedTickets).click(function () {
                        console.info('click createdTickets')
                        createfunnelRepportIncidents(data.allTickets,'ticketsList', {State: 'Classification', 'Solved': fltrValue, snapshotDate: vandaag})
                        createfunnelRepportSRQ(data.allTickets,'ticketsList', {State: 'Classification', 'Solved': fltrValue, snapshotDate: vandaag})
                    })
                    $('#stock').text(stockValues.ticketStock)


            })
            // Ticket Trends on Amount
            ticketsCreatedPerWeek(data.aggCountsPerDayCattegory)
            ticketsSolvedPerWeek(data.allTickets)
            ticketsCreatedSRL(data.aggCountsPerDayCattegory)
            ticketsSolvedSRL(data.allTickets)
            ticketsCreatedCPF(data.aggCountsPerDayCattegory)
            ticketsSolvedCPF(data.allTickets)
            ticketsCreatedCognos(data.aggCountsPerDayCattegory)
            ticketsSolvedCognos(data.allTickets)

            //Tickets per user
            ticketsPerUser(data.ticketsPerUser)

            // Ticket Trends on Time
            //ticketLeadTime(data.allTickets)
        }
    })
}

function getWordCloud(div, lstWord){
    console.info(lstWord)

    var cloud = d3.layout.cloud;
    var fill = d3.schemeCategory20
    var layout = cloud()
        .size([500, 500])
        .words(lstWord.map(function(d) {
            return {text: d, size: 10 + Math.random() * 90, test: "haha"};
        }))
        .padding(5)
        .rotate(function() { return ~~(Math.random() * 1) * 90; })
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .on("end", draw);

    layout.start();

    function draw(words) {
        d3.select(div).append("svg")
            .attr("width", layout.size()[0])
            .attr("height", layout.size()[1])
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return '#000'; })
            .attr("text-anchor", "middle")
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
    }
}










