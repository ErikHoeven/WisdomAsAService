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
