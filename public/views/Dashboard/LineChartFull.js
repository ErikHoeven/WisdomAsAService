$(document).ready(function() {
    $('#tblBusinessRules').hide();

// Modules
    if (!Array.prototype.filter) {
        Array.prototype.filter = function(fun /*, thisp*/) {
            var len = this.length >>> 0;
            if (typeof fun != "function")
                throw new TypeError();

            var res = [];
            var thisp = arguments[1];
            for (var i = 0; i < len; i++) {
                if (i in this) {
                    var val = this[i]; // in case fun mutates this
                    if (fun.call(thisp, val, i, this))
                        res.push(val);
                }
            }
            return res;
        }
    }
// DataPreparation for multiple serie
    var format = d3.time.format("%Y-%m-%d");

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
    var data = [];
    var data = setTweetsPerCattegoryPerDay(tweetsPerCattegoryPerDay, tweetsPerDay);
    console.info('DATA:');
    // Prepare SVG properties
    var margin = {top: 70, right: 70, bottom: 70, left: 70},
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y-%m-%d").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.time.format("%d-%m"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        //.interpolate("basis")
        .x(function (d) {

            return x(d.dim);
        })
        .y(function (d) {
            return y(d.measure);
        });


    var svg = d3.select("#lineChartSimple").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function (kv) {
        kv.Data.forEach(function (d) {
            d.dim = parseDate(d.dim);
        });
    });


    var serieData = data;
    var varNames = [];

    data.forEach( function (a) {

        if (a.cattegorie){
        varNames.push({cattegorie: a.cattegorie, kleur: a.kleur})
        }
        });

    console.info(serieData);

    x.domain([format.parse(domainValues.minDimensionValue), format.parse(domainValues.maxDimesnionValue)]);
    y.domain([0, domainValues.maxMeasure]);

    svg.append("g")
        .attr("class", "x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("transform", "rotate(45)");

    svg.append("g")
        .attr("class", "y")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

    var serie = svg.selectAll(".cattegorie")
        .data(serieData)
        .enter().append("g")
        .attr("class", "cattegorie");

    serie.append("path")
        .attr("class", "simpleLine")
        .attr("d", function (d) {
            return line(d.Data);
        })
        .style("stroke", function (d) {
             return '#' + d.kleur;
        });

    // Add the scatterplot
    serie.selectAll(".point")
        .data(function (d) { return d.Data; })
        .enter().append("circle")
        .attr("class", "point")
        .attr("cx", function (d) { return x(d.dim) ; })
        .attr("cy", function (d) { return y(d.measure); })
        .attr("r", "5px")
        .style("fill", function (d) {
           return '#' + d.kleur; })
        .style("stroke", "grey")
        .style("stroke-width", "2px")
        .on("mouseover", function (d) {
            showPopover.call(this, d); })
        .on("mouseout",  function (d) { removePopovers(); })
        .on("click", function (d) { showTable(d); });


    //Add legend to the SVG Area
    var legend = svg.selectAll(".legend")
        .data(varNames.slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(55," + i * 20 + ")"; });
    legend.append("rect")
        .attr("x", width - 10)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", function(d) { return '#' + d.kleur})
        .style("stroke", "grey");
    legend.append("text")
        .attr("x", width - 12)
        .attr("y", 6)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) { return d.cattegorie; });

    function removePopovers () {
        $('.popover').each(function() {
            $(this).remove();
        });
    }
    function showPopover (d) {
        $(this).popover({
            title: d.name,
            placement: 'auto top',
            container: 'body',
            trigger: 'manual',
            html: true,
            content: function () {
                return "Cattegorie: " + d.Cattegorie +
                    "<br/>Waarde: " + d.measure
            }
        });
        $(this).popover('show')
    }

    function showTable (d){

        console.info(d);
        var invalidEntries = 0;
        var tblTweets = stgTweets.filter(function (el) {
            return el.tweetCattegorie == d.Cattegorie &&
                format.parse(el.postDate) == d.dim;
        });
        console.info(tblTweets)
    }







});