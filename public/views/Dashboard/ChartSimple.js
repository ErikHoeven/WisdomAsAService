$(document).ready(function() {
   $('#tblBusinessRules').hide();


    // Prepare Data for Graph
    var format = d3.time.format("%Y-%m-%d");
    var data = tweetsPerDay;

    // Prepare SVG properties
    var margin = {top: 50, right: 50, bottom: 50, left: 50},
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    // Schaalverdeling X -As
    var x = d3.time.scale()
        .range([0, width]);

    var xAxis = d3.svg.axis()
        .scale(x)
       .tickFormat(d3.time.format("%d-%m"));

    // Schaalverdeling Y -As
    var y = d3.scale.linear()
        .range([height, 0]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

   // Define the line
   var valueline = d3.svg.line()
     .x(function(d) { return x(format.parse(d.dim)); })
     .y(function(d) { return y(d.measure); });

 // Adds the svg canvas to the div element in the body
 var svg = d3.select("#lineChartSimple")
     .append("svg")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
     .append("g")
     .attr("transform",
         "translate(" + margin.left + "," + margin.top + ")");

 // Compute the minimum and maximum dimension, and the maximum measure.
    x.domain([format.parse(domainValues.minDimensionValue), format.parse(domainValues.maxDimesnionValue)]);
    y.domain([0, domainValues.maxMeasure]);


 // Add the valueline path.
   svg.append("path")
       .attr("class", "simpleLine")
       .attr("d", valueline(data));



   // Add the scatterplot
   svg.selectAll("dot")
       .data(data)
       .enter().append("circle")
       .attr("r", 3.5)
       .attr("cx", function(d) { return x(format.parse(d.dim)); })
       .attr("cy", function(d) { return y(d.measure); })
       .attr("class","simplecircle");

   // Add the X Axis
   svg.append("g")
       .attr("class", "x")
       .attr("transform", "translate(0," + height + ")")
       .call(xAxis)
       .selectAll("text")
           .attr("y", 0)
           .attr("x", 9)
           .attr("dy", ".35em")
           .attr("transform", "rotate(45)")
           .style("text-anchor", "start");

   // Add the Y Axis
   svg.append("g")
       .attr("class", "y")
       .call(yAxis);



});