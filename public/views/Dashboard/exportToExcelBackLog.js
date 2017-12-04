/**
 * Created by erik on 12/2/17.
 */
function promotoToBackLog(ds, filter, ticketType) {

    if (ticketType == "Incident") {
        filter.ticketType = "Incident"
        postPlanningtoServer(ds, filter)
    }
    if (ticketType == "Service Request") {
        filter.ticketType = "Service Request"
        postPlanningtoServer(ds, filter)
    }
}


function postPlanningtoServer(ds, filter) {


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

            //update Story points per dev
            var developers = [], storypoints = [], data = [], row = {}
            $('#planboard tbody tr td:nth-child(6)').each( function(){
                //add item to array
                developers.push( $(this).text() );
            });

            $('#planboard tbody tr td:nth-child(4)').each( function(){
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

