/**
 * Created by erik on 12/2/17.
 */

function createBackLog(ds,filter, ticketType) {
    if (ticketType == "Incident") {
        console.info('incident')
        filter.ticketType = "Incident"
        exportToPowerPoint(ds, filter)
    }
    if (ticketType == "Service Request") {
        console.info('srq')
        filter.ticketType = "Service Request"
        exportToPowerPoint(ds, filter)
    }
    else{
        exportToPowerPointBacklog(ds)
    }
}


function exportToPowerPoint(ds, filter){

    var dataset = _.where(ds,filter)
    console.info('----  dataset after filter ppt ----')
    console.info(dataset)

    dataset.forEach(function (row) {
        var slide = pptx.addNewSlide();
        slide.addText('User Story: ' + row.Number + '                 Responsible Group: ' + row['Responsible Group'], { x:0.8, y:0.25, font_size:18, font_face:'Arial', color:'0088CC' });

        // TABLE 1: Simple array (if there is only one row of data, you can just use a simple array)
        var arrRows = [ row.Title ];
        var tabOpts = { x:0.5, y:1.0, w:9.0 };
        var celOpts = { color:'363636', fill:'F7F7F7', font_size:14, border:{pt:1,color:'FFFFFF'} };
        slide.addTable( arrRows, tabOpts, celOpts );

        // TABLE 2: Multi-row Array (data structure: rows are arrays of cells)
        var rows = [
            ['A1', 'B1', 'C1'],
            ['A2', 'B2', 'C3']
        ];
        var tabOpts = { x:0.5, y:2.0, w:9.0 };
        var celOpts = {
            fill:'dfefff', font_size:18, color:'6f9fc9', rowH:1.0,
            valign:'m', align:'c', border:{ pt:'1', color:'FFFFFF' }
        };
        slide.addTable( rows, tabOpts, celOpts );

        // TABLE 3: Formatting can be done on a cell-by-cell basis
        // TIP: Use this to selectively override table style options
        var rows = [
            [
                { text: 'Story Points: ___', opts: { valign:'t', align:'l', font_face:'Arial'   } },
                { text: 'Name: ______ ', opts: { valign:'t', align:'c', font_face:'Verdana' } },
                { text: 'Commitment Date: ___ - ___ - ____', opts: { valign:'t', align:'r', font_face:'Courier' } }
            ],
        ];
        var tabOpts = { x:0.5, y:4.5, w:9.0 };
        var celOpts = {
            fill:'dfefff', font_size:18, color:'6f9fc9', rowH:0.6,
            valign:'m', align:'c', border:{ pt:'1', color:'FFFFFF' }
        };
        slide.addTable( rows, tabOpts, celOpts );
    })


    pptx.save('User Story Sprint xx');
}



function exportToPowerPointBacklog(dataset){

    dataset.forEach(function (row) {
        var slide = pptx.addNewSlide();
        slide.addText('User Story: ' + row.Number + '                 Responsible Group: ' + row['Responsible Group'], { x:0.8, y:0.25, font_size:18, font_face:'Arial', color:'0088CC' });

        // TABLE 1: Simple array (if there is only one row of data, you can just use a simple array)
        var arrRows = [ row.Title ];
        var tabOpts = { x:0.5, y:1.0, w:9.0 };
        var celOpts = { color:'363636', fill:'F7F7F7', font_size:14, border:{pt:1,color:'FFFFFF'} };
        slide.addTable( arrRows, tabOpts, celOpts );

        // TABLE 2: Multi-row Array (data structure: rows are arrays of cells)
        var rows = [
            ['Impedement: J/N', 'Escalated: J/N', 'Resonsible:...'],
            ['_____', '______', '_______']
        ];
        var tabOpts = { x:0.5, y:2.0, w:9.0 };
        var celOpts = {
            fill:'dfefff', font_size:18, color:'6f9fc9', rowH:1.0,
            valign:'m', align:'c', border:{ pt:'1', color:'FFFFFF' }
        };
        slide.addTable( rows, tabOpts, celOpts );

        // TABLE 3: Formatting can be done on a cell-by-cell basis
        // TIP: Use this to selectively override table style options
        var rows = [
            [
                { text: 'Story Points: ' + row.storypoints, opts: { valign:'t', align:'l', font_face:'Arial'   } },
                { text: 'Name: ' + row.developer, opts: { valign:'t', align:'c', font_face:'Verdana' } },
                { text: 'Commitment Date: ___ - ___ - ____', opts: { valign:'t', align:'r', font_face:'Courier' } }
            ],
        ];
        var tabOpts = { x:0.5, y:4.5, w:9.0 };
        var celOpts = {
            fill:'dfefff', font_size:18, color:'6f9fc9', rowH:0.6,
            valign:'m', align:'c', border:{ pt:'1', color:'FFFFFF' }
        };
        slide.addTable( rows, tabOpts, celOpts );
    })


    pptx.save('User Story Sprint 2017 - 2018');
}