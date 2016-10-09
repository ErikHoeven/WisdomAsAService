/**
 * Created by root on 2-8-16.
 */
$(document).ready(function() {

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


    function setTweetsPerCattegoryPerDay(jsonInput, tweetsPerDay){
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
                kleur : "#63AC38",
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

            tw = tw.filter(function (element){
                return !!element
            });

            tw.forEach(function (a) {
                var newValue = {};
                if (Counter == i) {
                    oldData = a
                }

                if (Counter > i ){
                    if (a.cattegorie == oldData.cattegorie) {
                        newValue.dim = tw[Counter].Data[0].dim;
                        newValue.measure = tw[Counter].Data[0].measure;
                        newValue.kleur =  tw[Counter].kleur;
                        newValue.Cattegorie = tw[Counter].cattegorie;
                        tw[i].Data.push(newValue);
                        //Delete OldData from Twee
                        delete tw[Counter]
                    }
                }
                Counter++
            });
        }

        tw.forEach(function(a){
            a.Data = a.Data.sort(function(a,b){ return format.parse(a.dim) > format.parse(b.dim)})
        });



        return tw
    }

    function filterDates (startDate, endDate, dataSet, type ){
           console.info(dataSet)

            
        }





});




