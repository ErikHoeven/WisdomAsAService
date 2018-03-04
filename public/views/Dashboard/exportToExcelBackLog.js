/**
 * Created by erik on 12/2/17.
 */
function promotoToBackLog(ds, filter, ticketType) {
    console.info("promotoToBackLog: " + ticketType)
    if (ticketType == "Incident") {
        console.info('promotoToBackLog Incident')
        filter.ticketType = "Incident"
        postPlanningtoServer(ds, filter)
    }
    if (ticketType == "Service Request") {
        filter.ticketType = "Service Request"
        console.info('promotoToBackLog SRQ')
        postPlanningtoServer(ds, filter)
    }
}


function postPlanningtoServer(ds, filter) {
    console.info('postPlanningtoServer')

var dataset = _.where(ds,filter)
    console.info('dataset ppt')
    console.info(dataset)

    $.ajax({
        url: '/Dashboard/promoteToBackLog',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({dataset: dataset}),
        success: function (response) {
            console.info(response)
            //location.reload()
        }
    });
}

function getBackLogTable(div1, div2) {
    console.info('---------------- getBackLogTable --------------------')
    //console.info(div)
    $.ajax({
        url: '/Dashboard/getBackLog',
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {
            var tableBacklog = '<table class="table table-hover">' + response.backlogHeader + response.backlogBody + '</table>'
            $('#' + div1).html(tableBacklog)
            var tableDev = '<table class="table table-hover">' + response.devHeader + response.devBody + '</table>'
            $('#' + div2).html(tableDev)
        }
    });
}


function updateBackLog(id) {
    var updatedFields = {}
    updatedFields.id = id
    updatedFields.storyPoints = $('#txtStoryPoints' + id).val()
    updatedFields.sprints = $('#sprint' + id + ' option:selected').text()
    updatedFields.developer = $('#developer' + id + ' option:selected').text()

    console.info(updatedFields)

    $.ajax({
        url: '/Dashboard/updateBackLog',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({updateFields: updatedFields}),
        success: function (response) {
            console.info(response)
            var tableBacklog = '<table id="planboard" class="table table-hover">' + response.backlogHeader + response.backlogBody + '</table>'
            $('#tblBacklog').html(tableBacklog)

            var tableDev = '<table id="devStoryPoints" class="table table-hover">' + response.devHeader + response.devBody + '</table>'
            $('#tblDev').html(tableDev)

            var dev = response.developer.split(' ')

            var tableArray = [], i = 0

            // A. Get values out of the tables and put them in an array

            //A.1Loop over the titles
            $('#planboard tbody tr td:nth-child(2)').each( function(){
                //add item to array
                tableArray.push({pos: i, title: $(this).text()})
                i++
            });
            //A.2Loop over the days
            i= 0
            $('#planboard tbody tr td:nth-child(3)').each( function(){
                //add item to array
                if(i == tableArray[i].pos){
                    tableArray[i].days = $(this).text()
                }
                i++
            });
            //B. Set table based on Array

            //B1 KPI Kolom
            i= 0
            $('#planboard tbody tr td:nth-child(5)').each( function(){
                var title = tableArray[i].title
                var days  = tableArray[i].days
                var strKPI = SLA(title, days)
                $(this).html(strKPI)
                i++
            })

            //B2 LocalOffice
            i= 0
            $('#planboard tbody tr td:nth-child(6)').each( function(){
                var title = tableArray[i].title
                var strLoccalOffice = getLocalOffice(title)
                $(this).text(strLoccalOffice)
                i++
            })

            //B3 SLA
            i= 0
            $('#planboard tbody tr td:nth-child(7)').each( function(){
                var title = tableArray[i].title
                var strSLA = getSLA(title)
                $(this).text(strSLA)
                i++
            })


            //C. Update Story points per dev
            var developers = [], storypoints = [], data = [], row = {}
            $('#planboard tbody tr td:nth-child(10)').each( function(){
                //add item to array
                developers.push( $(this).text() );
            });

            $('#planboard tbody tr td:nth-child(8)').each( function(){
                //add item to array
                storypoints.push( $(this).text() );
            });

            for(var i = 0; i < developers.length; i++){

                for(var j = 0; j < storypoints.length; j++) {
                    if (i == j && developers[i].length < 30 ){

                        row.developers = developers[i]
                        row.storypoints = parseInt(storypoints[j])
                        data.push(row)
                        row = {}
                    }
                }
            }
            var totalAssigntStoryPointsDeveloper = d3.nest()
                .key(function(d) { return d.developers.split(' ')[0]; })
                .rollup(function(v) { return d3.sum(v, function(d) { return d.storypoints; }); })
                .object(data);

            var devpointskeys = Object.keys(totalAssigntStoryPointsDeveloper)

            console.info('devpoints')
            console.info(devpointskeys)

            devpointskeys.forEach(function (dev) {
                var currentvalue = $("#" + dev).html()
                   ,newValue =  currentvalue -  totalAssigntStoryPointsDeveloper[dev]
                    $("#" + dev).html(newValue)
            })
        }
    });
}

