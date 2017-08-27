$(document).ready(function(){

    // Prepare SVG properties
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 550 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;

    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x0)
        .tickSize(0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var color = d3.scale.ordinal()
        .range(["#ca0020","#f4a582","#d5d5d5","#92c5de","#0571b0"]);

    var svg = d3.select('#' + div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)


    x.domain(tweetsPerCattegorry.map(function (d) { return d.label }));
    y.domain([0, domainValues.maxMeasure]);

    svg.append("g")
        .attr("class", "x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .attr("y", 15)
        .attr("x", 9)
        .attr("dy", ".35em");

    svg.append("g")
        .attr("class", "y")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

    svg.selectAll(".bar")
        .data(tweetsPerCattegorry)
        .enter().append("rect")
        .attr("x", function(d) { return x(d.label); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) { return '#' + d.color});


});
