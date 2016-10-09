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


        for (var i = 0; i < dataSet.length; i++) {
            var newData = [];
            var oldData = dataSet[i].Data;
            var insertData = 0;


            oldData.forEach(function (a) {
                var counter = 0;

                if (a.dim >= startDate && a.dim <= endDate) {
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
                        catteorieValue = ds[c].Cattegorie;
                        dim = ds[c].dim;
                        kleur = ds[c].kleur;
                        measure = ds[c].measure;

                        dl = []

                    }

                    // Count > 0; Compare JSON with globale variable and count the measure
                    if (c > 0 && dim == ds[c].dim) {
                        measure = measure + ds[c].measure
                    }

                    // Einde loop JSON row wordt toegeovegod
                    if (c + 1 == ds.length) {
                        dl.push({'cattegorie': catteorieValue, 'kleur': kleur, 'measure': measure});
                        td.push({'Data': dl, 'cattegorie': dataSet[c].cattegorie, 'kleur': dataSet[c].kleur})
                    }

                }
            }
        }
        console.info('td');
        console.info(td);
        console.info('----------');
        return td
    }

    var startMonth = actualMonth().startMonth;
    var endMonth = actualMonth().endMonth;


//})