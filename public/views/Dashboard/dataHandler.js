//$(document).ready(function() {
    var format = d3.time.format("%Y-%m-%d");

    Date.prototype.getWeek = function () {
        var onejan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7) - 1;
    };


    function setTweetsPerCattegoryPerDay(jsonInput, tweetsPerDay) {
        var tw = [];
        var twd = [];
        jsonInput.forEach(function (a) {
            var cat = {};
            cat.cattegorie = a.tweetCattegorie;
            cat.kleur = a.color;
            twd.push({
                dim: a.postDate,
                measure: a.values,
                Cattegorie: a.tweetCattegorie,
                kleur: a.color
            });
            cat.Data = twd;
            tw.push(cat);
            twd = [];
        });

        tweetsPerDay.forEach(function (a) {
            var cat = {};
            cat.cattegorie = "All tweets";
            cat.kleur = "#63AC38";
            twd.push({
                dim: a.dim,
                measure: a.measure,
                kleur: "#63AC38",
                Cattegorie: "All tweets"
            });
            cat.Data = twd;
            tw.push(cat);
            twd = [];
        });

// Group by Cattegorie
        for (var i = 0; i < tw.length; i++) {
            var Counter = 0;
            var oldData = [];

            tw = tw.filter(function (element) {
                return !!element
            });

            tw.forEach(function (a) {
                var newValue = {};
                if (Counter == i) {
                    oldData = a
                }

                if (Counter > i) {
                    if (a.cattegorie == oldData.cattegorie) {
                        newValue.dim = tw[Counter].Data[0].dim;
                        newValue.measure = tw[Counter].Data[0].measure;
                        newValue.kleur = tw[Counter].kleur;
                        newValue.Cattegorie = tw[Counter].cattegorie;
                        tw[i].Data.push(newValue);
                        //Delete OldData from Twee
                        delete tw[Counter]
                    }
                }
                Counter++
            });
        }

        tw.forEach(function (a) {
            a.Data = a.Data.sort(function (a, b) {
                return format.parse(a.dim) > format.parse(b.dim)
            })
        });


        return tw
    }

    var data = [];
    var data = setTweetsPerCattegoryPerDay(tweetsPerCattegoryPerDay, tweetsPerDay);


    function actualWeek() {
        var d = new Date();
        var nlWeekStartNumber = 1;
        var nlWeekEndNumber = 6;
        var DayCounter = d.getDay();
        var startWeekDay = d.getDate();
        var endWeekDay = d.getDate();
        var startWeekDate = new Date();
        var endWeekDate = new Date();

        for (DayCounter; DayCounter > nlWeekStartNumber; DayCounter--) {
            startWeekDay--;
        }

        for (DayCounter = d.getDay(); DayCounter < nlWeekEndNumber; DayCounter++) {
            endWeekDay++;
        }

        startWeekDate = new Date(startWeekDate.setDate(startWeekDay));
        endWeekDate = new Date(endWeekDate.setDate(endWeekDay + 1));


        return {
            'startWeekDay': startWeekDate
            , 'endWeekDay': endWeekDate
        }
    }

    function actualMonth() {
        //Is het aantal weken in een maand (met begin en eind datum)
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);


        return {
            'startMonth': firstDay
            , 'endMonth': lastDay
        }

    }


    //Filter the dataSet based on startDate and endDate
    function filterDates(startDate, endDate, dataSet, type) {
        var format = d3.time.format("%Y-%m-%d");
        var newDataSet = [];
        var oldData = [];
        var oldDate;
        var data = [];

        console.info('------------ START FILTERING DATA---------------------------------');
        console.info(startDate);
        console.info(endDate);
        console.info(dataSet);
        console.info(type);
        console.info('-------------------------------------------------------------------');


        for (var i = 0; i < dataSet.length; i++) {
            var newData = [];
            var oldData = dataSet[i].Data;
            var insertData = 0;

            oldData.forEach(function (a) {
                var counter = 0;

                if (format.parse(a.dim) >= startDate && format.parse(a.dim) <= endDate) {
                    //console.info(a)
                    //console.info(a.dim)

                    weekNumber = new Date(a.dim).getWeek();
                    monthNumber = new Date(a.dim).getMonth() + 1;
                    insertData = 1;


                    if (type == 'ActualWeek') {
                        newData.push({'Cattegorie': a.Cattegorie, 'dim': a.dim, 'kleur': a.kleur, 'measure': a.measure});
                        oldDim = a.dim
                    }

                    if (type == 'ActualMonth') {
                        newData.push({
                            'Cattegorie': a.Cattegorie,
                            'dim': weekNumber,
                            'kleur': a.kleur,
                            'measure': a.measure
                        })
                    }

                    if (type == 'ActualYear') {
                        newData.push({
                            'Cattegorie': a.Cattegorie,
                            'dim': monthNumber,
                            'kleur': a.kleur,
                            'measure': a.measure
                        })
                    }
                }
            });
            if (insertData == 1) {
                data.push({'Data': newData, 'cattegorie': dataSet[i].cattegorie, 'kleur': dataSet[i].kleur})
            }

        }

        console.info('------------ SET WEEKNUMBERS/MONTHNUMBERS/DAYS TO data arrray-------------------------');
        console.info(data);
        console.info('-------------SET WEEKNUMBERS/MONTHNUMBERS/DAYS TO data arrray-------------------------');



        var catteorieValue = "";
        var dim = "";
        var kleur = "";
        var measure = 0;
        var dl = [];

        var td = [];
        for (var i = 0; i < data.length; i++) {
            ds = data[i].Data;


            if (ds.length == 1) {
                td.push(data[i])
            }
            else {
                for (var c = 0; c < ds.length; c++) {

                    // Count == 0;  Start save JSON content in global variables
                    if (c == 0) {

                        //console.info(ds[c].Cattegorie)

                        catteorieValue = ds[c].Cattegorie;
                        dim = ds[c].dim;
                        kleur = ds[c].kleur;
                        measure = ds[c].measure;

                        dl = []

                    }

                    // Count > 0; Compare JSON with globale variable and count the measure
                    if (c > 0 && dim != ds[c].dim && c + 1 != ds.length){

                        dl.push({'cattegorie': catteorieValue, 'kleur': kleur, 'measure': measure, 'dim': dim});

                        dim = ds[c].dim;
                        measure = ds[c].measure;

                    }


                    if (c > 0 && dim == ds[c].dim && c + 1 != ds.length && measure != ds[c].measure ) {
                        measure = measure + ds[c].measure
                    }

                    // Einde loop JSON row wordt toegeovegod
                    if (c + 1 == ds.length) {
                        measure = measure + ds[c].measure;
                        dl.push({'cattegorie': catteorieValue, 'kleur': kleur, 'measure': measure, 'dim': dim});
                        //console.info(dl)
                        td.push({'cattegorie': catteorieValue , 'kleur': dataSet[c].kleur,'Data': dl,});

                    }

                }
            }
        }
        console.info('------------ EINDE FILTERING DATA---------------------------------');
        console.info(td);
        console.info('------------------------------------------------------------------');
        return td
    }

    function min_max_filterDates(dataset, filtertype){

        min_measure = 99999999;
        max_measure = 0;
        min_dim  =  '9999999';
        max_dim = '0';

        if (filtertype == 'ActualMonth'){

        min_dim = 99999999;
        max_dim = 0

        }
        else if (filtertype == 'ActualWeek'){

            console.info('min_dim');
            max_dim = '1900-01-01';
            min_dim = '9999-12-31';
            console.info(min_dim)
        }


        dataset.forEach(function(a){
         format = d3.time.format("%Y-%m-%d");
         ds = a.Data;
         ds.forEach(function(b){

             if (b.measure < min_measure){
                 min_measure = b.measure

             }
             if (filtertype == 'ActualWeek'){
                 if (format.parse(b.dim) < format.parse(min_dim)){
                     min_dim = b.dim
                 }
             }
             else {
             if (b.dim < min_dim){
               min_dim = b.dim
           }}
        })
        });


        dataset.forEach(function(a) {
            ds = a.Data;
            ds.forEach(function (b) {

                if (b.measure > max_measure) {
                    max_measure = b.measure
                }

                if (filtertype == 'ActualWeek') {
                    if (format.parse(b.dim) > format.parse(max_dim)) {
                        max_dim = b.dim
                    }
                }
                else {
                    if (b.dim > max_dim) {
                        max_dim = b.dim
                    }

                }
            })
        });


        return ({'min_dim': min_dim, 'max_dim': max_dim, 'min_measure': min_measure, 'max_measure': max_measure })
    }





    var startMonth = actualMonth().startMonth;
    var endMonth = actualMonth().endMonth;


//})