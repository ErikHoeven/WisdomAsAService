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
        '<img src="'+ url +'" class="img-circle profile-avatar" data-pin-nopin="true" height="75" width="75">' +
        '<h4 class="fg-gray font-bold">'+ username + '</h4></div></div></div></div></div>')
}

function getTickets(snapshot) {

    $.ajax({
        url: '/Dashboard/getTickets',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({snapshot: snapshot}),
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

            // Calculate Stock parameters
            var snapshot = moment(data.snapshots[data.snapshots.length -1], 'DD-MM-YYYY').format('DD-MM-YYYY')
            var values = [], stock = 0, stockValues = {}
            values = filterTickets('All', data.perSnapshot, snapshot).stockValue

            console.info('-----------  Funnel values------------')
            stockValues = values[0].value

            $('#createdTickets').text(stockValues.createdTickets).click(function () {
                //console.info('click createdTickets:')
                //createfunnelRepportIncidents(data.allTickets, 'ticketsList', {
                //    State: 'Classification',
                //    snapshotDate: vandaag
                //})
                //createfunnelRepportSRQ(data.allTickets, 'ticketsList', {State: 'Classification', snapshotDate: vandaag})
            })
            $('#openTickets').text(stockValues.ticketsInProgress ).click(function () {
                console.info('click openTickets')
                createfunnelRepportIncidents(data.allTickets, 'ticketsList', {
                    State: 'In progress',
                    snapshotDate: vandaag
                })
                createfunnelRepportSRQ(data.allTickets, 'ticketsList', {State: 'In progress', snapshotDate: vandaag})

            })
            $('#closedTickets').text(stockValues.ticketsSolved).click(function () {
                console.info('click SolvedTickets')
                createfunnelRepportIncidents(data.allTickets, 'ticketsList', {State: 'Solved', snapshotDate: vandaag})
                createfunnelRepportSRQ(data.allTickets, 'ticketsList', {State: 'Solved', snapshotDate: vandaag})
            })
            $('#stock').text(stockValues.ticketsInStock)

            var countPerDay = data.perSnapshot[0].totActualTickets
            snapshot = moment(snapshot,'DD-MM-YYYY').format('YYYY-MM-DD')

            d3GraphPlot('ticketChart2', countPerDay)

        /*    $.ajax({
                url: '/Dashboard/getSpider',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({: snapshot}),
                success: function (data) {*/


                    //setSpiderChart('ticketChart', data.dataSpider, data.legendaSpider)

                    $('#selectFltrGroup').change(function () {
                        var fltrValue = $('#selectFltrGroup option:selected').text()

                        $.ajax({
                            url: '/Dashboard/getTickets',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify({snapshot: snapshot, filter: fltrValue}),
                            success: function (data) {

                                console.info('Change')

                                newvalues = filterTickets(fltrValue, data.perSnapshot, snapshot).stockValue

                                console.info('Funnel values Change')
                                stockValues = newvalues[0].value
                                filteredTickets = filterTickets(fltrValue, data.perSnapshot, snapshot).filteredTickets

                                console.info('----- Change ----------')
                                $('#createdTickets').text(stockValues.createdTickets).click(function () {
                                    console.info('click createdTickets')
                                    createfunnelRepportIncidents(filteredTickets, 'ticketsList', {
                                        state: 'Classification',
                                        'Responsible Group': fltrValue
                                    })

                                    // Incidenten to PowerPoint
                                    $('#INCTicketBackLogButton').html('<button type="button" id="cmdCreateUserStories" class="btn btn-primary">Create User Stories</button>')
                                    $('#cmdCreateUserStories').click(function () {
                                        createBackLog(filteredTickets, {
                                            state: 'Classification'
                                        }, 'Incident')
                                    })
                                    //Incidenten to Planning & Prio Collection
                                    $('#INCTicketBackLogButton').append('<button type="button" id="cmdToPlanning" class="btn btn-primary">Promote to Planning</button>')
                                    $('#cmdToPlanning').click(function () {
                                        promotoToBackLog(filteredTickets, {state: 'Classification'})
                                    })

                                    createfunnelRepportSRQ(filteredTickets, 'ticketsList', {state: 'Classification'})

                                    // Service Requests to Powerpoint
                                    $('#SRQTicketBackLogButton').html('<button type="button" id="cmdSRQCreateUserStories" class="btn btn-primary">Create User Stories</button>')
                                    $('#cmdSRQCreateUserStories').click(function () {
                                        createBackLog(filteredTickets, {
                                            state: 'Classification'
                                        }, 'Service Request')
                                    })

                                    //Service Request to Planning & Prio Collection
                                    $('#SRQTicketBackLogButton').append('<button type="button" id="cmdSRQToPlanning" class="btn btn-primary">Promote to Planning</button>')
                                    $('#cmdSRQToPlanning').click(function () {
                                        promotoToBackLog(filteredTickets, {
                                            state: 'Classification'
                                        }, 'Service Request')
                                    })
                                })

                                $('#openTickets').text(stockValues.ticketsInProgress).click(function () {
                                    console.info('click createdTickets')
                                    createfunnelRepportIncidents(filteredTickets, 'ticketsList', {
                                        state: 'Classification',
                                        'In progress': fltrValue,
                                        snapshotDate: snapshot
                                    })
                                    createfunnelRepportSRQ(filteredTickets, 'ticketsList', {
                                        state: 'Classification',
                                        'In progress': fltrValue,
                                        snapshotDate: snapshot
                                    })
                                })
                                $('#closedTickets').text(stockValues.ticketsSolved).click(function () {
                                    console.info('click createdTickets')
                                    createfunnelRepportIncidents(filteredTickets, 'ticketsList', {
                                        state: 'Classification',
                                        'Solved': fltrValue,
                                        snapshotDate: snapshot
                                    })
                                    createfunnelRepportSRQ(filteredTickets, 'ticketsList', {
                                        state: 'Classification',
                                        'Solved': fltrValue,
                                        snapshotDate: snapshot
                                    })
                                })
                                $('#stock').text(stockValues.ticketsInStock)
                            }
                        })
                    })
                    // Ticket Trends on Amount
                    ticketsSRL(data.perSnapshot[0].totTicketsperWeekSRL)
                    ticketsCPF(data.perSnapshot[0].totTicketsperWeekCPF)
                    ticketsCognos(data.perSnapshot[0].totTicketsperWeekCognos)
                    ticketsDWH(data.perSnapshot[0].totTicketsperWeekDWH)

                    //Tickets per user
                    //ticketsPerUser(data.ticketsPerUser)

                    // Ticket Trends on Time
                    //ticketLeadTime(data.allTickets)
                }
        })
    }

