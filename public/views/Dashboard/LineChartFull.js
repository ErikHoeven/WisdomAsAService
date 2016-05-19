$(document).ready(function() {
    $('#tblBusinessRules').hide();

// DataPreparation for multiple serie
    var tw = [];
    var twd = [];
    var format = d3.time.format("%Y-%m-%d");

    tweetsPerCattegoryPerDay.forEach(function (a) {
        var cat = {};
        cat.cattegorie = a.tweetCattegorie
        cat.kleur = a.color
        twd.push({
            dim: a.postDate,
            measure: a.values
        })
        cat.Data = twd
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
            var newValue = {}
            if (Counter == i) {
                oldData = a
            }

            if (Counter > i ){
                if (a.cattegorie == oldData.cattegorie) {
                newValue.dim = tw[Counter].Data[0].dim;
                newValue.measure = tw[Counter].Data[0].measure
                newValue.kleur =  tw[Counter].kleur
                newValue.Cattegorie = tw[Counter].cattegorie

               tw[i].Data.push(newValue);
                //Delete OldData from Tweet
                delete tw[Counter]
                }
            }
            Counter++
        });
    }

var data = tw;

    var margin = {
            top: 20,
            right: 80,
            bottom: 30,
            left: 50
        },
        width = 800 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y-%m-%d").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

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


    var svg = d3.select("body").append("svg")
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
    var varNames = []

    data.forEach( function (a) {

        if (a.cattegorie){
        console.info( a.cattegorie)
        varNames.push(a.cattegorie)
        }
        });

    x.domain([format.parse(domainValues.minDimensionValue), format.parse(domainValues.maxDimesnionValue)]);
    y.domain([0, domainValues.maxMeasure]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")

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

    var legend = svg.selectAll(".legend")
        .data(varNames.slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(55," + i * 20 + ")"; });
    legend.append("rect")
        .attr("x", width - 10)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", color)
        .style("stroke", "grey");
    legend.append("text")
        .attr("x", width - 12)
        .attr("y", 6)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) { return d; });

    function removePopovers () {
        $('.popover').each(function() {
            $(this).remove();
        });
    }
    function showPopover (d) {
        console.info(d);
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

});