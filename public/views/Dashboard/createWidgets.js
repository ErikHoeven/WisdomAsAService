function setUserProfile(user) {
    console.info('setUserProfile')
    var url = user.profilePictureURI, username = user.username
    console.info(user)
    console.info(url)
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

function getTickets(snapshot,username) {
    var changed = 0, nSnapshotWeek = moment(snapshot, 'YYYY-MM-DD').week() -1

    $('#blockTitle').html(username + ' - Incidents and Service Requests week: '+  nSnapshotWeek )
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
            console.info(snapshot)
            var values = [], stock = 0, stockValues = {}
            values = filterTickets('All', data.perSnapshot, snapshot).stockValue


            console.info('-----------  Funnel values------------')
            console.info(values)
            stockValues = values[0].value
            console.info(stockValues)

            $('#createdTickets').text(stockValues.createdTickets).click(function () {

            })
            $('#openTickets').text(stockValues.ticketsInProgress ).click(function () {
                console.info('click openTickets')
                if (changed == 0){
                    createfunnelRepportIncidents(filteredTickets, 'ticketsList', {state: "In Progress"})
                    createfunnelRepportSRQ(filteredTickets, 'ticketsList', {state: "In Progress"})
                }

            })
            $('#closedTickets').text(stockValues.ticketsSolved).click(function () {
                console.info('click SolvedTickets')
                if (changed == 0) {
                    createfunnelRepportIncidents(data.allTickets, 'ticketsList', { state: 'Solved'})
                    createfunnelRepportSRQ(data.allTickets, 'ticketsList', {state: 'Solved'})
                }
            })
            $('#stock').text(stockValues.ticketsInStock)

            var countPerDay = data.perSnapshot[0].totActualTickets
            console.info('data.perSnapshot[0].totActualTickets')
            console.info(countPerDay)
            snapshot = moment(snapshot,'DD-MM-YYYY').format('YYYY-MM-DD')

            d3GraphPlot('ticketChart2', countPerDay)
            console.info('SpiderData')
            console.info()

            $.ajax({
                url: '/Dashboard/getSpider',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({data: _.where(data.perSnapshot[0].snapshotDetails,{IndSpider:1, IndEPS : 1})}),
                success: function (spider) {
                console.info('succes')
                    console.info(spider.Data.length)
                    if ( spider.Data.length > 0  ){
                        setSpiderChart('ticketChart', spider.Data, spider.Legenda)
                    }

                }
            })

                    $('#selectFltrGroup').change(function () {
                        var fltrValue = $('#selectFltrGroup option:selected').text()

                        $.ajax({
                            url: '/Dashboard/getTickets',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify({snapshot: snapshot, filter: fltrValue}),
                            success: function (data) {

                                console.info('Change')
                                changed = 1
                                console.info(_.where(data.perSnapshot[0].snapshotDetails,{creationWeek: 9}))

                                newvalues = filterTickets(fltrValue, data.perSnapshot, snapshot).stockValue

                                console.info('Funnel values Change')
                                stockValues = newvalues[0].value
                                filteredTickets = filterTickets(fltrValue, data.perSnapshot, snapshot).filteredTickets

                                console.info('----- Change ----------')
                                // Created Tickets
                                $('#createdTickets').text(stockValues.createdTickets).click(function () {
                                    console.info('click createdTickets')
                                    if (changed == 1) {
                                        createfunnelRepportIncidents(filteredTickets, 'ticketsList', {state: "Classification", IndCreated:1, responsibleGroup: fltrValue})
                                        createfunnelRepportChanges(filteredTickets, 'ticketsList', {IndCreated:1, responsibleGroup: fltrValue})

                                        // Incidenten to PowerPoint
                                        $('#INCTicketBackLogButton').html('<button type="button" id="cmdCreateUserStories" class="btn btn-primary">Create User Stories</button>')
                                        $('#cmdCreateUserStories').click(function () {

                                            createBackLog(filteredTickets, {state: 'Classification', IndCreated: 1}, 'Incident')
                                        })
                                        //Incidenten to Planning & Prio Collection
                                        $('#INCTicketBackLogButton').append('<button type="button" id="cmdToPlanning" class="btn btn-primary">Promote to Planning</button>')
                                        $('#cmdToPlanning').click(function () {
                                            console.info("cmdIncident")
                                            promotoToBackLog(filteredTickets, {state: 'Classification',  IndCreated: 1}, "Incident")
                                        })

                                        createfunnelRepportSRQ(filteredTickets, 'ticketsList', {state: 'Classification',  IndCreated: 1})

                                        // Service Requests to Powerpoint
                                        $('#SRQTicketBackLogButton').html('<button type="button" id="cmdSRQCreateUserStories" class="btn btn-primary">Create User Stories</button>')
                                        $('#cmdSRQCreateUserStories').click(function () {
                                            createBackLog(filteredTickets, {state: 'Classification'}, 'Service Request')
                                        })

                                        //Service Request to Planning & Prio Collection
                                        $('#SRQTicketBackLogButton').append('<button type="button" id="cmdSRQToPlanning" class="btn btn-primary">Promote to Planning</button>')
                                        $('#cmdSRQToPlanning').click(function () {
                                            promotoToBackLog(filteredTickets, {
                                                state: 'Classification'
                                            }, 'Service Request')
                                        })

                                        // Changes to PowerPoint
                                        $('#ChangeTicketBackLogButton').html('<button type="button" id="cmdCreateUserStories" class="btn btn-primary">Create User Stories</button>')
                                        $('#ChangeCreateUserStories').click(function () {
                                            //console.info(filteredTickets[0])
                                            //createBackLog(filteredTickets, {state: 'Classification', IndCreated: 1, Process: }, 'Incident')
                                        })
                                        //Change Request to Planning & Prio Collection
                                        $('#ChangeTicketBackLogButton').append('<button type="button" id="cmdSRQToPlanning" class="btn btn-primary">Promote to Planning</button>')
                                        $('#ChangeToPlanning').click(function () {
                                            promotoToBackLog(filteredTickets, {
                                                state: 'Classification'
                                            }, 'Service Request')
                                        })

                                    }
                                })

                                $('#openTickets').text(stockValues.ticketsInProgress).click(function () {
                                    console.info('click createdTickets')
                                    if (changed == 1) {
                                        createfunnelRepportIncidents(filteredTickets, 'ticketsList', {state: "In Progress", responsibleGroup: fltrValue, IndProgress: 1})
                                        createfunnelRepportSRQ(filteredTickets, 'ticketsList', {state: "In Progress", responsibleGroup: fltrValue,IndProgress: 1})
                                        createfunnelRepportChanges(filteredTickets, 'ticketsList', {IndCreated:1, responsibleGroup: fltrValue})
                                    }
                                })


                                $('#closedTickets').text(stockValues.ticketsSolved).click(function () {
                                    console.info('click createdTickets')
                                    if (changed == 1) {
                                        createfunnelRepportIncidents(filteredTickets, 'ticketsList', {
                                            IndSolved: 1,
                                            responsibleGroup: fltrValue
                                        })
                                        createfunnelRepportSRQ(filteredTickets, 'ticketsList', {
                                            IndSolved: 1,
                                            responsibleGroup: fltrValue
                                        })
                                    }
                                })
                                $('#stock').text(stockValues.ticketsInStock).click(function () {
                                    console.info('click createdTickets')
                                    if (changed == 1) {
                                        createfunnelRepportIncidents(filteredTickets, 'ticketsList', {
                                            IndStock: 1,
                                            responsibleGroup: fltrValue
                                        })
                                        createfunnelRepportSRQ(filteredTickets, 'ticketsList', {
                                            IndStock: 1,
                                            responsibleGroup: fltrValue
                                        })

                                        createfunnelRepportChanges(filteredTickets, 'ticketsList', {
                                            IndStock: 1,
                                            responsibleGroup: fltrValue
                                        })

                                        //Change Request to Planning & Prio Collection
                                        $('#ChangeTicketBackLogButton').html('')
                                        $('#ChangeTicketBackLogButton').append('<button type="button" id="cmdChangeToPlanning" class="btn btn-primary">Promote to Planning</button>')
                                        $('#cmdChangeToPlanning').click(function () {
                                            promotoToBackLog(filteredTickets, {
                                                IndStock: 1,
                                                responsibleGroup: fltrValue,
                                            }, 'Change')
                                        })
                                    }
                                })
                            }
                        })
                        if (fltrValue != 'All'){
                            $.ajax({
                                url: '/Dashboard/getSpider',
                                type: 'POST',
                                contentType: 'application/json',
                                data: JSON.stringify({data: _.where(data.perSnapshot[0].snapshotDetails,{IndSpider:1, IndEPS : 1, responsibleGroup: fltrValue})}),
                                success: function (spider) {
                                    console.info('succes')
                                    console.info(spider)
                                    if ( spider.Data.length > 0  ) {
                                        setSpiderChart('ticketChart', spider.Data, spider.Legenda)
                                    }
                                }
                            })
                        }else{

                            $.ajax({
                                url: '/Dashboard/getSpider',
                                type: 'POST',
                                contentType: 'application/json',
                                data: JSON.stringify({data: _.where(data.perSnapshot[0].snapshotDetails,{IndSpider:1, IndEPS : 1})}),
                                success: function (spider) {
                                    console.info('succes')
                                    console.info(spider)
                                    setSpiderChart('ticketChart', spider.Data, spider.Legenda)
                                }
                            })
                        }
                    })

                    // Ticket Trends on Amount
                    ticketsSRL(data.perSnapshot[0].totTicketsperWeekSRL)
                    ticketsCPF(data.perSnapshot[0].totTicketsperWeekCPF)
                    ticketsCognos(data.perSnapshot[0].totTicketsperWeekCognos)
                    ticketsDWH(data.perSnapshot[0].totTicketsperWeekDWH)
                    ticketsESOFT(data.perSnapshot[0].totTicketsperWeekESOFT)

                    //Tickets per user
                    //ticketsPerUser(data.ticketsPerUser)

                    // Ticket Trends on Time
                    //ticketLeadTime(data.allTickets)
                }
        })
    }

