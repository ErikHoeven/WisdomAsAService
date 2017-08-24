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
    console.info(url)
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
            console.info('succes')
            var aantalTweets = data.tweets[0].values.count
            var likes = data.tweets[0].values.likesPerDay
            var retweetsPerDay = data.tweets[0].values.retweetsPerDay
            var dataPlot = data.graphArrayDayTweets
            var uniqueUsers = data.uniqueUsers
            var wordCloud = data.wordCloud
            setMachtingTweets(aantalTweets, likes, retweetsPerDay, uniqueUsers, '#social')

            // Building Chart
            $('#myfirstchart').html('')
            new Morris.Line({
                // ID of the element in which to draw the chart.
                element: 'myfirstchart',
                // Chart data records -- each entry in this array corresponds to a point on
                // the chart.
                data: dataPlot,
                //    [
                //    {date: '2008', value: 20},
                //    {date: '2009', value: 10},
                //    {year: '2010', value: 5},
                //    {year: '2011', value: 5},
                //    {year: '2012', value: 20}
                //],
                // The name of the data record attribute that contains x-values.
                xkey: 'date',
                // A list of names of data record attributes that contain y-values.
                ykeys: ['value'],
                // Labels for the ykeys -- will be displayed when you hover over the
                // chart.
                labels: ['Value']
            });

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
            console.info('succes')


                    fltrGroup = data.fltrGroup
                    fltrState = data.fltrState
                    fltrGroupString = '<select class="selectpicker" id="selectFltrGroup">'
                    fltrStateString = '<select class="selectpicker" id="selectFltrState">'

                    fltrGroup.forEach(function (row) {
                      fltrGroupString = fltrGroupString + '<option>' + row +'</option>'
                        //console.info(fltrGroupString)
                    })
                    fltrGroupString = fltrGroupString + '</select>'

                    fltrState.forEach(function (row) {
                        fltrStateString = fltrStateString + '<option>' + row +'</option>'
                        //console.info(fltrGroupString)
                    })
                fltrStateString = fltrStateString + '</select>'

                $('#fltrListCattegory').html(fltrGroupString)

                $('#selectFltrGroup').change(function () {
                    var fltrValue = $('#selectFltrGroup option:selected').text(), values = filterTickets(fltrValue,data.aggCountsPerDayCattegory)

                    $('#createdTickets').text(values.createdTickets)
                    $('#openTickets').text(values.openTickets)
                    $('#solvedTickets').text(values.solvedTickets)
                    $('#newTickets').text(values.createdTickets)
                })

            values = filterTickets('All',data.aggCountsPerDayCattegory)

            $('#createdTickets').text(values.createdTickets)
            $('#openTickets').text(values.openTickets)
            $('#solvedTickets').text(values.solvedTickets)
            $('#newTickets').text(values.createdTickets)





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


function filterTickets(value, dataset) {
    var returnArray = [], returnObject = {}

    if (value != 'All'){
        console.info(dataset)
        returnArray = _.where(dataset,{Group: value})
    }
    else{
        returnArray = dataset
    }

    var aggCountsPerDayCattegory = returnArray

    var countsPerDayCattegory = d3.nest()
        .key(function (d) {
            return d.snapshotDate
        })
        .rollup(function (v) {
            return {
                countCreatedTickets: d3.sum(v, function (d) {
                    return d.countCreatedTickets;
                }),
                countOpenTickets: d3.sum(v, function (d) {
                    return d.countOpenTickets;
                }),
                countSolvedTickets: d3.sum(v, function (d) {
                    return d.countSolvedTickets;
                }),
            };
        })
        .entries(aggCountsPerDayCattegory)


    var createdTickets = countsPerDayCattegory[countsPerDayCattegory.length-1].value.countCreatedTickets,
        openTickets = countsPerDayCattegory[countsPerDayCattegory.length-1].value.countOpenTickets,
        solvedTickets = countsPerDayCattegory[countsPerDayCattegory.length-1].value.countSolvedTickets

    returnObject.createdTickets = createdTickets
    returnObject.openTickets = openTickets
    returnObject.solvedTickets = solvedTickets


    return returnObject
}