function clearBacklog(){
    $.ajax({
        url: '/Dashboard/clearBacklog',
        type: 'GET',
        contentType: 'application/json',
        success: function (response) {
            $('#tblBacklog').html('')
            $('#tblDev').html('')

        }
    });
}


function SLA(title, days){
    var titleArray = title.split(' ')
    var returnString = ''


    titleArray.forEach(function (t) {
        if (t == '00'  && days == 0 ){
            returnString = '<img src="/images/performance_green.png" height="21" width="21"></img>'
        }
        if (t == '00'  && days > 0 ){
            returnString = '<img src="/images/performance_red.jpg" height="21" width="21"></img>'
        }
        if (t == '01'  && days <= 1 ){
            returnString = '<img src="/images/performance_green.png"  height="21" width="21"></img>'
        }
        if (t == '01'  && days > 1 ){
            returnString = '<img src="/images/performance_red.jpg" height="21" width="21"></img>'
        }
        if (t == '02'  && days <= 2 ){
            returnString = '<img src="/images/performance_green.png"  height="21" width="21"></img>'
        }
        if (t == '02'  && days > 2 ){
            returnString = '<img src="/images/performance_red.jpg"  height="21" width="21"></img>'
        }
        if (t == '03'  && days <= 3 ){
            returnString = '<img src="/images/performance_green.png"  height="21" width="21"></img>'
        }
        if (t == '03'  && days >  3 ){
            returnString = '<img src="/images/performance_red.jpg"  height="21" width="21"></img>'
        }
        if (t == '04'  && days <= 4 ){
            returnString = '<img src="/images/performance_green.png"  height="21" width="21"></img>'
        }
        if (t == '04'  && days >  4 ){
            returnString = '<img src="/images/performance_red.jpg"  height="21" width="21"></img>'
        }
        if (t == '05'  && days <= 5 ){
            returnString = '<img src="/images/performance_green.png"  height="21" width="21"></img>'
        }
        if (t == '05'  && days >  5 ){
            returnString = '<img src="/images/performance_red.jpg"  height="21" width="21"></img>'
        }
    })
    return returnString
}

function getLocalOffice(title) {
    var titleArray = title.split(' ')
        ,returnString = ''
        , hit = 0
    titleArray.forEach(function (t) {

        if (t.trim() == 'LOES' && hit == 0 ){
            returnString = 'Local Office Spain'
            hit = 1
        }
        if (t.trim() == 'LOBE' && hit == 0){
            returnString = 'Local Office Belgium'
            hit = 1
        }
        if (t.trim() == 'LODE' && hit == 0){
            returnString = 'Local Office Germany'
            hit = 1
        }
    })
    if(hit == 0 ){
        returnString = 'Unknown'
        hit = 1
    }

    return returnString

}

function getSLA(title) {
    var titleArray = title.split(' ')
    var returnString = ''


    titleArray.forEach(function (t) {
        if (t == '00' ){
            returnString = '00: Solve it the same day'
        }
        if (t == '01' ){
            returnString = '01: Solve it within 1 day'
        }
        if (t == '02' ) {
            returnString = '02: Solve it within 2 day'
        }
        if (t == '03' ){
            returnString = '03: Solve it within 3 day'
        }
        if (t == '04'  ) {
            returnString = '04: Solve it within 4 day'
        }
        if (t == '05'  ) {
            returnString = '05: Solve it within 5 day'
        }
    })

    return returnString
}
