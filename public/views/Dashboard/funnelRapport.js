/**
 * Created by erik on 9/12/17.
 */

function createfunnelRepport(ds, div, filter){

    var dataset = _.where(ds,filter)
    var columns = Object.keys(ds[0])
    columns = _.without(columns, '_id', '', 'count', 'EPS - CPF_Count', 'aggGrain')
    var dataset2 = []

    ds.forEach(function (r) {

        columns.forEach(function (c) {

        })

    })


    console.info(columns)



}