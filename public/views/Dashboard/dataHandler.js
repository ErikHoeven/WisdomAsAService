//$(document).ready(function() {
    var format = d3.timeFormat("%Y-%m-%d");

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
                return format.parseTime(a.dim) > format.parseTime(b.dim)
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

                if (type == 'ActualWeek'){
                    console.info('erik02 Week');
                    weekNumber = new Date(a.dim).getWeek();
                    monthNumber = new Date(a.dim).getMonth() + 1;
                    insertData = 1;
                }


                if (format.parse(a.dim) >= startDate && format.parse(a.dim) <= endDate) {



                    if (type == 'ActualMonth'){

                    console.info('erik02 Month');
                    weekNumber = new Date(a.dim).getWeek();
                    monthNumber = new Date(a.dim).getMonth() + 1;
                    insertData = 1;
                    }

                    if (type == 'ActualWeek') {
                        newData.push({'cattegorie': a.Cattegorie, 'dim': a.dim, 'kleur': a.kleur, 'measure': a.measure});
                        oldDim = a.dim
                    }

                    if (type == 'ActualMonth') {
                        newData.push({
                            'cattegorie': a.Cattegorie,
                            'dim': weekNumber,
                            'kleur': a.kleur,
                            'measure': a.measure
                        })
                    }

                    if (type == 'ActualYear') {
                        newData.push({
                            'cattegorie': a.Cattegorie,
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

        // H:  Loop through json array data
        for (var i = 0; i < data.length; i++) {
            ds = data[i].Data;

        // H.1 If hhe array has no values of the same dimension (if array ds has a length of 1) then
        // push the element to a new array(td) element
            if (ds.length == 1) {
                td.push(data[i])
            }

        // H.2 Check if the array has new values of the same dimension (if array ds has a greater length of 1) then
        // check if there are more measures with the same dimension.
        // Loop trhoug the Data elements, initialize the variable cattegorie and kleur
            else {
                catteorieValue = data[i].cattegorie;
                kleur = data[i].kleur;

                for (var c = 0; c < ds.length; c++) {
                   if (c == 0) {

                        dim = ds[c].dim;
                        measure = ds[c].measure;
                        dl = []

                    }

                    // If the array has a greater length then 0 elements and the dimension value of the first array element dimension
                    // is not equal to current element dimension and the current element is not equal to the last element
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
                        td.push({'cattegorie': catteorieValue , 'kleur':kleur,'Data': dl,});

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
            max_dim = '1900-01-01';
            min_dim = '9999-12-31';
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





function filterTweetsOnWord(filterSet ) {
    var outputTweets

    $.ajax({
        url: '/Dashboard/findTweetPerNode',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(filterSet),
        success: function (response) {

            addTweetsToSocialBoard(response)
        }
    });
}


function addTweetsToSocialBoard(tweets) {
    console.info('START')
    $('#filteredTweets').html('')


    tweets.forEach(function (tw) {
        $('#filteredTweets').append('<link rel=\"stylesheet\" href=\"https:\/\/abs.twimg.com\/a\/1483667001\/css\/t1\/twitter_core.bundle.css\">')
        $('#filteredTweets').append('<div has-content\" data-screen-name=\"OG3NE\" data-name=\"O\'G3NE\" data-user-id=\"2608128439\" ')
        $('#filteredTweets').append('<div class=\"context\"> <\/div><div class=\"content\"><div class=\"stream-item-header\">')
        $('#filteredTweets').append('<a class=\"account-group js-account-group js-action-profile js-user-profile-link js-nav\" href=\"\/OG3NE\" data-user-id=\"2608128439\">')
        $('#filteredTweets').append('<img class=\"avatar js-action-profile-avatar\" src=\"' + tw.userProfileURL + '\">')
        $('#filteredTweets').append('<strong class=\"fullname js-action-profile-name show-popup-with-id\" data-aria-label-part=\"\">O\'G3NE<\/strong><span>&rlm;<\/span>')
        $('#filteredTweets').append('<span class=\"username js-action-profile-name\" data-aria-label-part=\"\"><s>@<\/s><b>OG3NE<\/b><\/span><\/a><small class=\"time\">')
        $('#filteredTweets').append('<a href=\"\/OG3NE\/status\/815219431957823489\" class=\"tweet-timestamp js-permalink js-nav js-tooltip\" title=\"07:33 - 31 dec. 2016\">')
        $('#filteredTweets').append('<span class=\"_timestamp js-short-timestamp \" data-aria-label-part=\"last\" data-time=\"1483198433\" data-time-ms=\"1483198433000\"')
        $('#filteredTweets').append('<data-long-form=\"true\">31 dec. 2016<\/span><\/a><\/small><\/div><div class=\"js-tweet-text-container\">')
        $('#filteredTweets').append('<p class=\"TweetTextSize  js-tweet-text tweet-text\" lang=\"nl\" data-aria-label-part=\"0\">')
        $('#filteredTweets').append('<img class=\"Emoji Emoji--forText\" src=\"https:\/\/abs.twimg.com\/emoji\/v2\/72x72\/2728.png\"' +
                                       ' draggable=\"false\" alt=\"\u2728\" title=\"Vonken\" aria-label=\"Emoji: Vonken\" data-pin-nopin=\"true\"> ')
        $('#filteredTweets').append('<img class=\"Emoji Emoji--forText\" src=\"https:\/\/abs.twimg.com\/emoji\/v2\/72x72\/1f4a5.png\" ' +
                                         'draggable=\"false\" alt=\"\uD83D\uDCA5\" title=\"Botsing\" aria-label=\"Emoji: Botsing\" ' +
                                         'data-pin-nopin=\"true\"> Het aftellen is begonnen... We kijken straks terug op 2016 en vooruit naar 2017 ! ')
        $('#filteredTweets').append('<img class=\"Emoji Emoji--forText\" src=\"https:\/\/abs.twimg.com\/emoji\/v2\/72x72\/2728.png\" ' +
                                         'draggable=\"false\" alt=\"\u2728\" title=\"Vonken\" aria-label=\"Emoji: Vonken\">')
        $('#filteredTweets').append('<img class=\"Emoji Emoji--forText\" src=\"https:\/\/abs.twimg.com\/emoji\/v2\/72x72\/1f4a5.png\" ' +
                                         'draggable=\"false\" alt=\"\uD83D\uDCA5\" title=\"Botsing\" ' +
                                         'aria-label=\"Emoji: Botsing\"> Tijd Voor Max | 16:50 (Lisa weer aan de drank ')
        $('#filteredTweets').append('<img class=\"Emoji Emoji--forText\" src=\"https:\/\/abs.twimg.com\/emoji\/v2\/72x72\/1f602.png\" ' +
                                         'draggable=\"false\" alt=\"\uD83D\uDE02\" title=\"Gezicht met tranen van geluk\" aria-label=\"Emoji: Gezicht met tranen van geluk\">')
        $('#filteredTweets').append('<img class=\"Emoji Emoji--forText\" src=\"https:\/\/abs.twimg.com\/emoji\/v2\/72x72\/1f37e.png\" ' +
                                         'draggable=\"false\" alt=\"\uD83C\uDF7E\" title=\"Fles met ploppende kurk\" aria-label=\"Emoji: Fles met ploppende kurk\">')
        $('#filteredTweets').append('<a href=\"https:\/\/t.co\/F6nRcCGXlv\" class=\"twitter-timeline-link u-hidden\" data-pre-embedded=\"true\" dir=\"ltr\">pic.twitter.com\/F6nRcCGXlv<\/a>')
        $('#filteredTweets').append('<\/p><\/div><div class=\"AdaptiveMedia is-squar\"><div class=\"AdaptiveMedia-container js-adaptive-media-container\">')
         $('#filteredTweets').append('<div class=\"AdaptiveMedia-singlePhoto\"><div class=\"AdaptiveMedia-photoContainer js-adaptive-photo \" ' +
                                          'data-image-url=\"https:\/\/pbs.twimg.com\/media\/C1A9vvdXAAAtQOL.jpg\" ' +
                                          'data-element-context=\"platform_photo_card\">' +
                                          '<img src=\"'+    + '\" ' +
                                          'style=\"width: 100%; top: -0px;\"><\/div><\/div><\/div><\/div><div class=\"stream-item-footer\"><br>')

        console.info(tw.userProfileURL)
    })

}


