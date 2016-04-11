$(document).ready(function() {
   $('#tblBusinessRules').hide();


    // Prepare Data for Graph
    var format = d3.time.format("m-%d");
    var data = getLstValuePerDate(tweetsPerDay);
    var domainValue = getDomainValues(data);

    // prepare SVG properties
    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = 100 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    // Schaalverdeling X -As
    var x = d3.time.scale()
        .range([0, width]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(-height)
        .tickFormat(d3.time.format("%d-%m"));

    // Schaalverdeling X -As
    var y = d3.scale.linear()
        .range([height, 0]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(4)
        .orient("right");

    // Compute the minimum and maximum date, and the maximum price.
    x.domain([domainValue.minDimensionValue, domainValue.maxDimesnionValue]);
    y.domain([0, domainValue.maxMeasure]);

    var area = d3.svg.area()
        .interpolate("monotone")
        .x(function(d) { return x(d.dim); })
        .y0(height)
        .y1(function(d) { return y(d.measure); });

    var line = d3.svg.line()
        .interpolate("monotone")
        .x(function(d) { return x(d.dim); })
        .y(function(d) { return y(d.measure); });

    var svg = d3.select("#lineChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);
    svg
        .datum(data);

    svg.append("path")
        .attr("class", "area")
        .attr("clip-path", "url(#clip)")
        .attr("d", area);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start");

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + ",0)")
        .call(yAxis);

    svg.append("path")
        .attr("class", "line")
        .attr("clip-path", "url(#clip)")
        .attr("d", line);

    svg.append("text")
        .attr("x", width - 6)
        .attr("y", height - 6)
        .style("text-anchor", "end");


});