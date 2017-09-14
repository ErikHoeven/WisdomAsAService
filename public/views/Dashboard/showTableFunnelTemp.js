/**
 * Created by erik on 9/14/17.
 */
// New Tickets
.click(function () {

    console.info('newTickets click')
    var table = getTicketList(data.allTickets, {Group: fltrValue, State: 'Classification'},10, 1)
    var pagnation = setPagnation(data.allTickets, 10, 1, {Group: fltrValue,State: 'Classification'})

    $('#' + table.div).html('')
    $('#' + table.div).append('<table class="table table-hover" id="' + table.tableName + '">')
    $('#' + table.tableName).append('<thead>><tr>' + table.strColumns + '</tr></thead>')
    $('#' + table.tableName).append('<tbody>' + table.strData + '</tbody></table>')
    //$('#' + button).html('<button type="button" id="updSentiment" class="btn btn-primary">update Sentiment Score</button>')
    $('#pagnation').html(pagnation)

    // Capture change in URL to load the next resultset
    $(window).on('hashchange', function (e) {
        console.info('changed')
        var hash = window.location.hash.replace('#', '')

        var table = getTicketList(data.allTickets, {Group: fltrValue,State: 'Classification'}, 10, hash)
        var pagnation = setPagnation(data.allTickets, 10, hash, {Group: fltrValue,State: 'Classification'})

        $('#' + table.div).html('')
        $('#' + table.div).append('<table class="table table-hover" id="' + table.tableName + '">')
        $('#' + table.tableName).append('<thead>><tr>' + table.strColumns + '</tr></thead>')
        $('#' + table.tableName).append('<tbody>' + table.strData + '</tbody></table>')
        //$('#' + button).html('<button type="button" id="updSentiment" class="btn btn-primary">update Sentiment Score</button>')
        $('#pagnation').html(pagnation)

    })
})


// Solved Tickets
    .click(function () {

        console.info('Solved click')
        var table = getTicketList(data.allTickets, {Group: fltrValue, State: 'Solved'},10, 1)
        var pagnation = setPagnation(data.allTickets, 10, 1, {Group: fltrValue,State: 'Solved'})

        $('#' + table.div).html('')
        $('#' + table.div).append('<table class="table table-hover" id="' + table.tableName + '">')
        $('#' + table.tableName).append('<thead>><tr>' + table.strColumns + '</tr></thead>')
        $('#' + table.tableName).append('<tbody>' + table.strData + '</tbody></table>')
        //$('#' + button).html('<button type="button" id="updSentiment" class="btn btn-primary">update Sentiment Score</button>')
        $('#pagnation').html(pagnation)

        // Capture change in URL to load the next resultset
        $(window).on('hashchange', function (e) {
            console.info('changed')
            var hash = window.location.hash.replace('#', '')

            var table = getTicketList(data.allTickets, {Group: fltrValue,State: 'Solved'}, 10, hash)
            var pagnation = setPagnation(data.allTickets, 10, hash, {Group: fltrValue,State: 'Solved'})

            $('#' + table.div).html('')
            $('#' + table.div).append('<table class="table table-hover" id="' + table.tableName + '">')
            $('#' + table.tableName).append('<thead>><tr>' + table.strColumns + '</tr></thead>')
            $('#' + table.tableName).append('<tbody>' + table.strData + '</tbody></table>')
            //$('#' + button).html('<button type="button" id="updSentiment" class="btn btn-primary">update Sentiment Score</button>')
            $('#pagnation').html(pagnation)

        })
    })

// OpenTickets
    .text(stockValues.openTickets).click(function () {

        console.info('Open click')
        var filterArray = [{Group: fltrValue, State: 'In progress'},{Group: fltrValue, State: 'Waiting'}]
        var table = getTicketList(data.allTickets, filterArray,10, 1)
        var pagnation = setPagnation(data.allTickets, 10, 1, filterArray)

        $('#' + table.div).html('')
        $('#' + table.div).append('<table class="table table-hover" id="' + table.tableName + '">')
        $('#' + table.tableName).append('<thead>><tr>' + table.strColumns + '</tr></thead>')
        $('#' + table.tableName).append('<tbody>' + table.strData + '</tbody></table>')
        //$('#' + button).html('<button type="button" id="updSentiment" class="btn btn-primary">update Sentiment Score</button>')
        $('#pagnation').html(pagnation)

        // Capture change in URL to load the next resultset
        $(window).on('hashchange', function (e) {
            console.info('changed')
            var hash = window.location.hash.replace('#', '')

            var table = getTicketList(data.allTickets, filterArray, 10, hash)
            var pagnation = setPagnation(data.allTickets, 10, hash, filterArray)

            $('#' + table.div).html('')
            $('#' + table.div).append('<table class="table table-hover" id="' + table.tableName + '">')
            $('#' + table.tableName).append('<thead>><tr>' + table.strColumns + '</tr></thead>')
            $('#' + table.tableName).append('<tbody>' + table.strData + '</tbody></table>')
            //$('#' + button).html('<button type="button" id="updSentiment" class="btn btn-primary">update Sentiment Score</button>')
            $('#pagnation').html(pagnation)

        })
    })