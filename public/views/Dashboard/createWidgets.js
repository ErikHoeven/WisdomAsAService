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

function getTickets() {

    $.ajax({
        url: '/Dashboard/getTickets',
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            console.info('succes getTickets')
            console.info(data)

            // Intialize variables filters
            fltrGroup = data.fltrGroup
            fltrGroupString = '<select class="selectpicker" id="selectFltrGroup">'

            fltrGroup.forEach(function (row) {
                fltrGroupString = fltrGroupString + '<option>' + row + '</option>'
            })
            fltrGroupString = fltrGroupString + '</select>'


            $('#fltrListCattegory').html(fltrGroupString)

            // Calculate Stock
            var values = [], stock = 0, stockValues = {}
            values = filterTickets('All', data.aggCountsPerDayCattegory)

            console.info('-----------  Funnel values------------')
            stockValues = values.stockValues
            console.info(stockValues)





            var vandaag = moment(data.snapshots[0], 'DD-MM-YYYY').format('DD-MM-YYYY')

            $('#createdTickets').text(stockValues.createdTickets).click(function () {
                console.info('click createdTickets:')
                createfunnelRepportIncidents(data.allTickets, 'ticketsList', {
                    State: 'Classification',
                    snapshotDate: vandaag
                })
                createfunnelRepportSRQ(data.allTickets, 'ticketsList', {State: 'Classification', snapshotDate: vandaag})
            })
            $('#openTickets').text(stockValues.opentTickets).click(function () {
                console.info('click openTickets')
                createfunnelRepportIncidents(data.allTickets, 'ticketsList', {
                    State: 'In progress',
                    snapshotDate: vandaag
                })
                createfunnelRepportSRQ(data.allTickets, 'ticketsList', {State: 'In progress', snapshotDate: vandaag})

            })
            $('#closedTickets').text(stockValues.solvedTickets).click(function () {
                console.info('click SolvedTickets')
                createfunnelRepportIncidents(data.allTickets, 'ticketsList', {State: 'Solved', snapshotDate: vandaag})
                createfunnelRepportSRQ(data.allTickets, 'ticketsList', {State: 'Solved', snapshotDate: vandaag})
            })
            $('#stock').text(stockValues.ticketStock)

            d3GraphPlot('ticketChart2', values.countPerDay)
            setSpiderChart('ticketChart', data.dataSpider, data.legendaSpider)
            console.info('data.aggCountsPerDayCattegory')
            console.info(data.aggCountsPerDayCattegory)


            $('#selectFltrGroup').change(function () {
                $.ajax({
                    url: '/Dashboard/getTickets',
                    type: 'GET',
                    contentType: 'application/json',
                    success: function (data) {

                        console.info('Change')
                        console.info(data.aggCountsPerDayCattegory)

                        var fltrValue = $('#selectFltrGroup option:selected').text()
                        //newDataArray = _.where(data.aggCountsPerDayCattegory,{})
                        newvalues = filterTickets(fltrValue, data.aggCountsPerDayCattegory)

                        console.info('Funnel values Change')
                        stockValues = newvalues.stockValues
                        console.info(stockValues)

                        console.info('----- Change ----------')
                        $('#createdTickets').text(stockValues.createdTickets).click(function () {
                            console.info('click createdTickets')
                            createfunnelRepportIncidents(data.allTickets, 'ticketsList', {
                                State: 'Classification',
                                'Responsible Group': fltrValue,
                                snapshotDate: vandaag
                            })

                            // Incidenten to PowerPoint
                            $('#INCTicketBackLogButton').html('<button type="button" id="cmdCreateUserStories" class="btn btn-primary">Create User Stories</button>')
                            $('#cmdCreateUserStories').click(function () {
                                createBackLog(data.allTickets, {
                                    State: 'Classification',
                                    'Responsible Group': fltrValue,
                                    snapshotDate: vandaag
                                }, 'Incident')
                            })
                            //Incidenten to Planning & Prio Collection
                            $('#INCTicketBackLogButton').append('<button type="button" id="cmdToPlanning" class="btn btn-primary">Promote to Planning</button>')
                            $('#cmdToPlanning').click(function () {
                                promotoToBackLog(data.allTickets, {
                                    State: 'Classification',
                                    'Responsible Group': fltrValue,
                                    snapshotDate: vandaag
                                }, 'Incident')
                            })

                            createfunnelRepportSRQ(data.allTickets, 'ticketsList', {
                                State: 'Classification',
                                'Responsible Group': fltrValue,
                                snapshotDate: vandaag
                            })

                            // Service Requests to Powerpoint
                            $('#SRQTicketBackLogButton').html('<button type="button" id="cmdSRQCreateUserStories" class="btn btn-primary">Create User Stories</button>')
                            $('#cmdSRQCreateUserStories').click(function () {
                                createBackLog(data.allTickets, {
                                    State: 'Classification',
                                    'Responsible Group': fltrValue,
                                    snapshotDate: vandaag
                                }, 'Service Request')
                            })

                            //Service Request to Planning & Prio Collection
                            $('#SRQTicketBackLogButton').append('<button type="button" id="cmdSRQToPlanning" class="btn btn-primary">Promote to Planning</button>')
                            $('#cmdSRQToPlanning').click(function () {
                                promotoToBackLog(data.allTickets, {
                                    State: 'Classification',
                                    'Responsible Group': fltrValue,
                                    snapshotDate: vandaag
                                }, 'Service Request')
                            })
                        })

                        $('#openTickets').text(stockValues.opentTickets).click(function () {
                            console.info('click createdTickets')
                            createfunnelRepportIncidents(data.allTickets, 'ticketsList', {
                                State: 'Classification',
                                'In progress': fltrValue,
                                snapshotDate: vandaag
                            })
                            createfunnelRepportSRQ(data.allTickets, 'ticketsList', {
                                State: 'Classification',
                                'In progress': fltrValue,
                                snapshotDate: vandaag
                            })
                        })
                        $('#closedTickets').text(stockValues.solvedTickets).click(function () {
                            console.info('click createdTickets')
                            createfunnelRepportIncidents(data.allTickets, 'ticketsList', {
                                State: 'Classification',
                                'Solved': fltrValue,
                                snapshotDate: vandaag
                            })
                            createfunnelRepportSRQ(data.allTickets, 'ticketsList', {
                                State: 'Classification',
                                'Solved': fltrValue,
                                snapshotDate: vandaag
                            })
                        })
                        $('#stock').text(stockValues.ticketStock)
                    }
                })
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


    }})

function getWordCloud(div, lstWord) {
    console.info('WordCloud')
    console.info(lstWord)

    var cloud = d3.layout.cloud;
    var fill = d3.schemeCategory20
    var layout = cloud()
        .size([500, 500])
        .words(lstWord.map(function (d) {
            return {text: d, size: 10 + Math.random() * 90, test: "haha"};
        }))
        .padding(5)
        .rotate(function () {
            return ~~(Math.random() * 1) * 90;
        })
        .font("Impact")
        .fontSize(function (d) {
            return d.size;
        })
        .on("end", draw);

    layout.start();
}

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
    }}











